import { Settings, Moon, Search } from "lucide-react";

export default function FilterCornersUI({
  search,
  setSearch,
  selectedTime,
  selectedMonth,
}) {
  return (
    <div className="absolute inset-0 grid grid-cols-1 grid-rows-5 md:grid-cols-3 md:grid-rows-3 pointer-events-none text-[#6C7083]">

      {/* ── Top-left / Mobile: Location ── */}
      <div className="px-6 md:m-10 md:row-start-1 md:col-start-1 md:self-start md:justify-self-start pointer-events-auto">
        <span className="text-[14px] font-normal leading-none">
          Florida, USA
        </span>
      </div>

      {/* ── Top-right / Mobile: Hemisphere ── */}
      <div className="px-6 md:m-10 md:row-start-1 md:col-start-3 md:self-start md:justify-self-end flex items-center gap-3 pointer-events-auto">
        <span className="text-[14px] font-normal">
          North hemisphere
        </span>
        <Moon color="white" opacity={0.6} strokeWidth={1.33} size={16} />
      </div>

      {/* ── Search ── */}
      <div className="px-6 md:m-10 md:row-start-3 md:col-start-1 md:self-end md:justify-self-start w-full md:w-[220px] pointer-events-auto">
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
      </div>

      {/* ── Database ── */}
      <div className="px-6 md:m-10 md:row-start-3 md:col-start-3 md:self-end md:justify-self-end flex items-center gap-3 pointer-events-auto">
        <Settings color="white" opacity={0.6} strokeWidth={1.33} size={16} />
        <span className="text-[13px] font-normal">
          Clear Filters
        </span>
      </div>

      {/* ── Temperature (center bottom desktop, bottom mobile) ── */}
      <div className="px-6 pb-6 md:px-0 md:row-start-3 md:col-start-2 md:self-end md:justify-self-center pointer-events-auto">
        <div
          className="flex items-center justify-center rounded-[20px] px-8 py-[10px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(34,197,94,0.02) 0%, rgba(34,197,94,0.10) 100%)",
            backdropFilter: "blur(4px)",
            boxShadow: "0 10px 30px -5px rgba(34,197,94,0.30)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            borderLeft: "1px solid rgba(255,255,255,0.05)",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            borderBottom: "2px solid rgba(255,255,255,0.05)",
          }}
        >
          <span className="text-white text-[14px] font-medium tracking-[0.5px] whitespace-nowrap">
            {selectedTime} · {selectedMonth} &nbsp; 20° – 28° C
          </span>
        </div>
      </div>
    </div>
  );
}
