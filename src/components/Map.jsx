import { useEffect, useRef, useState, useCallback } from "react";
import debounce from "lodash.debounce";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import EQModalNew from "./EQModalNew";

import { useFilterContext } from "@/context/Filter";

export default function Map() {
  const {
    earthquakes,
    magnitudeFilter,
    magnitudeTypeFilter,
    significanceFilter,
    tsunamiFilter,
    statusFilter,
    alertFilter,
    timeFilter,
    getFilteredData,
    resetMap,
    setLocation,
    setHemisphere,
    setMapZoom,
    selectedEarthquake,
    setSelectedEarthquake,
    isModalOpen,
    setIsModalOpen,
  } = useFilterContext();

  const [filteredEarthquakes, setFilteredEarthquakes] = useState(earthquakes);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const lastCoordsRef = useRef({ lng: 0, lat: 0 });

  const handleModalChange = (e) => setIsModalOpen(e);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      // style: "mapbox://styles/mapbox/dark-v11",
      style: "mapbox://styles/kandalgaonkarshubham/cmn47fztf001t01r28b4ncilt",
      center: [73.22969, 19.15705],
      zoom: 2,
      projection: "globe",
      accessToken: import.meta.env.VITE_MAPBOX_KEY,
    });
    mapRef.current = map;

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    // ── Report zoom to context ───────────────────────────────────────────────
    const handleZoom = () => {
      setMapZoom(map.getZoom());
    };
    map.on("zoom", handleZoom);
    // Report initial zoom once loaded
    map.on("load", () => {
      setMapZoom(map.getZoom());
    });
    // ────────────────────────────────────────────────────────────────────────

    const updateLocationInfo = async () => {
      if (!mapRef.current) return;
      const { lng, lat } = mapRef.current.getCenter();

      // Skip if movement is negligible (less than ~0.05 degrees, about 5.5km at equator)
      // to save Mapbox Geocoding API costs.
      const dx = lng - lastCoordsRef.current.lng;
      const dy = lat - lastCoordsRef.current.lat;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 0.05 && lastCoordsRef.current.lng !== 0) {
        return;
      }

      lastCoordsRef.current = { lng, lat };

      const latHem = lat >= 0 ? "North" : "South";
      setHemisphere(`${latHem} hemisphere`);

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${import.meta.env.VITE_MAPBOX_KEY}&types=country,region`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const regionFeature = data.features.find((f) => f.place_type.includes("region"));
          const countryFeature = data.features.find((f) => f.place_type.includes("country"));

          const region = regionFeature?.text;
          const country = countryFeature?.text;

          if (region && country) {
            setLocation(`${region}, ${country}`);
          } else if (country) {
            setLocation(country);
          } else {
            setLocation("International Waters");
          }
        } else {
          setLocation("International Waters");
        }
      } catch (err) {
        console.error("Geocoding failed", err);
      }
    };

    const debouncedUpdateLocation = debounce(updateLocationInfo, 1000);

    map.on("style.load", () => {
      if (map.getLayer("background")) {
        map.setPaintProperty("background", "background-opacity", 0);
      }

      map.setFog({
        color: "rgba(0, 0, 0, 0)",
        "high-color": "rgba(0, 0, 0, 0)",
        "horizon-blend": 0,
        "space-color": "rgba(0, 0, 0, 0)",
        "star-intensity": 0,
      });
    });

    map.on("load", () => {
      updateLocationInfo();

      map.addSource("earthquakes", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: filteredEarthquakes,
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "earthquakes",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#baebff",
            20,
            "#bebcfc",
            40,
            "#d689ff",
            60,
            "#a564d3",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
          "circle-emissive-strength": 1,
        },
      });
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "earthquakes",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["Montserrat Alternates", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#000000",
          "text-halo-color": "rgba(255,255,255,0.7)",
          "text-halo-width": 1,
        }
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "earthquakes",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": [
            "step",
            ["get", "mag"],
            "#eed7a1",
            3,
            "#84cdee",
            5,
            "#ffbcda",
            7,
            "#eb2d3a",
          ],
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            2, 8,
            6, 16,
            10, 24,
            14, 32,
          ],
          "circle-blur": 1,
          "circle-opacity": 0.7,
          "circle-emissive-strength": 1,
        },
      });

      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0].properties.cluster_id;
        map
          .getSource("earthquakes")
          .getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });

      map.on("click", "unclustered-point", (e) => {
        const clickedFeature = e.features[0];
        // Mapbox strips the Z coordinate (depth) from rendered features.
        // We find the original feature in our data by 'code' to get the full coordinates and ID.
        const earthquake = earthquakes.find(q => q.properties.code === clickedFeature.properties.code) || clickedFeature;
        
        const coordinates = clickedFeature.geometry.coordinates.slice(0, 2);
        map.easeTo({
          center: coordinates,
          zoom: 8,
        });

        map.once("moveend", () => {
          const eventTime = new Date(earthquake.properties.time);
          const timeStr = eventTime.toLocaleString('en-US', { month: 'short', day: '2-digit' }).toUpperCase() + ' · ' + 
                         eventTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
          const eventType = (earthquake.properties.type || "Seismic Event").toUpperCase();
          const magValue = earthquake.properties.mag || 0;
          const isHighMag = magValue >= 5.0;
          const magColor = isHighMag ? "#ef4444" : "#f59e0b";
          const magGlow = isHighMag ? "rgba(239, 68, 68, 0.5)" : "rgba(245, 158, 11, 0.4)";

          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnMove: true,
            className: "futuristic-popup",
          })
            .setLngLat(coordinates)
            .setHTML(
              `<div class="glass-panel w-72 rounded-[2rem] p-6 shadow-2xl glass-highlight border-primary/20 bg-surface/80 font-body">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                  <span style="font-family: 'Space Grotesk', sans-serif; font-size: 9px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.3em; color: rgba(16, 185, 129, 0.8); text-shadow: 0 0 15px rgba(16, 185, 129, 0.5);">${eventType}</span>
                  <span style="font-family: 'Space Grotesk', sans-serif; font-size: 9px; font-weight: 700; color: #4b5563;">${timeStr}</span>
                </div>
                
                <div style="margin-bottom: 2px;">
                  <span style="font-family: 'Space Grotesk', sans-serif; color: ${magColor}; font-weight: 900; font-size: 42px; line-height: 1; text-shadow: 0 0 15px ${magGlow};">${magValue.toFixed(1)}</span>
                  <span style="font-family: 'Space Grotesk', sans-serif; color: ${magColor}; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.8; margin-left: 8px;">${earthquake.properties.magType?.toUpperCase() || 'MD'}</span>
                </div>
                
                <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; line-height: 1.4; color: #f1f5f9; opacity: 0.9;">${earthquake.properties.place}</h3>
                
                <div style="border-top: 1px solid rgba(16, 185, 129, 0.1); margin: 20px 0 16px 0;"></div>
                
                <button class="readmore" style="width: 100%; padding: 4px 0; background: transparent; color: #10b981; font-family: 'Space Grotesk', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 0.2em; border: none; cursor: pointer; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 8px;">
                  ANALYZE TELEMETRY
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8">
                    <line x1="7" y1="17" x2="17" x2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </button>
              </div>`
            )
            .addTo(map);

          function getMagnitudeColor(mag) {
            if (mag < 3) return '#FF9D00';
            if (mag < 5) return '#FF6B35';
            return '#FF0000';
          }

          setSelectedEarthquake(earthquake);
          popup.getElement().addEventListener("click", () => {
            handleModalChange(true);
          });
        });
      });

      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseenter", "unclustered-point", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    map.on("moveend", debouncedUpdateLocation);

    return () => {
      resizeObserver.disconnect();
      map.off("zoom", handleZoom);
      map.off("moveend", debouncedUpdateLocation);
      debouncedUpdateLocation.cancel();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      magnitudeFilter != null ||
      magnitudeTypeFilter != null ||
      significanceFilter != null ||
      tsunamiFilter != null ||
      statusFilter != null ||
      alertFilter != null ||
      timeFilter != null ||
      resetMap
    ) {
      const refilteredData = getFilteredData();
      setFilteredEarthquakes(refilteredData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    magnitudeFilter,
    magnitudeTypeFilter,
    significanceFilter,
    tsunamiFilter,
    statusFilter,
    alertFilter,
    timeFilter,
    resetMap,
  ]);

  useEffect(() => {
    if (mapRef.current && mapRef.current.getSource("earthquakes")) {
      mapRef.current.getSource("earthquakes").setData({
        type: "FeatureCollection",
        features: filteredEarthquakes,
      });
    }
  }, [filteredEarthquakes]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
