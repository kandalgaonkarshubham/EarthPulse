const timeMarkers = [
  { label: "5 am",  x: 331, y: 179 },
  { label: "7 am",  x: 311, y: 218 },
  { label: "9 am",  x: 295, y: 258, defaultActive: true },
  { label: "11 am", x: 283, y: 299 },
  { label: "1 pm",  x: 275, y: 341 },
  { label: "3 pm",  x: 271, y: 384 },
  { label: "5 pm",  x: 271, y: 428 },
  { label: "7 pm",  x: 275, y: 471 },
  { label: "9 pm",  x: 283, y: 513 },
  { label: "11 pm", x: 295, y: 554 },
  { label: "1 am",  x: 311, y: 594 },
  { label: "3 am",  x: 331, y: 633 },
];

export default function FiltersLeft({ selectedTime, setSelectedTime }) {
  return (
    <>
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
    </>
  );
}
