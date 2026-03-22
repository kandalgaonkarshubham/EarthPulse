import { useMemo } from "react";
import { sampleArcAtY, ARC_DEFS, ARC_SVG_OFFSET, useSpringT, LEFT_HUG_SHIFT } from "./FilterGlobeArcs";

function lerp(a, b, t) { return a + (b - a) * t; }


const TIME_MARKERS = [
  { label: "1H", y: 266, timeRange: "1h" },
  { label: "2H", y: 338, timeRange: "2h" },
  { label: "6H", y: 410, timeRange: "6h" },
  { label: "12H", y: 482, timeRange: "12h" },
  { label: "24H", y: 554, timeRange: "24h" },
];

const [, , , START_X, START_Y, END_X, END_Y] = ARC_DEFS[0];
const APEX_Y = (START_Y + END_Y) / 2;

export default function FiltersLeft({ selectedTimeRange, setSelectedTimeRange, apex, zoomProgress = 0 }) {
  // Same spring as GlobeArcs — dots stay locked to the arc at every frame
  const t = useSpringT(zoomProgress);

  const markers = useMemo(() => {
    if (!apex) {
      return TIME_MARKERS.map(m => ({
        ...m,
        x: 275 + ARC_SVG_OFFSET.x,
        y: m.y + ARC_SVG_OFFSET.y,
      }));
    }

    const apexX = apex.left.middle;

    return TIME_MARKERS.map((m) => {
      const localY = m.y - ARC_SVG_OFFSET.y;

      const curvedPt  = sampleArcAtY(START_X, START_Y, apexX, APEX_Y, END_X, END_Y, localY);
      const straightX = START_X;
      const straightY = localY;

      const dotX     = lerp(curvedPt.x, straightX, t) + ARC_SVG_OFFSET.x;
      const dotY     = lerp(curvedPt.y, straightY, t) + ARC_SVG_OFFSET.y;
      const hugShift = lerp(0, LEFT_HUG_SHIFT, t);

      return { ...m, x: dotX + hugShift, y: dotY };
    });
  }, [apex, t]);

  return (
    <>
      {markers.map((marker) => {
        const isActive = marker.timeRange === selectedTimeRange;
        return (
          <g
            key={marker.timeRange}
            onClick={() => setSelectedTimeRange(marker.timeRange)}
            style={{ cursor: "pointer" }}
          >
            {isActive ? (
              <>
                <circle cx={marker.x} cy={marker.y} r="6" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                <circle cx={marker.x} cy={marker.y} r="2" fill="white" filter="url(#dotGlow)" />
              </>
            ) : (
              <circle cx={marker.x} cy={marker.y} r="1.5" fill="rgba(255,255,255,0.2)" />
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
