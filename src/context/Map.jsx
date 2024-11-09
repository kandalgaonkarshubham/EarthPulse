import { createContext, useContext, useState } from "react";

const MapStateContext = createContext();

export const MapStateProvider = ({ children }) => {
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

  return (
    <MapStateContext.Provider
      value={{
        viewstate,
        setViewState,
        recenter,
        updateViewState,
      }}
    >
      {children}
    </MapStateContext.Provider>
  );
};

export const useMapStateContext = () => useContext(MapStateContext);
