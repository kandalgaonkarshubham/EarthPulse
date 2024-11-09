import { useState, useEffect } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Map from "@/components/Map";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFilterContext } from "@/context/Filter";

function App() {
  const { earthquakes, setEarthquakes } = useFilterContext();

  const [drawer, setDrawer] = useState(false);
  const toggleDrawer = () => setDrawer(!drawer);

  const [fetchedTime, setFetchedTime] = useState(" ");

  useEffect(() => {
    const fetchEarthquakeData = async () => {
      const response = await fetch(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      );
      const data = await response.json();
      setEarthquakes(data.features);
    };
    fetchEarthquakeData();
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
      {earthquakes.length != 0 && <Map />}
      <Footer />
      <Drawer
        open={drawer}
        onOpenChange={setDrawer}
        direction="right"
        className="flex flex-col align-center justify-center"
      >
        <DrawerContent className="absolute top-[1%] right-[1%] mmax-w-[40vw] h-[98vh] bg-secondary text-white after:!w-0">
          <div className="w-full h-full flex flex-col gap-2 mx-6 mr-10 my-4">
            <h4 className="text-start text-3xl font-Syne my-8">Filters</h4>

            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2">
                <p className="font-Syne">Magnitude </p>
                <Select>
                  <SelectTrigger className="max-w-[180px]">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-Syne">Type </p>
                <Select>
                  <SelectTrigger className="max-w-[180px]">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <hr className="border-neutral-700 mt-6 mb-4" />
            <div className="flex items-center justify-between gap-2">
              <p className="font-Syne">Significance </p>
              <Select>
                <SelectTrigger className="max-w-[180px]">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <hr className="border-neutral-700 mt-6 mb-4" />
            <div className="flex items-center justify-between gap-2">
              <p className="font-Syne">Tsunami </p>
              <Select>
                <SelectTrigger className="max-w-[180px]">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <hr className="border-neutral-700 mt-6 mb-4" />
            <div className="flex items-center justify-between gap-2">
              <p className="font-Syne">Status </p>
              <Select>
                <SelectTrigger className="max-w-[180px]">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <hr className="border-neutral-700 mt-6 mb-4" />
            <div className="flex items-center justify-between gap-2">
              <p className="font-Syne">Alert </p>
              <Select>
                <SelectTrigger className="max-w-[180px]">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button className="border border-neutral-600 font-Syne rounded-lg p-2 mt-8">
              Reset FIlters
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default App;
