import { createContext, useContext, useState, useEffect } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    magnitude: null,
    significance: null,
    tsunami: null,
    status: null,
    alert: null,
    type: null,
  });
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");
  const [filterCount, setFilterCount] = useState(null);
  const [location, setLocation] = useState("");
  const [hemisphere, setHemisphere] = useState("");
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [apex, setApex] = useState(null);
  const [filteredEarthquakes, setFilteredEarthquakes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ── zoom level reported by Map.jsx ─────────────────────────────────────────
  const [mapZoom, setMapZoom] = useState(2);

  useEffect(() => {
    const fetchIPLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data.latitude && data.longitude) {
          setUserLocation(prev => prev || {
            lat: data.latitude,
            lng: data.longitude,
          });
        }
      } catch (err) {
        console.log("IP Location error:", err);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }, (err) => {
        console.log("Geolocation error:", err);
        fetchIPLocation();
      });
    } else {
      fetchIPLocation();
    }
  }, []);

  // ── screen dimensions, updated on resize ────────────────────────────────
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 812
  });

  useEffect(() => {
    const onResize = () => setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Dynamic zoom threshold ────────────────────────────────────────────────
  const FUDGE = 0;
  const arcScreenX  = (495 / 1440) * screenSize.width;
  const globeRadius = screenSize.width / 2 - arcScreenX;
  const ZOOM_THRESHOLD = Math.log2((globeRadius * 2 * Math.PI) / 256) + FUDGE;

  const zoomProgress = mapZoom >= ZOOM_THRESHOLD ? 1 : 0;
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (earthquakes.length === 0) {
      setFilterCount(null);
      return;
    }

    const magMap = { "0-2": 0, "2-4": 2, "4-6": 4, "6+": 6 };
    const sigMap = { "0-100": "0-100", "100-200": "100-200", "200-300": "200-300", "300+": "300-9999" };
    const timeRangeMap = { "1h": 1, "2h": 2, "6h": 6, "12h": 12, "24h": 24, "all": null };

    const magnitudeMin = selectedFilters.magnitude ? magMap[selectedFilters.magnitude] : null;
    const significanceFilter = selectedFilters.significance ? sigMap[selectedFilters.significance] : null;
    const tsunamiFilter = selectedFilters.tsunami === "yes" ? 1 : selectedFilters.tsunami === "no" ? 0 : null;
    const timeFilter = timeRangeMap[selectedTimeRange];

    const filtered = earthquakes.filter((quake) => {
      const { mag, sig, tsunami, status, alert, time, magType } = quake.properties;

      const magnitude = parseFloat(mag);
      const magnitudeMatches =
        magnitudeMin === null ||
        (magnitudeMin === 0
          ? magnitude >= 0 && magnitude < 2
          : magnitude >= magnitudeMin &&
            magnitude < (magnitudeMin >= 6 ? Infinity : magnitudeMin + 2));

      const significance = parseInt(sig, 10);
      const significanceMatches =
        significanceFilter === null ||
        (() => {
          const [minSignificance, maxSignificance] = (significanceFilter || "")
            .split("-")
            .map(Number);
          return (
            significance >= minSignificance && significance <= (maxSignificance || Infinity)
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
        (!selectedFilters.type || magType === selectedFilters.type) &&
        significanceMatches &&
        (tsunamiFilter === null || tsunami === tsunamiFilter) &&
        (!selectedFilters.status || status === selectedFilters.status) &&
        (!selectedFilters.alert || alert === selectedFilters.alert) &&
        timeMatches
      );
    });

    setFilteredEarthquakes(filtered);
    if (currentIndex >= filtered.length) {
      setCurrentIndex(0);
    }

    const isAnyFilterActive =
      selectedFilters.magnitude != null ||
      selectedFilters.type != null ||
      selectedFilters.significance != null ||
      selectedFilters.tsunami != null ||
      selectedFilters.status != null ||
      selectedFilters.alert != null ||
      selectedTimeRange !== "all";

    setFilterCount(isAnyFilterActive ? filtered.length : null);
  }, [earthquakes, selectedFilters, selectedTimeRange]);

  const resetFilters = () => {
    setSelectedFilters({
      magnitude: null,
      significance: null,
      tsunami: null,
      status: null,
      alert: null,
      type: null,
    });
    setSelectedTimeRange("all");
    setFilterCount(null);
  };

  return (
    <FilterContext.Provider
      value={{
        earthquakes,
        setEarthquakes,
        selectedFilters,
        setSelectedFilters,
        selectedTimeRange,
        setSelectedTimeRange,
        filterCount,
        resetFilters,
        location,
        setLocation,
        hemisphere,
        setHemisphere,
        mapZoom,
        setMapZoom,
        zoomProgress,
        selectedEarthquake,
        setSelectedEarthquake,
        isModalOpen,
        setIsModalOpen,
        userLocation,
        setUserLocation,
        apex,
        setApex,
        screenWidth: screenSize.width,
        screenHeight: screenSize.height,
        screenSize,
        filteredEarthquakes,
        currentIndex,
        setCurrentIndex,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => useContext(FilterContext);
