import GlobeArcs from "./FilterGlobeArcs";
import FiltersLeft from "./FiltersLeft";
import FiltersRight from "./FiltersRight";
import { useFilterContext } from "@/context/Filter";

export default function FilterLayout({
  children,
  selectedTimeRange,
  setSelectedTimeRange,
  selectedFilters,
  setSelectedFilters,
}) {
  const { zoomProgress, apex, setApex } = useFilterContext();
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

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* 1. Deep Background Layer (z-0) — Decorative arcs hidden behind the Earth sphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg viewBox="0 0 1440 812" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <GlobeArcs
             onApexChange={setApex}
             zoomProgress={zoomProgress}
             enabledTiers={["inner", "outer"]}
          />
        </svg>
      </div>

      {/* 2. Content Layer (z-10) — Usually the Map. Planet sphere masks z-0. */}
      <div className="absolute inset-0 z-10">
        {children}
      </div>

      {/* 3. Foreground UI Layer (z-20) — Interactive filter lines, dots, and labels on top */}
      <div className="absolute inset-0 z-20 pointer-events-none">

        <svg
          viewBox="0 0 1440 812"
          className="absolute inset-0 w-full h-full pointer-events-none"
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

          {/* Main filter lines stay on top of the Map (Foreground) */}
          <GlobeArcs
            zoomProgress={zoomProgress}
            isLeftActive={isLeftActive}
            isRightActive={isRightActive}
            activeLeftYs={activeLeftYs ? [activeLeftYs] : []}
            activeRightYs={activeRightYs}
            enabledTiers={["middle"]}
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
    </div>
  );
}
