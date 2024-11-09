import { useState, useEffect } from "react";

import Header from "@/components/Header";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Map from "@/components/Map";

import { useFilterContext } from "@/context/Filter";
import FilterDrawer from "./components/FilterDrawer";

function App() {
  const { earthquakes, setEarthquakes } = useFilterContext();

  const [drawer, setDrawer] = useState(false);
  const toggleDrawer = () => setDrawer(!drawer);

  const [fetchedTime, setFetchedTime] = useState(" ");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const handleRefetch = () => {
    setRefetch(!refetch);
  };

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
        setFetchedTime(
          new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
        );
      } catch (error) {
        setError(error.message);
        setEarthquakes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEarthquakeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  return (
    <div className="h-screen flex flex-col items-start p-4">
      <Header
        toggleDrawer={toggleDrawer}
        fetchedTime={fetchedTime}
        handleRefetch={handleRefetch}
      />
      {loading ? (
        <Loader />
      ) : earthquakes.length != 0 ? (
        <Map />
      ) : (
        <Error error={error} />
      )}
      <FilterDrawer drawer={drawer} toggleDrawer={toggleDrawer} />
    </div>
  );
}

export default App;
