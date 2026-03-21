import { useMemo } from "react";
import { sampleArcAtY, ARC_DEFS, ARC_SVG_OFFSET } from "./FilterGlobeArcs";

// Original static Y positions of each time marker.
// X is now ignored — we recompute it from the arc curve.
const TIME_MARKERS = [
  { label: "5 am",  y: 179 },
  { label: "7 am",  y: 218 },
  { label: "9 am",  y: 258, defaultActive: true },
  { label: "11 am", y: 299 },
  { label: "1 pm",  y: 341 },
  { label: "3 pm",  y: 384 },
  { label: "5 pm",  y: 428 },
  { label: "7 pm",  y: 471 },
  { label: "9 pm",  y: 513 },
  { label: "11 pm", y: 554 },
  { label: "1 am",  y: 594 },
  { label: "3 am",  y: 633 },
];

// The buttons sit on the middle-left arc (pg0)
// ARC_DEFS entry: ["pg0", "left", "middle", startX, startY, endX, endY, ...]
const [, , , START_X, START_Y, END_X, END_Y] = ARC_DEFS[0];
const APEX_Y = (START_Y + END_Y) / 2;

export default function FiltersLeft({ selectedTime, setSelectedTime, apex }) {
  // Re-sample marker positions whenever apex changes
  const markers = useMemo(() => {
    if (!apex) return TIME_MARKERS.map(m => ({ ...m, x: 275 + ARC_SVG_OFFSET.x, y: m.y + ARC_SVG_OFFSET.y }));
    const apexX = apex.left.middle;
    return TIME_MARKERS.map((m) => {
      const localY = m.y - ARC_SVG_OFFSET.y; // convert parent Y → arc local Y
      const pt = sampleArcAtY(START_X, START_Y, apexX, APEX_Y, END_X, END_Y, localY);
      return { ...m, x: pt.x + ARC_SVG_OFFSET.x, y: pt.y + ARC_SVG_OFFSET.y };
    });
  }, [apex]);

  return (
    <>
      {markers.map((marker) => {
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
