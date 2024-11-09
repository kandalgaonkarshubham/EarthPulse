import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [viewstate, setViewState] = useState({
    longitude: 73.22969,
    latitude: 19.15705,
    zoom: 2,
  });
  const updateViewState = (l, z) => {
    setViewState({
      longitude: l.lng,
      latitude: l.lat,
      zoom: z,
    });
  };
  const recenter = () => {
    setViewState({
      ...viewstate,
      zoom: 2,
    });
  };

  const [earthquakes, setEarthquakes] = useState([]);
  const [magnitudeFilter, setMagnitudeFilter] = useState(null);
  const [magnitudeTypeFilter, setMagnitudeTypeFilter] = useState(null);
  const [significanceFilter, setSignificanceFilter] = useState(null);
  const [tsunamiFilter, setTsunamiFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [alertFilter, setAlertFilter] = useState(null);
  const [filterCount, setFilterCount] = useState(null);
  const [resetMap, setResetMap] = useState(null);

  const getFilteredData = () => {
    const filteredData = earthquakes.filter((quake) => {
      const { mag, magType, sig, tsunami, status, alert } = quake.properties;

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
        magnitudeMatches &&
        (magnitudeTypeFilter === null || magType == magnitudeTypeFilter) &&
        significanceMatches &&
        (tsunamiFilter === null || tsunami == tsunamiFilter) &&
        (statusFilter === null || status == statusFilter) &&
        (alertFilter === null || alert == alertFilter)
      );
    });
    if (
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
        viewstate,
        updateViewState,
        recenter,
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
