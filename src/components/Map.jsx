import { useEffect, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import debounce from "lodash.debounce";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import EarthquakePopup from "./EarthquakePopup";

import { useFilterContext } from "@/context/Filter";

export default function Map() {
  const {
    isModalOpen,
    setIsModalOpen,
    filteredEarthquakes,
    selectedEarthquake,
    setSelectedEarthquake,
    setLocation,
    setHemisphere,
    setMapZoom,
    earthquakes,
  } = useFilterContext();

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const lastCoordsRef = useRef({ lng: 0, lat: 0 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleModalChange = (e) => setIsModalOpen(e);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      // style: "mapbox://styles/mapbox/dark-v11",
      style: import.meta.env.VITE_MAPBOX_STYLE,
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
        color: "#1a0f00", // Lower atmosphere
        "high-color": "#140c00", // Upper atmosphere
        "horizon-blend": 0.02, // Atmosphere thickness
        "space-color": "#000a07", // Background color
        "star-intensity": 0.35, // Background star brightness
      });
      // map.setFog(null);
    });

    map.on("load", () => {
      setIsMapLoaded(true);
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
        const earthquake = earthquakes.find(q => q.properties.code === clickedFeature.properties.code) || clickedFeature;
        const coordinates = clickedFeature.geometry.coordinates.slice(0, 2);

        map.easeTo({ center: coordinates, zoom: 8 });

        // Wait for zoom to finish, then show popup
        map.once("moveend", () => {
          const eventTime = new Date(earthquake.properties.time);
          const timeStr = eventTime.toLocaleString('en-US', { month: 'short', day: '2-digit' }).toUpperCase() + ' · ' +
                        eventTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
          const eventType = (earthquake.properties.type || "Seismic Event").toUpperCase();

          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnMove: false,
            className: "futuristic-popup",
          }).setLngLat(coordinates);

          const popupNode = document.createElement("div");
          const root = createRoot(popupNode);
          root.render(
            <EarthquakePopup earthquake={earthquake} timeStr={timeStr} eventType={eventType} />
          );

          popup.setDOMContent(popupNode).addTo(map);
          setSelectedEarthquake(earthquake);

          popup.getElement().addEventListener("click", () => {
            handleModalChange(true);
          });

          popup.on("close", () => {
            setTimeout(() => root.unmount(), 0);
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
    if (isMapLoaded && mapRef.current && mapRef.current.getSource("earthquakes")) {
      mapRef.current.getSource("earthquakes").setData({
        type: "FeatureCollection",
        features: filteredEarthquakes,
      });
    }
  }, [filteredEarthquakes, isMapLoaded]);

  useEffect(() => {
    if (selectedEarthquake && mapRef.current) {
      const coordinates = selectedEarthquake.geometry.coordinates.slice(0, 2);
      mapRef.current.easeTo({
        center: coordinates,
        zoom: 8,
      });
    }
  }, [selectedEarthquake]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
