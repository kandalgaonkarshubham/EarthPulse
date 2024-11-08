import { useState, useEffect } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Map from "@/components/Map";

import { Drawer, DrawerContent } from "@/components/ui/drawer";

function App() {
  const [drawer, setDrawer] = useState(false);
  const toggleDrawer = () => setDrawer(!drawer);

  const [viewstate, setViewState] = useState({
    longitude: 73.22969,
    latitude: 19.15705,
    zoom: 2,
  });
  const recenter = () => {
    setViewState({
      ...viewstate,
      zoom: 2,
    });
  };
  const updateViewState = (l, z) => {
    setViewState({
      longitude: l.lng,
      latitude: l.lat,
      zoom: z,
    });
  };

  const [earthquakes, setEarthquakes] = useState([]);
  const [magnitudeFilter, setMagnitudeFilter] = useState(0); // Minimum magnitude filter
  const [timeFilter, setTimeFilter] = useState("day"); // Options: "hour", "day", "week", etc.
  const [depthFilter, setDepthFilter] = useState([0, 700]); // Depth range (e.g., shallow to deep)
  const [significanceFilter, setSignificanceFilter] = useState(0); // Minimum significance

  useEffect(() => {
    const fetchEarthquakeData = async () => {
      const response = await fetch(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      );
      const data = await response.json();
      setEarthquakes(data.features);
    };
    fetchEarthquakeData();
  }, [timeFilter]);

  return (
    <div className="h-screen flex flex-col items-start p-4">
      <Header toggleDrawer={toggleDrawer} />
      <Map
        viewstate={viewstate}
        updateViewState={updateViewState}
        earthquakes={earthquakes}
        filters={{ magnitudeFilter, depthFilter, significanceFilter }}
      />
      <Footer recenter={recenter} />
      <Drawer
        open={drawer}
        onOpenChange={setDrawer}
        direction="right"
        className="flex flex-col align-center justify-center"
      >
        <DrawerContent className="absolute top-[1%] right-[1%] max-w-[40vw] h-[98vh] after:!w-0">
          <div className="m-4 bg-red-100">draser</div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default App;
