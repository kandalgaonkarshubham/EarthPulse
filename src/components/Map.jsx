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
          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnMove: true,
            className: "futuristic-popup",
          })
            .setLngLat(coordinates)
            .setHTML(
              `<div class="eq-popover">
                <div class="eq-popover-inner">
                  <div class="eq-popover-magnitude-section" style="margin-top: 10px;">
                    <div class="eq-popover-label">MAGNITUDE</div>
                    <div class="eq-popover-magnitude" style="color: ${getMagnitudeColor(earthquake.properties.mag)};">
                      ${earthquake.properties.mag.toFixed(1)} <span class="eq-popover-magnitude-unit">${earthquake.properties.magType?.toUpperCase() || 'ML'}</span>
                    </div>
                  </div>
                  <div class="eq-popover-location-section">
                    <div class="eq-popover-location-text" style="font-size: 14px; margin-bottom: 0;">${earthquake.properties.place}</div>
                  </div>
                  <div class="eq-popover-footer" style="margin-top: 15px;">
                    <button class="readmore eq-popover-read-more" style="width: 100%; justify-content: center; background: rgba(0, 185, 129, 0.1); border-color: #00B981; color: #00B981;">
                      READ MORE <span style="margin-left: 4px;">→</span>
                    </button>
                  </div>
                </div>
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
