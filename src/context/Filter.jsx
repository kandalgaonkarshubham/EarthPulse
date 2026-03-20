import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [magnitudeFilter, setMagnitudeFilter] = useState(null);
  const [magnitudeTypeFilter, setMagnitudeTypeFilter] = useState(null);
  const [significanceFilter, setSignificanceFilter] = useState(null);
  const [tsunamiFilter, setTsunamiFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [alertFilter, setAlertFilter] = useState(null);
  const [timeFilter, setTimeFilter] = useState(null); // e.g., 1, 6, 12, 24
  const [filterCount, setFilterCount] = useState(null);
  const [resetMap, setResetMap] = useState(null);

  const getFilteredData = () => {
    const filteredData = earthquakes.filter((quake) => {
      const { mag, magType, sig, tsunami, status, alert, time } = quake.properties;

      const magnitude = parseFloat(mag);
      const magnitudeMatches =
        magnitudeFilter === null ||
        (magnitudeFilter == "0"
          ? magnitude <= 0
          : magnitude >= parseFloat(magnitudeFilter) &&
            magnitude <= parseFloat(magnitudeFilter) + 1);

      const significance = parseInt(sig, 10);
      const significanceMatches =
        significanceFilter === null ||
        (() => {
          const [minSignificance, maxSignificance] = significanceFilter
            .split("-")
            .map(Number);
          return (
            significance >= minSignificance && significance <= maxSignificance
          );
        })();

      const timeMatches =
        timeFilter === null ||
        (() => {
          const now = Date.now();
          const hoursAgo = now - timeFilter * 60 * 60 * 1000;
          return time >= hoursAgo;
        })();

      return (
        magnitudeMatches &&
        (magnitudeTypeFilter === null || magType == magnitudeTypeFilter) &&
        significanceMatches &&
        (tsunamiFilter === null || tsunami == tsunamiFilter) &&
        (statusFilter === null || status == statusFilter) &&
        (alertFilter === null || alert == alertFilter) &&
        timeMatches
      );
    });
    if (
      magnitudeFilter != null ||
      magnitudeTypeFilter != null ||
      significanceFilter != null ||
      tsunamiFilter != null ||
      statusFilter != null ||
      alertFilter != null ||
      timeFilter != null
    ) {
      setFilterCount(filteredData.length);
    }
    setResetMap(true);
    return filteredData;
  };

  const resetFilters = () => {
    setMagnitudeFilter(null);
    setMagnitudeTypeFilter(null);
    setSignificanceFilter(null);
    setTsunamiFilter(null);
    setStatusFilter(null);
    setAlertFilter(null);
    setTimeFilter(null);
    setFilterCount(null);
    setResetMap(true);
  };

  return (
    <FilterContext.Provider
      value={{
        earthquakes,
        setEarthquakes,
        magnitudeFilter,
        setMagnitudeFilter,
        magnitudeTypeFilter,
        setMagnitudeTypeFilter,
        significanceFilter,
        setSignificanceFilter,
        tsunamiFilter,
        setTsunamiFilter,
        statusFilter,
        setStatusFilter,
        alertFilter,
        setAlertFilter,
        timeFilter,
        setTimeFilter,
        filterCount,
        getFilteredData,
        resetFilters,
        resetMap,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => useContext(FilterContext);
