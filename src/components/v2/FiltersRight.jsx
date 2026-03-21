import { useMemo } from "react";
import { sampleArcAtY, ARC_DEFS, ARC_SVG_OFFSET } from "./FilterGlobeArcs";

// Original static Y positions of each month marker.
const MONTH_MARKERS = [
  { label: "March", y: 179 },
  { label: "April", y: 218 },
  { label: "May",   y: 258, defaultActive: true },
  { label: "Jun",   y: 299 },
  { label: "Jul",   y: 341 },
  { label: "Aug",   y: 384 },
  { label: "Sep",   y: 428 },
  { label: "Oct",   y: 471 },
  { label: "Nov",   y: 513 },
  { label: "Dec",   y: 554 },
  { label: "Jan",   y: 594 },
  { label: "Feb",   y: 633 },
];

// The buttons sit on the middle-right arc (pg1)
const [, , , START_X, START_Y, END_X, END_Y] = ARC_DEFS[1];
const APEX_Y = (START_Y + END_Y) / 2;

export default function FiltersRight({ selectedMonth, setSelectedMonth, apex }) {
  const markers = useMemo(() => {
    if (!apex) return MONTH_MARKERS.map(m => ({ ...m, x: 625 + ARC_SVG_OFFSET.x, y: m.y + ARC_SVG_OFFSET.y }));
    const apexX = apex.right.middle;
    return MONTH_MARKERS.map((m) => {
      const localY = m.y - ARC_SVG_OFFSET.y;
      const pt = sampleArcAtY(START_X, START_Y, apexX, APEX_Y, END_X, END_Y, localY);
      return { ...m, x: pt.x + ARC_SVG_OFFSET.x, y: pt.y + ARC_SVG_OFFSET.y };
    });
  }, [apex]);

  return (
    <>
      {markers.map((marker) => {
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
