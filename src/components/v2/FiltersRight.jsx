import { useMemo, useState } from "react";
import { sampleArcAtY, ARC_DEFS, ARC_SVG_OFFSET, useSpringT, RIGHT_HUG_SHIFT } from "./FilterGlobeArcs";

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
      { label: "Unknown", value: "unknown" },
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
                <>
                  <circle cx={marker.x} cy={marker.y} r="6" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                  <circle cx={marker.x} cy={marker.y} r="2" fill="white" filter="url(#dotGlow)" />
                </>
              ) : (
                <circle cx={marker.x} cy={marker.y} r="1.5" fill="rgba(255,255,255,0.2)" />
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
                {displayLabel}
              </text>
            </g>

            {isPopupOpen && (
              <g transform={`translate(${marker.x + 80}, ${marker.y - (marker.options.length * 15)})`}>
                <rect x="-1000" y="-1000" width="2000" height="2000" fill="transparent" onClick={() => setPopupCategory(null)} />
                <rect
                  width="120"
                  height={marker.options.length * 30 + 10}
                  fill="#171717"
                  rx="8"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                  filter="drop-shadow(0 10px 15px rgba(0,0,0,0.5))"
                />
                {marker.options.map((opt, i) => {
                  const isOptSelected = selectedFilters[marker.key] === opt.value;
                  return (
                    <g
                      key={opt.value}
                      transform={`translate(10, ${i * 30 + 25})`}
                      onClick={() => handleOptionClick(marker.key, opt.value)}
                      style={{ cursor: "pointer" }}
                    >
                      <rect x="-5" y="-15" width="110" height="25" fill={isOptSelected ? "rgba(255,255,255,0.1)" : "transparent"} rx="4" />
                      <text
                        fill={isOptSelected ? "#ffffff" : "#A3A3A3"}
                        fontSize="12"
                        fontFamily="Roboto, sans-serif"
                        fontWeight={isOptSelected ? 600 : 400}
                      >
                        {opt.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}
          </g>
        );
      })}
    </>
  );
}
