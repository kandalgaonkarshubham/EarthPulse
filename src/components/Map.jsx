import { useEffect, useRef, useState } from "react";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import EQModal from "./EQModal";

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
  } = useFilterContext();

  const [filteredEarthquakes, setFilteredEarthquakes] = useState(earthquakes);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalChange = (e) => setIsModalOpen(e);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [73.22969, 19.15705],
      zoom: 2,
      projection: "globe", // Explicitly enable globe projection
      accessToken: import.meta.env.VITE_MAPBOX_KEY,
    });
    mapRef.current = map;

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    map.on("style.load", () => {
      // Remove or make the style's background transparent
      if (map.getLayer("background")) {
        map.setPaintProperty("background", "background-opacity", 0);
      }

      // Setting atmospheric fog to be completely transparent with no stars
      map.setFog({
        color: "rgba(0, 0, 0, 0)",
        "high-color": "rgba(0, 0, 0, 0)",
        "horizon-blend": 0,
        "space-color": "rgba(0, 0, 0, 0)",
        "star-intensity": 0,
      });
    });

    map.on("load", () => {
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
        },
      });
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "earthquakes",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
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
            "#eed7a1", // Color for lower magnitudes
            3,
            "#84cdee", // Medium magnitude
            5,
            "#ffbcda", // Higher magnitude
            7,
            "#eb2d3a", // Very high magnitude
          ],
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            2,
            8, // Smallest size for low magnitude
            6,
            16, // Medium size for moderate magnitude
            10,
            24, // Large size for higher magnitude
            14,
            32, // Largest size for very high magnitude
          ],
          "circle-blur": 1,
          "circle-opacity": 0.7,
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
        const earthquake = e.features[0];
        const coordinates = earthquake.geometry.coordinates.slice(0, 2);
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
              ` <div class="p-3 bg-black/80 border border-cyan-500/50 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.3)] backdrop-blur-md text-white font-sans">
                  <h3 class="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-2 border-b border-cyan-500/30 pb-1">${earthquake.properties.title}</h3>
                  <p class="text-xs mb-1"><span class="text-gray-400">Magnitude:</span> <span class="text-white font-mono">${earthquake.properties.mag}</span></p>
                  <p class="text-xs mb-3"><span class="text-gray-400">Location:</span> <span class="text-white">${earthquake.properties.place}</span></p>
                  <button class="readmore w-full py-1.5 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/50 rounded text-cyan-300 text-xs uppercase tracking-widest transition-colors">Read More</button>
                </div>
              `
            )
            .addTo(map);

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

    return () => {
      resizeObserver.disconnect();
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
      {selectedEarthquake && isModalOpen && (
        <EQModal
          quake={selectedEarthquake}
          isModalOpen={isModalOpen}
          handleModalChange={handleModalChange}
        />
      )}
    </div>
  );
}
