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

export default function FilterMenu({
  selectedTime,
  setSelectedTime,
  selectedMonth,
  setSelectedMonth,
}) {
  return (
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
  );
}
