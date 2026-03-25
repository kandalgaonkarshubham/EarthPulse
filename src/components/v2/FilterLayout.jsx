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
  const isLeftActive = !!selectedTimeRange && selectedTimeRange !== "all";
  const isRightActive = Object.values(selectedFilters || {}).some((v) => !!v);

  // Map the selected time range to its corresponding marker Y coordinate
  const activeLeftYs = isLeftActive 
    ? [266, 338, 410, 482, 554][["1h", "2h", "6h", "12h", "24h"].indexOf(selectedTimeRange)]
    : null;
    
  // Map all active filters to their category marker Y coordinates
  const activeRightYs = isRightActive
    ? [270, 326, 382, 438, 494, 550].filter((_, i) => {
        const keys = ["magnitude", "significance", "tsunami", "status", "alert", "type"];
        return !!selectedFilters[keys[i]];
      })
    : [];

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
        <GlobeArcs
          onApexChange={handleApexChange}
          zoomProgress={zoomProgress}
          isLeftActive={isLeftActive}
          isRightActive={isRightActive}
          activeLeftYs={activeLeftYs ? [activeLeftYs] : []}
          activeRightYs={activeRightYs}
        />

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
