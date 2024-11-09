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

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [73.22969, 19.15705],
      zoom: 2,
      accessToken: import.meta.env.VITE_MAPBOX_KEY,
    });

    mapRef.current.on("load", () => {
      mapRef.current.addSource("earthquakes", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: filteredEarthquakes,
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      mapRef.current.addLayer({
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
      mapRef.current.addLayer({
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

      mapRef.current.addLayer({
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

      mapRef.current.on("click", "clusters", (e) => {
        const features = mapRef.current.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0].properties.cluster_id;
        mapRef.current
          .getSource("earthquakes")
          .getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            mapRef.current.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });
      mapRef.current.on("click", "unclustered-point", (e) => {
        const earthquake = e.features[0];
        const coordinates = earthquake.geometry.coordinates.slice(0, 2);
        mapRef.current.easeTo({
          center: coordinates,
          zoom: 8,
        });

        mapRef.current.once("moveend", () => {
          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnMove: true,
            className: "eq-popup",
          })
            .setLngLat(coordinates)
            .setHTML(
              ` <h3>${earthquake.properties.title}</h3>
                <p><span>Magnitude:</span> ${earthquake.properties.mag}</p>
                <p><span>Location:</span> ${earthquake.properties.place}</p>
                <p class="readmore">Read More...</p>
              `
            )
            .addTo(mapRef.current);

          setSelectedEarthquake(earthquake);
          popup.getElement().addEventListener("click", () => {
            handleModalChange(true);
          });
        });
      });

      mapRef.current.on("mouseenter", "clusters", () => {
        mapRef.current.getCanvas().style.cursor = "pointer";
      });
      mapRef.current.on("mouseenter", "unclustered-point", () => {
        mapRef.current.getCanvas().style.cursor = "pointer";
      });
      mapRef.current.on("mouseleave", "clusters", () => {
        mapRef.current.getCanvas().style.cursor = "";
      });
    });
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
    <div className="w-full h-full rounded-lg">
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
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
