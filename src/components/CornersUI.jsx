import { Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useFilterContext } from "@/context/Filter";
import MobileFilters from "./MobileFilters";

export default function FilterCornersUI() {
  const {
    selectedTimeRange,
    selectedFilters,
    resetFilters,
    location,
    hemisphere,
    filterCount,
    filteredEarthquakes,
    currentIndex,
    setCurrentIndex,
    setSelectedEarthquake,
    screenWidth
  } = useFilterContext();
  
  const isMobile = screenWidth <= 767;

  // Format time range for display
  const timeRangeLabel = {
    "1h": "Last 1H",
    "2h": "Last 2H",
    "6h": "Last 6H",
    "12h": "Last 12H",
    "24h": "Last 24H",
    "all": "All Time",
  }[selectedTimeRange] || "All Time";

  // Format magnitude filter for display
  const magLabel = selectedFilters?.magnitude || "Any";

  return (
    <div className="absolute inset-0 pointer-events-none text-[#6C7083] p-4 md:p-10 flex flex-col justify-between overflow-hidden">
      
      {/* ── Top HUD (Corners) ── */}
      <div className="flex justify-between items-start w-full">
        {/* Top-left: Location */}
        <div className="pointer-events-auto">
          <div className="glass-card rounded-[20px] px-5 py-2 flex items-center justify-center">
            <span className="text-xs font-normal leading-none uppercase tracking-widest text-white/70">
              {location}
            </span>
          </div>
        </div>

        {/* Top-right: Hemisphere */}
        <div className="pointer-events-auto">
          <div className="glass-card rounded-[20px] px-5 py-2 flex items-center justify-center">
            <span className="text-xs font-normal uppercase tracking-widest text-white/70">
              {hemisphere}
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom HUD ── */}
      <div className="flex flex-col items-center w-full">
        
        {/* Paging / Event Display */}
        {filterCount !== null && (
          <div className="pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mb-4">
            <div className="glass-card-green flex items-center justify-center rounded-[20px] px-8 py-3 gap-6">
              <button
                onClick={() => {
                  const newIndex = (currentIndex - 1 + filteredEarthquakes.length) % filteredEarthquakes.length;
                  setCurrentIndex(newIndex);
                  setSelectedEarthquake(filteredEarthquakes[newIndex]);
                }}
                className="text-white/60 hover:text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group"
                disabled={filteredEarthquakes.length === 0}
              >
                <ChevronLeft size={24} strokeWidth={2} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              </button>

              <div className="flex flex-col items-center min-w-[80px]">
                <div className="flex items-baseline gap-1">
                  <span className="text-white text-[20px] font-bold tracking-[1px] leading-none">
                    {filteredEarthquakes.length > 0 ? currentIndex + 1 : 0}
                  </span>
                  <span className="text-white/30 text-[12px] font-medium">
                    / {filteredEarthquakes.length}
                  </span>
                </div>
                <span className="text-white/40 text-[9px] uppercase font-bold tracking-[2px] mt-1 whitespace-nowrap">
                  {filteredEarthquakes.length === 1 ? 'Event Found' : 'Events Found'}
                </span>
              </div>

              <button
                onClick={() => {
                  const newIndex = (currentIndex + 1) % filteredEarthquakes.length;
                  setCurrentIndex(newIndex);
                  setSelectedEarthquake(filteredEarthquakes[newIndex]);
                }}
                className="text-white/60 hover:text-white transition-all transform hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group"
                disabled={filteredEarthquakes.length === 0}
              >
                <ChevronRight size={24} strokeWidth={2} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              </button>
            </div>
          </div>
        )}

        {/* ── Desktop/Mobile Filter Hub ── */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end w-full">
          {/* Mobile Filters are docked at the absolute bottom within this flex-col */}
          {isMobile ? (
            <MobileFilters />
          ) : (
            <>
              {/* Left Bottom placeholder (Desktop only) */}
              <div className="hidden md:block w-[140px]" />

              {/* Clear Filters (Desktop only) */}
              {filterCount !== null && (
                <div className="hidden md:block pointer-events-auto">
                  <div
                    className="glass-card rounded-[20px] px-5 py-2 flex items-center gap-3 justify-center cursor-pointer group transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                    onClick={resetFilters}
                  >
                    <Settings
                      className="group-hover:rotate-90 transition-transform duration-500"
                      color="white"
                      opacity={0.6}
                      strokeWidth={1.33}
                      size={16}
                    />
                    <span className="text-[13px] font-normal text-white/60 group-hover:text-white transition-colors">
                      Clear Filters
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
