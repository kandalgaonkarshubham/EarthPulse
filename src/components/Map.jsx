import { useEffect, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import debounce from "lodash.debounce";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import EarthquakePopup from "./EarthquakePopup";
import PulsatingDot from "./PulsatingDot";
import Cluster from "./Cluster";

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
  const markersRef = useRef({}); // Track markers by earthquake code
  const earthquakesRef = useRef(earthquakes);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    earthquakesRef.current = earthquakes;
  }, [earthquakes]);

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
    });

    const updateMarkers = () => {
      if (!mapRef.current) return;

      // Query all unclustered features and clusters currently in view
      const features = mapRef.current.queryRenderedFeatures({ layers: ["unclustered-point", "clusters"] });
      const currentMarkers = {};

      features.forEach((feature) => {
        const isCluster = !!feature.properties.point_count;
        const code = isCluster ? `cluster_${feature.properties.cluster_id}` : feature.properties.code;
        const coords = feature.geometry.coordinates;

        if (!markersRef.current[code]) {
          // Create a new marker
          const el = document.createElement("div");
          el.className = isCluster ? "custom-cluster-marker" : "custom-marker";

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat(coords)
            .addTo(mapRef.current);

          // Add click listener
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            if (isCluster) {
              handleClusterClick(feature);
            } else {
              handleMarkerClick(feature);
            }
          });

          const root = createRoot(el);
          if (isCluster) {
            root.render(<Cluster value={feature.properties.point_count} />);
          } else {
            const mag = feature.properties.mag;
            let variant = "minor";
            if (mag >= 6) variant = "severe";
            else if (mag >= 4) variant = "strong";
            else if (mag >= 2) variant = "moderate";
            root.render(<PulsatingDot variant={variant} />);
          }

          markersRef.current[code] = { marker, root };
        }
        currentMarkers[code] = true;
      });

      // Remove markers that are no longer in view
      Object.keys(markersRef.current).forEach((code) => {
        if (!currentMarkers[code]) {
          markersRef.current[code].marker.remove();
          markersRef.current[code].root.unmount();
          delete markersRef.current[code];
        }
      });
    };

    const handleClusterClick = (feature) => {
      const clusterId = feature.properties.cluster_id;
      mapRef.current
        .getSource("earthquakes")
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          mapRef.current.easeTo({
            center: feature.geometry.coordinates,
            zoom: zoom,
          });
        });
    };

    const handleMarkerClick = (clickedFeature) => {
      const earthquake = earthquakesRef.current.find(q => q.properties.code === clickedFeature.properties.code) || clickedFeature;
      const coordinates = clickedFeature.geometry.coordinates.slice(0, 2);

      mapRef.current.easeTo({ center: coordinates, zoom: 8 });

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

      popup.setDOMContent(popupNode).addTo(mapRef.current);
      setSelectedEarthquake(earthquake);

      popup.getElement().addEventListener("click", () => {
        handleModalChange(true);
      });

      popup.on("close", () => {
        setTimeout(() => root.unmount(), 0);
      });
    };

    map.on("load", () => {
      // Run on move/zoom
      map.on("move", updateMarkers);
      map.on("moveend", updateMarkers);
      map.on("data", (e) => {
        if (e.sourceId === "earthquakes" && e.isSourceLoaded) {
          updateMarkers();
        }
      });

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
          "circle-radius": 20,
          "circle-color": "rgba(0,0,0,0)",
          "circle-opacity": 0,
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
          "text-opacity": 0,
        }
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "earthquakes",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": 20, // Hit area
          "circle-color": "rgba(0,0,0,0)", // Invisible hit area
          "circle-opacity": 0,
        },
      });

      // Clusters handle their own clicks now

      // Markers handle their own clicks now

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
      map.off("move", updateMarkers);
      map.off("moveend", updateMarkers);
      debouncedUpdateLocation.cancel();

      // Cleanup markers
      Object.keys(markersRef.current).forEach((code) => {
        markersRef.current[code].marker.remove();
        markersRef.current[code].root.unmount();
      });
      markersRef.current = {};

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
