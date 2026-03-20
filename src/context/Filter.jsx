import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [timeRangeFilter, setTimeRangeFilter] = useState(null); // '6h', '12h', '24h', '7d', '30d'
  const [magnitudeFilter, setMagnitudeFilter] = useState(null);
  const [magnitudeTypeFilter, setMagnitudeTypeFilter] = useState(null);
  const [significanceFilter, setSignificanceFilter] = useState(null);
  const [tsunamiFilter, setTsunamiFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [alertFilter, setAlertFilter] = useState(null);
  const [filterCount, setFilterCount] = useState(null);
  const [resetMap, setResetMap] = useState(null);

  const getFilteredData = () => {
    const now = Date.now();

    const filteredData = earthquakes.filter((quake) => {
      const { mag, magType, sig, tsunami, status, alert, time } = quake.properties;

      // Time range filtering
      let timeMatches = true;
      if (timeRangeFilter) {
        const earthquakeTime = new Date(time).getTime();
        const timeDiff = now - earthquakeTime;
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        const timeRanges = {
          '6h': 6,
          '12h': 12,
          '24h': 24,
          '7d': 24 * 7,
          '30d': 24 * 30,
        };

        timeMatches = hoursDiff <= (timeRanges[timeRangeFilter] || 24);
      }

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

      return (
        timeMatches &&
        magnitudeMatches &&
        (magnitudeTypeFilter === null || magType == magnitudeTypeFilter) &&
        significanceMatches &&
        (tsunamiFilter === null || tsunami == tsunamiFilter) &&
        (statusFilter === null || status == statusFilter) &&
        (alertFilter === null || alert == alertFilter)
      );
    });
    if (
      timeRangeFilter != null ||
      magnitudeFilter != null ||
      magnitudeTypeFilter != null ||
      significanceFilter != null ||
      tsunamiFilter != null ||
      statusFilter != null ||
      alertFilter != null
    ) {
      setFilterCount(filteredData.length);
    }
    setResetMap(true);
    return filteredData;
  };

  const resetFilters = () => {
    setTimeRangeFilter(null);
    setMagnitudeFilter(null);
    setMagnitudeTypeFilter(null);
    setSignificanceFilter(null);
    setTsunamiFilter(null);
    setStatusFilter(null);
    setAlertFilter(null);
    setFilterCount(null);
    setResetMap(true);
  };

  return (
    <FilterContext.Provider
      value={{
        earthquakes,
        setEarthquakes,
        timeRangeFilter,
        setTimeRangeFilter,
        magnitude: magnitudeFilter,
        setMagnitude: setMagnitudeFilter,
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
