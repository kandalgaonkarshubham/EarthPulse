import { useState, useEffect } from "react";

import FilterLayout from "@/components/FilterLayout";
import FilterCornersUI from "@/components/CornersUI";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Map from "@/components/Map";
import EQModalNew from "@/components/EQModal";
import { useFilterContext } from "@/context/Filter";

import Cluster from "./components/Cluster";

export default function App() {
  const {
    earthquakes,
    setEarthquakes,
    selectedEarthquake,
    isModalOpen,
    setIsModalOpen,
  } = useFilterContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarthquakeData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEarthquakes(data.features);
      } catch (error) {
        setError(error.message);
        setEarthquakes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEarthquakeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-900 text-white font-sans">
      <FilterLayout>
        {loading ? (
          <Loader />
        ) : earthquakes.length !== 0 ? (
          <Map />
        ) : (
          <Error error={error} />
        )}
      </FilterLayout>

      <div className="absolute inset-0 z-30 pointer-events-none">
        <FilterCornersUI />
      </div>

      {selectedEarthquake && (
        <EQModalNew
          quake={selectedEarthquake}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
