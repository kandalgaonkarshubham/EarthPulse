import { useMemo, useState } from "react";
import { sampleArcAtY, ARC_DEFS, ARC_SVG_OFFSET, useSpringT, RIGHT_HUG_SHIFT } from "./FilterGlobeArcs";
import { CheckCircle2 } from "lucide-react";

function lerp(a, b, t) { return a + (b - a) * t; }


const FILTER_DATA = {
  magnitude: {
    label: "MAG",
    options: [
      { label: "0-2", value: "0-2" },
      { label: "2-4", value: "2-4" },
      { label: "4-6", value: "4-6" },
      { label: "6+",  value: "6+"  },
    ],
  },
  significance: {
    label: "SIG",
    options: [
      { label: "0-100",   value: "0-100"   },
      { label: "100-200", value: "100-200" },
      { label: "200-300", value: "200-300" },
      { label: "300+",    value: "300+"    },
    ],
  },
  tsunami: {
    label: "TSU",
    options: [
      { label: "Yes",     value: "yes"     },
      { label: "No",      value: "no"      },
    ],
  },
  status: {
    label: "STA",
    options: [
      { label: "Automatic", value: "automatic" },
      { label: "Reviewed",  value: "reviewed"  },
    ],
  },
  alert: {
    label: "ALT",
    options: [
      { label: "Green",  value: "green"  },
      { label: "Yellow", value: "yellow" },
      { label: "Orange", value: "orange" },
      { label: "Red",    value: "red"    },
    ],
  },
  type: {
    label: "TYP",
    options: [
      { label: "ML",  value: "ml"  },
      { label: "MD",  value: "md"  },
      { label: "MB",  value: "mb"  },
      { label: "MWW", value: "mww" },
    ],
  },
};

const CATEGORIES = [
  { key: "magnitude",    y: 270 },
  { key: "significance", y: 326 },
  { key: "tsunami",      y: 382 },
  { key: "status",       y: 438 },
  { key: "alert",        y: 494 },
  { key: "type",         y: 550 },
];

const [, , , START_X, START_Y, END_X, END_Y] = ARC_DEFS[1];
const APEX_Y = (START_Y + END_Y) / 2;

export default function FiltersRight({ selectedFilters, setSelectedFilters, apex, zoomProgress = 0 }) {
  const [popupCategory, setPopupCategory] = useState(null);

  // Same spring as GlobeArcs — dots stay locked to the arc at every frame
  const t = useSpringT(zoomProgress);

  const markers = useMemo(() => {
    if (!apex) {
      return CATEGORIES.map((cat) => ({
        ...cat,
        ...FILTER_DATA[cat.key],
        x: 625 + ARC_SVG_OFFSET.x,
        y: cat.y + ARC_SVG_OFFSET.y,
      }));
    }

    const apexX = apex.right.middle;

    return CATEGORIES.map((cat) => {
      const localY = cat.y - ARC_SVG_OFFSET.y;

      const curvedPt  = sampleArcAtY(START_X, START_Y, apexX, APEX_Y, END_X, END_Y, localY);
      const straightX = END_X;
      const straightY = localY;

      const dotX     = lerp(curvedPt.x, straightX, t) + ARC_SVG_OFFSET.x;
      const dotY     = lerp(curvedPt.y, straightY, t) + ARC_SVG_OFFSET.y;
      const hugShift = lerp(0, RIGHT_HUG_SHIFT, t);

      return { ...cat, ...FILTER_DATA[cat.key], x: dotX + hugShift, y: dotY };
    });
  }, [apex, t]);

  const handleOptionClick = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev?.[category] === value ? null : value,
    }));
    setPopupCategory(null);
  };

  return (
    <>
      {markers.map((marker) => {
        const selectedValue = selectedFilters?.[marker.key];
        const isActive = !!selectedValue;
        const displayLabel = isActive
          ? marker.options.find(opt => opt.value === selectedValue)?.label || marker.label
          : marker.label;
        const isPopupOpen = popupCategory === marker.key;

        return (
          <g key={marker.key}>
            <g
              onClick={() => setPopupCategory(isPopupOpen ? null : marker.key)}
              style={{ cursor: "pointer" }}
            >
              {isActive ? (
                <circle cx={marker.x} cy={marker.y} r="2.5" fill="#f59e0b" filter="url(#dotGlow)" />
              ) : (
                <circle cx={marker.x} cy={marker.y} r="1.5" fill="rgba(255,255,255,0.2)" />
              )}
              <text
                x={marker.x + 18}
                y={marker.y + 5}
                textAnchor="start"
                fill={isActive ? "#f59e0b" : "#6C7083"}
                fontSize={isActive ? 14 : 12}
                fontWeight={isActive ? 600 : 500}
                fontFamily="Roboto, sans-serif"
              >
                {displayLabel}
              </text>
            </g>

            {isPopupOpen && (() => {
              const popupWidth = 140;
              const popupHeight = marker.options.length * 40 + 8;

              // Calculate horizontal position
              let popupX = marker.x + 80;
              if (popupX + popupWidth > 1430) { // 1440 - 10 margin
                // Flip to left side if it would go off-screen
                popupX = marker.x - popupWidth - 40;
              }

              // Calculate vertical position
              let popupY = marker.y - (popupHeight / 2);

              // Clamp vertical to keep it within view
              if (popupY < 10) {
                popupY = 10;
              } else if (popupY + popupHeight > 802) { // 812 - 10 margin
                popupY = 812 - popupHeight - 10;
              }

              return (
                <g transform={`translate(${popupX}, ${popupY})`}>
                  <rect x="-2000" y="-2000" width="5000" height="5000" fill="transparent" onClick={() => setPopupCategory(null)} />
                  <foreignObject
                    width={popupWidth + 60}
                    height={popupHeight + 60}
                    x="-30"
                    y="-30"
                    className="overflow-visible pointer-events-none"
                  >
                    <div className="p-[30px] pointer-events-auto">
                      <div
                        className="glass-panel rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-[popoverSlide_0.3s_ease-out]"
                        style={{ width: popupWidth, minHeight: popupHeight }}
                      >
                        <div className="p-2 space-y-1">
                          {marker.options.map((opt) => {
                            const isOptSelected = selectedFilters[marker.key] === opt.value;
                            return (
                              <div
                                key={opt.value}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOptionClick(marker.key, opt.value);
                                }}
                                className={`
                                  px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between group
                                  ${isOptSelected
                                    ? "bg-secondary/20 text-white border border-secondary/30"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"}
                                `}
                              >
                                <span className={`text-[11px] font-bold tracking-wide uppercase font-mono ${isOptSelected ? 'rich-glow-amber' : ''}`}>
                                  {opt.label}
                                </span>
                                {isOptSelected ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                                ) : (
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-slate-500 transition-colors" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            })()}
          </g>
        );
      })}
    </>
  );
}
