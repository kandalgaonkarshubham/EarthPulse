import { useState, useEffect } from "react";
import FilterLayout from "@/components/v2/FilterLayout";
import FilterCornersUI from "@/components/v2/FilterCornersUI";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import Map from "@/components/Map";
import EQModalNew from "@/components/EQModalNew";
import { useFilterContext } from "@/context/Filter";

export default function App() {
  const {
    earthquakes,
    setEarthquakes,
    setMagnitudeFilter,
    setSignificanceFilter,
    setTsunamiFilter,
    setStatusFilter,
    setAlertFilter,
    setMagnitudeTypeFilter,
    setTimeFilter,
    selectedFilters,
    setSelectedFilters,
    selectedTimeRange,
    setSelectedTimeRange,
    selectedEarthquake,
    isModalOpen,
    setIsModalOpen,
  } = useFilterContext();

  const [search, setSearch] = useState("");

  const [fetchedTime, setFetchedTime] = useState(" ");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(false);

  const handleRefetch = () => {
    setRefetch(!refetch);
  };

  // Sync selectedTimeRange to context
  useEffect(() => {
    const timeRangeMap = {
      "1h": 1,
      "2h": 2,
      "6h": 6,
      "12h": 12,
      "24h": 24,
      "all": null,
    };
    setTimeFilter(timeRangeMap[selectedTimeRange] || null);
  }, [selectedTimeRange, setTimeFilter]);

  // Sync selectedFilters to context
  useEffect(() => {
    const magMap = {
      "0-2": "0",
      "2-4": "2",
      "4-6": "4",
      "6+": "6",
    };
    setMagnitudeFilter(selectedFilters?.magnitude ? (magMap[selectedFilters.magnitude] ?? null) : null);

    const sigMap = {
      "0-100": "0-100",
      "100-200": "100-200",
      "200-300": "200-300",
      "300+": "300-9999",
    };
    setSignificanceFilter(selectedFilters?.significance ? (sigMap[selectedFilters.significance] ?? null) : null);

    setTsunamiFilter(
      selectedFilters?.tsunami === "yes" ? "1"
      : selectedFilters?.tsunami === "no" ? "0"
      : null
    );

    setStatusFilter(selectedFilters?.status || null);
    setAlertFilter(selectedFilters?.alert || null);
    setMagnitudeTypeFilter(selectedFilters?.type || null);
  }, [selectedFilters, setMagnitudeFilter, setSignificanceFilter, setTsunamiFilter, setStatusFilter, setAlertFilter, setMagnitudeTypeFilter]);

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
    <div className="relative w-full h-screen overflow-hidden bg-neutral-900 text-white font-sans">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        {loading ? (
          <Loader />
        ) : earthquakes.length !== 0 ? (
          <Map />
        ) : (
          <Error error={error} />
        )}
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <FilterLayout
          selectedTimeRange={selectedTimeRange}
          setSelectedTimeRange={setSelectedTimeRange}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />

        <FilterCornersUI
          search={search}
          setSearch={setSearch}
          selectedTimeRange={selectedTimeRange}
          selectedFilters={selectedFilters}
        />
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
