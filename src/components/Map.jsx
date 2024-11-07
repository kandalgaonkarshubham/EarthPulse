/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Map({
  viewstate,
  updateViewState,
  earthquakes,
  filters,
}) {
  const { magnitudeFilter, depthFilter, significanceFilter } = filters;

  const filteredEarthquakes = earthquakes.filter((quake) => {
    const mag = quake.properties.mag;
    const depth = quake.geometry.coordinates[2];
    const significance = quake.properties.sig;
    return (
      mag >= magnitudeFilter &&
      depth >= depthFilter[0] &&
      depth <= depthFilter[1] &&
      significance >= significanceFilter
    );
  });

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [viewstate.longitude, viewstate.latitude],
      zoom: viewstate.zoom,
      accessToken: import.meta.env.VITE_MAPBOX_KEY,
    });

    mapRef.current.on("load", () => {
      mapRef.current.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/cat.png",
        (error, image) => {
          if (error) throw error;
          mapRef.current.addImage("eqicon", image);

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
                "#f1f075",
                20,
                "#51bbd6",
                40,
                "#f28cb1",
                60,
                "#ee6c4d",
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
            type: "symbol",
            source: "earthquakes",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-color": [
                "step",
                ["get", "mag"],
                "#00bcd4", // Color for lower magnitudes
                3,
                "#ff9800", // Medium magnitude
                5,
                "#f44336", // Higher magnitude
                7,
                "#d32f2f", // Very high magnitude
              ],
              // Size based on magnitude
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["get", "mag"],
                // 1,
                // 4, // Smallest size for low magnitude
                // 3,
                // 8, // Medium size for moderate magnitude
                // 5,
                // 12, // Large size for higher magnitude
                // 7,
                // 16, // Largest size for very high magnitude
                2,
                8, // Smallest size for low magnitude
                6,
                16, // Medium size for moderate magnitude
                10,
                24, // Large size for higher magnitude
                14,
                32, // Largest size for very high magnitude
              ],
              "circle-stroke-width": 1,
              "circle-stroke-color": "#fff",
            },
            layout: {
              "icon-image": [
                "case",
                ["==", ["get", "tsunami"], 1], // Check if tsunami property is 1
                "tsunami-icon", // Use tsunami icon if tsunami
                "eqicon", // Otherwise, use earthquake icon
              ],
              "icon-size": 0.05,
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
            setTimeout(() => {
              setSelectedEarthquake(earthquake);
              setIsModalOpen(true);
            }, 1000);
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
          mapRef.current.on("moveend", () => {
            const lngLat = mapRef.current.getCenter();
            const zoom = mapRef.current.getZoom();
            updateViewState(lngLat, zoom);
          });

          //
        }
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mapRef.current && mapRef.current.getSource("earthquakes")) {
      mapRef.current.getSource("earthquakes").setData({
        type: "FeatureCollection",
        features: filteredEarthquakes,
      });
    }
  }, [viewstate, filteredEarthquakes]);

  return (
    <div className="w-full h-full rounded-lg pt-14">
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
      {selectedEarthquake && isModalOpen && (
        <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectedEarthquake.properties.title}
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div>
                  <p>
                    <strong>Magnitude:</strong>{" "}
                    {selectedEarthquake.properties.mag}
                  </p>
                  <p>
                    <strong>Depth:</strong>{" "}
                    {selectedEarthquake.geometry.coordinates[2]} km
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {selectedEarthquake.properties.place}
                  </p>
                  <p>
                    <strong>Tsunami:</strong>{" "}
                    {selectedEarthquake.properties.tsunami ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(
                      selectedEarthquake.properties.time
                    ).toLocaleString()}
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsModalOpen(false)}>
                Close
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => setIsModalOpen(false)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
