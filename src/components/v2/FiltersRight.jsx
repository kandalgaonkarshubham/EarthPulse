const monthMarkers = [
  { label: "March", x: 1109, y: 179 },
  { label: "April", x: 1129, y: 218 },
  { label: "May",   x: 1145, y: 258, defaultActive: true },
  { label: "Jun",   x: 1157, y: 299 },
  { label: "Jul",   x: 1165, y: 341 },
  { label: "Aug",   x: 1169, y: 384 },
  { label: "Sep",   x: 1169, y: 428 },
  { label: "Oct",   x: 1165, y: 471 },
  { label: "Nov",   x: 1157, y: 513 },
  { label: "Dec",   x: 1145, y: 554 },
  { label: "Jan",   x: 1129, y: 594 },
  { label: "Feb",   x: 1109, y: 633 },
];

export default function FiltersRight({ selectedMonth, setSelectedMonth }) {
  return (
    <>
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
                  cx={marker.x} cy={marker.y} r="6"
                  fill="none"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1"
                />
                <circle
                  cx={marker.x} cy={marker.y} r="2"
                  fill="white"
                  filter="url(#dotGlow)"
                />
              </>
            ) : (
              <circle
                cx={marker.x} cy={marker.y} r="1.5"
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
    </>
  );
}
