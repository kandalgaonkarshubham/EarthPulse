import { useState, useCallback } from "react";
import GlobeArcs from "./FilterGlobeArcs";
import FiltersLeft from "./FiltersLeft";
import FiltersRight from "./FiltersRight";
import { useFilterContext } from "@/context/Filter";

export default function FilterLayout({
  selectedTimeRange,
  setSelectedTimeRange,
  selectedFilters,
  setSelectedFilters,
}) {
  const [apex, setApex] = useState(null);
  const { zoomProgress } = useFilterContext();

  const handleApexChange = useCallback((newApex) => {
    setApex(newApex);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* SVG Overlay */}
      <svg
        viewBox="0 0 1440 812"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* GlobeArcs drives the apex state and notifies parent */}
        <GlobeArcs onApexChange={handleApexChange} zoomProgress={zoomProgress} />

        <g className="pointer-events-auto">
          <FiltersLeft
            selectedTimeRange={selectedTimeRange}
            setSelectedTimeRange={setSelectedTimeRange}
            apex={apex}
            zoomProgress={zoomProgress}
          />
        </g>

        <g className="pointer-events-auto">
          <FiltersRight
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            apex={apex}
            zoomProgress={zoomProgress}
          />
        </g>
      </svg>
    </div>
  );
}
