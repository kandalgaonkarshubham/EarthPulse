import { createContext, useContext, useState, useEffect } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [magnitudeFilter, setMagnitudeFilter] = useState(null);
  const [magnitudeTypeFilter, setMagnitudeTypeFilter] = useState(null);
  const [significanceFilter, setSignificanceFilter] = useState(null);
  const [tsunamiFilter, setTsunamiFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [alertFilter, setAlertFilter] = useState(null);
  const [timeFilter, setTimeFilter] = useState(null);
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
  const [resetMap, setResetMap] = useState(null);
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

  // ── screen width, updated on resize ──────────────────────────────────────
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Dynamic zoom threshold ────────────────────────────────────────────────
  // The middle-left arc (pg0) lives at parent-SVG x = 225 + 270 = 495
  // out of the 1440-wide viewBox. Scaled to screen pixels:
  //   arcScreenX = (495 / 1440) * screenWidth
  //
  // Mapbox globe radius in CSS px at zoom z (tile size 256):
  //   R = (256 / (2 * PI)) * 2^z
  //
  // Transition fires when globe left edge reaches the arc:
  //   screenWidth/2 - R = arcScreenX
  //   z = log2( (screenWidth/2 - arcScreenX) * 2*PI / 256 )
  //
  // +FUDGE nudges the trigger slightly early so it feels natural.
  const FUDGE = 0;
  const arcScreenX  = (495 / 1440) * screenWidth;
  const globeRadius = screenWidth / 2 - arcScreenX;
  const ZOOM_THRESHOLD = Math.log2((globeRadius * 2 * Math.PI) / 256) + FUDGE;

  // 0 → curved/normal   1 → straight/hugged  (binary, no in-between)
  const zoomProgress = mapZoom >= ZOOM_THRESHOLD ? 1 : 0;
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (earthquakes.length === 0) {
      setFilterCount(null);
      return;
    }

    const filtered = earthquakes.filter((quake) => {
      const { mag, sig, tsunami, status, alert, time, magType } = quake.properties;

      const magnitude = parseFloat(mag);
      const magnitudeMin = parseFloat(magnitudeFilter);
      const magnitudeMatches =
        magnitudeFilter === null ||
        (magnitudeFilter == "0"
          ? magnitude >= 0 && magnitude < 2
          : magnitude >= magnitudeMin &&
            magnitude < (magnitudeMin >= 6 ? Infinity : magnitudeMin + 2));

      const significance = parseInt(sig, 10);
      const significanceMatches =
        significanceFilter === null ||
        (() => {
          const [minSignificance, maxSignificance] = significanceFilter
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
        (magnitudeTypeFilter === null || magType == magnitudeTypeFilter) &&
        significanceMatches &&
        (tsunamiFilter === null || tsunami == tsunamiFilter) &&
        (statusFilter === null || status == statusFilter) &&
        (alertFilter === null || alert == alertFilter) &&
        timeMatches
      );
    });

    setFilteredEarthquakes(filtered);
    if (currentIndex >= filtered.length) {
      setCurrentIndex(0);
    }

    const isAnyFilterActive =
      magnitudeFilter != null ||
      magnitudeTypeFilter != null ||
      significanceFilter != null ||
      tsunamiFilter != null ||
      statusFilter != null ||
      alertFilter != null ||
      timeFilter != null;

    setFilterCount(isAnyFilterActive ? filtered.length : null);
  }, [earthquakes, magnitudeFilter, magnitudeTypeFilter, significanceFilter, tsunamiFilter, statusFilter, alertFilter, timeFilter]);

  const getFilteredData = () => {
    const filteredData = earthquakes.filter((quake) => {
      const { mag, magType, sig, tsunami, status, alert, time } = quake.properties;

      const magnitude = parseFloat(mag);
      const magnitudeMin = parseFloat(magnitudeFilter);
      const magnitudeMatches =
        magnitudeFilter === null ||
        (magnitudeFilter == "0"
          ? magnitude >= 0 && magnitude < 2
          : magnitude >= magnitudeMin &&
            magnitude < (magnitudeMin >= 6 ? Infinity : magnitudeMin + 2));

      const significance = parseInt(sig, 10);
      const significanceMatches =
        significanceFilter === null ||
        (() => {
          const [minSignificance, maxSignificance] = significanceFilter
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
        (magnitudeTypeFilter === null || magType == magnitudeTypeFilter) &&
        significanceMatches &&
        (tsunamiFilter === null || tsunami == tsunamiFilter) &&
        (statusFilter === null || status == statusFilter) &&
        (alertFilter === null || alert == alertFilter) &&
        timeMatches
      );
    });
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
        selectedFilters,
        setSelectedFilters,
        selectedTimeRange,
        setSelectedTimeRange,
        filterCount,
        getFilteredData,
        resetFilters,
        resetMap,
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
