import { useState, useEffect } from "react";

import Header from "@/components/Header";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Map from "@/components/Map";
import SideFilterPanel from "@/components/SideFilterPanel";
import CornerInfo from "@/components/CornerInfo";

import { useFilterContext } from "@/context/Filter";

function App() {
  const { earthquakes, setEarthquakes } = useFilterContext();

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
    <div className="h-screen w-screen overflow-hidden bg-gradient-futuristic relative">
      {/* Header */}
      <Header
        fetchedTime={fetchedTime}
        handleRefetch={handleRefetch}
      />

      {/* Main Content */}
      {loading ? (
        <Loader />
      ) : earthquakes.length != 0 ? (
        <>
          {/* Map */}
          <Map />

          {/* Side Panels */}
          <SideFilterPanel side="left" />
          <SideFilterPanel side="right" />

          {/* Corner Info Displays */}
          <CornerInfo />
        </>
      ) : (
        <Error error={error} />
      )}
    </div>
  );
}

export default App;
