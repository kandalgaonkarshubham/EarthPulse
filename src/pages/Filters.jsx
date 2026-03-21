import { useState } from "react";

const timeMarkers = [
  { label: "5 am", x: 331, y: 179 },
  { label: "7 am", x: 311, y: 218 },
  { label: "9 am", x: 295, y: 258, defaultActive: true },
  { label: "11 am", x: 283, y: 299 },
  { label: "1 pm", x: 275, y: 341 },
  { label: "3 pm", x: 271, y: 384 },
  { label: "5 pm", x: 271, y: 428 },
  { label: "7 pm", x: 275, y: 471 },
  { label: "9 pm", x: 283, y: 513 },
  { label: "11 pm", x: 295, y: 554 },
  { label: "1 am", x: 311, y: 594 },
  { label: "3 am", x: 331, y: 633 },
];

const monthMarkers = [
  { label: "March", x: 1109, y: 179 },
  { label: "April", x: 1129, y: 218 },
  { label: "May", x: 1145, y: 258, defaultActive: true },
  { label: "Jun", x: 1157, y: 299 },
  { label: "Jul", x: 1165, y: 341 },
  { label: "Aug", x: 1169, y: 384 },
  { label: "Sep", x: 1169, y: 428 },
  { label: "Oct", x: 1165, y: 471 },
  { label: "Nov", x: 1157, y: 513 },
  { label: "Dec", x: 1145, y: 554 },
  { label: "Jan", x: 1129, y: 594 },
  { label: "Feb", x: 1109, y: 633 },
];

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6.44733 2.75733C6.52345 1.95656 7.19595 1.34495 8.00033 1.34495C8.80471 1.34495 9.47722 1.95656 9.55333 2.75733C9.59814 3.26396 9.88711 3.71694 10.3276 3.97112C10.7682 4.2253 11.305 4.24877 11.766 4.034C12.4968 3.7022 13.3602 3.97909 13.7617 4.67407C14.1632 5.36905 13.9718 6.25528 13.3193 6.72267C12.9031 7.0147 12.6554 7.49123 12.6554 7.99967C12.6554 8.5081 12.9031 8.98463 13.3193 9.27667C13.9718 9.74406 14.1632 10.6303 13.7617 11.3253C13.3602 12.0202 12.4968 12.2971 11.766 11.9653C11.305 11.7506 10.7682 11.774 10.3276 12.0282C9.88711 12.2824 9.59814 12.7354 9.55333 13.242C9.47722 14.0428 8.80471 14.6544 8.00033 14.6544C7.19595 14.6544 6.52345 14.0428 6.44733 13.242C6.40261 12.7352 6.11355 12.282 5.67282 12.0278C5.2321 11.7736 4.6951 11.7503 4.234 11.9653C3.50317 12.2971 2.63984 12.0202 2.23832 11.3253C1.83681 10.6303 2.02817 9.74406 2.68067 9.27667C3.09687 8.98463 3.34464 8.5081 3.34464 7.99967C3.34464 7.49123 3.09687 7.0147 2.68067 6.72267C2.02912 6.25507 1.83827 5.36963 2.23932 4.67514C2.64038 3.98065 3.50267 3.7034 4.23333 4.034C4.69437 4.24877 5.23116 4.2253 5.67169 3.97112C6.11223 3.71694 6.40119 3.26396 6.446 2.75733"
        stroke="white"
        strokeOpacity="0.6"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 8C6 9.10383 6.89617 10 8 10C9.10383 10 10 9.10383 10 8C10 6.89617 9.10383 6 8 6C6.89617 6 6 6.89617 6 8V8"
        stroke="white"
        strokeOpacity="0.6"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.99 8.324C13.8159 11.549 11.1202 14.0576 7.89103 13.9996C4.66186 13.9417 2.05794 11.338 1.99965 8.10885C1.94137 4.87969 4.44964 2.18377 7.67462 2.00933C7.94462 1.99467 8.08595 2.316 7.94262 2.54467C6.95541 4.12417 7.18908 6.17604 8.50617 7.49312C9.82325 8.8102 11.8751 9.04388 13.4546 8.05667C13.684 7.91333 14.0046 8.054 13.99 8.324"
        stroke="white"
        strokeOpacity="0.6"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M14 14L11.1067 11.1067"
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 7.33333C2 10.2769 4.38979 12.6667 7.33333 12.6667C10.2769 12.6667 12.6667 10.2769 12.6667 7.33333C12.6667 4.38979 10.2769 2 7.33333 2C4.38979 2 2 4.38979 2 7.33333V7.33333"
        stroke="white"
        strokeOpacity="0.5"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Index() {
  const [selectedTime, setSelectedTime] = useState("9 am");
  const [selectedMonth, setSelectedMonth] = useState("May");
  const [search, setSearch] = useState("");

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#071018", fontFamily: "'Roboto', sans-serif" }}
    >
      {/* Radial gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(101.8% 57.4% at 50% 50%, #151828 0%, #06070A 100%)",
        }}
      />

      {/* Main SVG — uses viewBox so everything scales to any screen size */}
      <svg
        viewBox="0 0 1440 812"
        className="absolute inset-0 w-full h-full"
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

        {/* Planet / globe curved arc lines (nested SVG keeps original coords) */}
        <svg
          x="270"
          y="-44"
          width="900"
          height="900"
          viewBox="0 0 900 900"
          overflow="visible"
        >
          <defs>
            <linearGradient
              id="pg0"
              x1="0.0198059"
              y1="60.3"
              x2="0.0198059"
              y2="839.7"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.2" stopColor="white" stopOpacity="0.2" />
              <stop offset="0.8" stopColor="white" stopOpacity="0.2" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="pg1"
              x1="675"
              y1="60.3"
              x2="675"
              y2="839.7"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.2" stopColor="white" stopOpacity="0.2" />
              <stop offset="0.8" stopColor="white" stopOpacity="0.2" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="pg2"
              x1="100.015"
              y1="146.9"
              x2="100.015"
              y2="753.1"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.25" stopColor="white" stopOpacity="0.05" />
              <stop offset="0.75" stopColor="white" stopOpacity="0.05" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="pg3"
              x1="625"
              y1="146.9"
              x2="625"
              y2="753.1"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.25" stopColor="white" stopOpacity="0.05" />
              <stop offset="0.75" stopColor="white" stopOpacity="0.05" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="pg4"
              x1="-99.9758"
              y1="-26.3"
              x2="-99.9758"
              y2="926.3"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.25" stopColor="white" stopOpacity="0.05" />
              <stop offset="0.75" stopColor="white" stopOpacity="0.05" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="pg5"
              x1="725"
              y1="-26.3"
              x2="725"
              y2="926.3"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.25" stopColor="white" stopOpacity="0.05" />
              <stop offset="0.75" stopColor="white" stopOpacity="0.05" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <clipPath id="planetClip">
              <rect width="900" height="900" fill="white" />
            </clipPath>
          </defs>
          <g clipPath="url(#planetClip)">
            {/* Outer left arc */}
            <path
              d="M225 60.3C85.7807 140.688 0.0198059 289.239 0.0198059 450C0.0198059 610.761 85.7807 759.312 225 839.7"
              stroke="url(#pg0)"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Outer right arc */}
            <path
              d="M675 60.3C814.219 140.688 899.98 289.239 899.98 450C899.98 610.761 814.219 759.312 675 839.7"
              stroke="url(#pg1)"
              strokeWidth="1.5"
              fill="none"
            />
            {/* Mid left arc */}
            <path
              d="M275 146.9C166.718 209.424 100.015 324.963 100.015 450C100.015 575.037 166.718 690.576 275 753.1"
              stroke="url(#pg2)"
              strokeWidth="1"
              fill="none"
            />
            {/* Mid right arc */}
            <path
              d="M625 146.9C733.282 209.424 799.985 324.963 799.985 450C799.985 575.037 733.282 690.576 625 753.1"
              stroke="url(#pg3)"
              strokeWidth="1"
              fill="none"
            />
            {/* Far left arc */}
            <path
              d="M175 -26.3C4.84305 71.9517 -99.9758 253.514 -99.9758 450C-99.9758 646.486 4.84305 828.048 175 926.3"
              stroke="url(#pg4)"
              strokeWidth="1"
              fill="none"
            />
            {/* Far right arc */}
            <path
              d="M725 -26.3C895.157 71.9517 999.976 253.514 999.976 450C999.976 646.486 895.157 828.048 725 926.3"
              stroke="url(#pg5)"
              strokeWidth="1"
              fill="none"
            />
          </g>
        </svg>

        {/* ── Time markers (left arc) ── */}
        {timeMarkers.map((marker) => {
          const isActive = marker.label === selectedTime;
          return (
            <g
              key={marker.label}
              onClick={() => setSelectedTime(marker.label)}
              style={{ cursor: "pointer" }}
            >
              {isActive ? (
                <>
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r="6"
                    fill="none"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1"
                  />
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r="2"
                    fill="white"
                    filter="url(#dotGlow)"
                  />
                </>
              ) : (
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r="1.5"
                  fill="rgba(255,255,255,0.2)"
                />
              )}
              <text
                x={marker.x - 18}
                y={marker.y + 5}
                textAnchor="end"
                fill={isActive ? "#ffffff" : "#6C7083"}
                fontSize={isActive ? 14 : 12}
                fontWeight={isActive ? 600 : 500}
                fontFamily="Roboto, sans-serif"
              >
                {marker.label}
              </text>
            </g>
          );
        })}

        {/* ── Month markers (right arc) ── */}
        {monthMarkers.map((marker) => {
          const isActive = marker.label === selectedMonth;
          return (
            <g
              key={marker.label}
              onClick={() => setSelectedMonth(marker.label)}
              style={{ cursor: "pointer" }}
            >
              {isActive ? (
                <>
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r="6"
                    fill="none"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1"
                  />
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r="2"
                    fill="white"
                    filter="url(#dotGlow)"
                  />
                </>
              ) : (
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r="1.5"
                  fill="rgba(255,255,255,0.2)"
                />
              )}
              <text
                x={marker.x + 18}
                y={marker.y + 5}
                textAnchor="start"
                fill={isActive ? "#ffffff" : "#6C7083"}
                fontSize={isActive ? 14 : 12}
                fontWeight={isActive ? 600 : 500}
                fontFamily="Roboto, sans-serif"
              >
                {marker.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* ── Top-left: Settings + database label ── */}
      <div className="absolute top-10 left-10 flex items-center gap-3">
        <SettingsIcon />
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
        <MoonIcon />
      </div>

      {/* ── Bottom-left: Search place ── */}
      <div className="absolute bottom-8 left-10 flex items-center gap-3 w-[220px] pb-2 border-b border-white/15">
        <SearchIcon />
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
    </div>
  );
}
