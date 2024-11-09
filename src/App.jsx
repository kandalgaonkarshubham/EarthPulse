import { useState, useEffect } from "react";

import Header from "@/components/Header";
import Loader from "@/components/Loader";
import Map from "@/components/Map";

import { useFilterContext } from "@/context/Filter";
import FilterDrawer from "./components/FilterDrawer";

function App() {
  const { earthquakes, setEarthquakes } = useFilterContext();

  const [drawer, setDrawer] = useState(false);
  const toggleDrawer = () => setDrawer(!drawer);

  const [fetchedTime, setFetchedTime] = useState(" ");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarthquakeData = async () => {
      const response = await fetch(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      );
      const data = await response.json();
      setEarthquakes(data.features);
    };
    fetchEarthquakeData();
    // setLoading(false);
    setFetchedTime(
      new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen flex flex-col items-start p-4">
      <Header toggleDrawer={toggleDrawer} fetchedTime={fetchedTime} />
      {loading ? <Loader /> : earthquakes.length != 0 ? <Map /> : <></>}
      <FilterDrawer drawer={drawer} toggleDrawer={toggleDrawer} />
    </div>
  );
}

export default App;
