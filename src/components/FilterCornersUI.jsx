import { Settings, Moon, Search } from "lucide-react";

export default function FilterCornersUI({ search, setSearch, selectedTime, selectedMonth }) {
  return (
    <>
      {/* ── Top-left: Settings + database label ── */}
      <div className="absolute top-10 left-10 flex items-center gap-3">
        <Settings color="white" opacity={0.6} strokeWidth={1.33} size={16} />
        <span
          className="text-[13px] font-normal"
          style={{ color: "#6C7083", fontFamily: "'Roboto', sans-serif" }}
        >
          2010 – 2020 data base
        </span>
      </div>

      {/* ── Top-right: Hemisphere + moon icon ── */}
      <div className="absolute top-10 right-10 flex items-center gap-3">
        <span
          className="text-[13px] font-normal"
          style={{ color: "#6C7083", fontFamily: "'Roboto', sans-serif" }}
        >
          North hemisphere
        </span>
        <Moon color="white" opacity={0.6} strokeWidth={1.33} size={16} />
      </div>

      {/* ── Bottom-left: Search place ── */}
      <div className="absolute bottom-8 left-10 flex items-center gap-3 w-[220px] pb-2 border-b border-white/15">
        <Search color="white" opacity={0.5} strokeWidth={1.33} size={16} />
        <input
          type="text"
          placeholder="Search place"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm outline-none w-full placeholder:text-white/40 text-white/40"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        />
      </div>

      {/* ── Bottom-right: Location info ── */}
      <div className="absolute bottom-8 right-10 flex flex-col items-end gap-1">
        <span
          className="text-white text-[14px] font-medium leading-none"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          Florida, USA
        </span>
        <span
          className="text-white/40 text-[12px] leading-none"
          style={{ fontFamily: "'Roboto Mono', monospace" }}
        >
          29.932292, -82.815696
        </span>
      </div>

      {/* ── Bottom-center: Temperature pill ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div
          className="relative flex items-center justify-center rounded-[20px] px-8 py-[10px]"
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
          <span
            className="text-white text-[14px] font-medium tracking-[0.5px] whitespace-nowrap"
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            {selectedTime} · {selectedMonth} &nbsp; 20° – 28° C
          </span>
        </div>
      </div>
    </>
  );
}
