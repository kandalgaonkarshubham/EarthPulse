import { Settings, Moon, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useFilterContext } from "@/context/Filter";

export default function FilterCornersUI({
  search,
  setSearch,
  selectedTimeRange,
  selectedFilters,
}) {
  const { 
    resetFilters, 
    location, 
    hemisphere, 
    filterCount,
    filteredEarthquakes,
    currentIndex,
    setCurrentIndex,
    setSelectedEarthquake
  } = useFilterContext();
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
    <div className="absolute inset-0 grid grid-cols-1 grid-rows-5 md:grid-cols-3 md:grid-rows-3 pointer-events-none text-[#6C7083]">

      {/* ── Top-left / Mobile: Location ── */}
      <div className="px-6 md:m-10 md:row-start-1 md:col-start-1 md:self-start md:justify-self-start pointer-events-auto">
        <span className="text-xs font-normal leading-none uppercase tracking-widest">
          {location}
        </span>
      </div>

      {/* ── Top-right / Mobile: Hemisphere ── */}
      <div className="px-6 md:m-10 md:row-start-1 md:col-start-3 md:self-start md:justify-self-end flex items-center gap-3 pointer-events-auto">
        <span className="text-xs font-normal uppercase tracking-widest">
          {hemisphere}
        </span>
        <Moon color="white" opacity={0.6} strokeWidth={1.33} size={16} />
      </div>

      {/* ── Search ── */}
      {/* <div className="px-6 md:m-10 md:row-start-3 md:col-start-1 md:self-end md:justify-self-start w-full md:w-[220px] pointer-events-auto">
        <div className="flex items-center gap-3 pb-2 border-b border-white/15">
          <Search color="white" opacity={0.5} strokeWidth={1.33} size={16} />
          <input
            type="text"
            placeholder="Search place"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full placeholder:text-white/40 text-white/40"
          />
        </div>
      </div> */}

      {/* ── Clear Filters ── */}
      {filterCount !== null && (
        <div
          className="px-6 md:m-10 md:row-start-3 md:col-start-3 md:self-end md:justify-self-end flex items-center gap-3 pointer-events-auto cursor-pointer group transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
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
      )}

      {/* ── Active Filters Display (center bottom desktop, bottom mobile) ── */}
      {filterCount !== null && (
        <div className="px-6 pb-6 md:px-0 md:row-start-3 md:col-start-2 md:self-end md:justify-self-center pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div
            className="flex items-center justify-center rounded-[20px] px-8 py-3 gap-6"
            style={{
              background:
                "linear-gradient(180deg, rgba(34,197,94,0.02) 0%, rgba(34,197,94,0.10) 100%)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 10px 40px -10px rgba(34,197,94,0.40), inset 0 0 20px rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
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
    </div>
  );
}
