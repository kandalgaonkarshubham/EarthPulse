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

  const getFilteredData = () => {
    return earthquakes.filter((quake) => {
      const { mag, sig, tsunami, status, alert } = quake.properties;
      return (
        (magnitudeFilter === null || mag >= magnitudeFilter) &&
        (significanceFilter === null || sig >= significanceFilter) &&
        (tsunamiFilter === null || tsunami === tsunamiFilter) &&
        (statusFilter === null || status === statusFilter) &&
        (alertFilter === null || alert === alertFilter)
      );
    });
  };

  function logUniqueFilterValues() {
    const data = earthquakes;
    const uniqueMagnitudes = new Set();
    const uniqueMagnitudeTypes = new Set();
    const uniqueSignificances = new Set();
    const uniqueTsunamis = new Set();
    const uniqueStatuses = new Set();
    const uniqueAlerts = new Set();

    data.forEach((quake) => {
      uniqueMagnitudes.add(quake.properties.mag);
      uniqueMagnitudeTypes.add(quake.properties.magType);
      uniqueSignificances.add(quake.properties.sig);
      uniqueTsunamis.add(quake.properties.tsunami);
      uniqueStatuses.add(quake.properties.status);
      uniqueAlerts.add(quake.properties.alert);
    });

    console.log("Unique Magnitudes:", Array.from(uniqueMagnitudes));
    console.log("Unique Magnitude Types:", Array.from(uniqueMagnitudeTypes));
    console.log("Unique Significances:", Array.from(uniqueSignificances));
    console.log("Unique Tsunami Flags:", Array.from(uniqueTsunamis));
    console.log("Unique Statuses:", Array.from(uniqueStatuses));
    console.log("Unique Alerts:", Array.from(uniqueAlerts));
  }

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
        getFilteredData,
        logUniqueFilterValues,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => useContext(FilterContext);
