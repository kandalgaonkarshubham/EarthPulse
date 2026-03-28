import { useMemo } from "react";
import { useFilterContext } from "@/context/Filter";
import { sampleArcAtY, ARC_DEFS, ARC_SVG_OFFSET, useSpringT, LEFT_HUG_SHIFT } from "./FilterGlobeArcs";
import { TIME_MARKERS } from "@/lib/filterData";

function lerp(a, b, t) { return a + (b - a) * t; }

const [, , , START_X, START_Y, END_X, END_Y] = ARC_DEFS[0];
const APEX_Y = (START_Y + END_Y) / 2;

export default function FiltersLeft({ leftHugShift = LEFT_HUG_SHIFT, leftBaseShift = 0 }) {
  const { selectedTimeRange, setSelectedTimeRange, apex, zoomProgress = 0 } = useFilterContext();
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
      const hugShift = lerp(leftBaseShift, leftHugShift, t);

      return { ...m, x: dotX + hugShift, y: dotY };
    });
  }, [apex, t, leftHugShift, leftBaseShift]);

  return (
    <>
      {markers.map((marker) => {
        const isActive = marker.value === selectedTimeRange;
        return (
          <g
            key={marker.value}
            onClick={() => setSelectedTimeRange(marker.value)}
            style={{ cursor: "pointer" }}
          >
            {isActive ? (
              <circle cx={marker.x} cy={marker.y} r="2.5" fill="#f59e0b" filter="url(#dotGlow)" />
            ) : (
              <circle cx={marker.x} cy={marker.y} r="1.5" fill="rgba(255,255,255,0.2)" />
            )}
            <foreignObject
              x={marker.x - 65}
              y={marker.y - 12}
              width={55}
              height={24}
              className="overflow-visible"
            >
              <div 
                className={`flex items-center justify-center h-full rounded-[10px] px-2 transition-all duration-700 ease-in-out border cursor-pointer ${
                  zoomProgress === 1 
                    ? (isActive ? 'glass-card-yellow scale-110 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'glass-card')
                    : 'bg-transparent shadow-none border-transparent'
                }`}
              >
                <span 
                  className={`text-[10px] uppercase font-bold tracking-wider transition-colors duration-500 leading-none ${
                    isActive ? 'text-amber-500' : (zoomProgress === 1 ? 'text-white/70' : 'text-[#6C7083]')
                  }`}
                >
                  {marker.label}
                </span>
              </div>
            </foreignObject>
          </g>
        );
      })}
    </>
  );
}
