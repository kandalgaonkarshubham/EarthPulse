import { useEffect } from "react";

// ─── Bezier helpers ────────────────────────────────────────────────────────────

// Original arc geometry (at full/static width)
// Each arc is two cubic bezier segments joined at the apex (midpoint y).
// Structure: startX, startY, apexX, apexY, endX, endY
// Control point ratios reverse-engineered from the original static paths:
//   CP1x = startX + (apexX - startX) * 0.623
//   CP1y = startY + (apexY - startY) * 0.208
//   CP2x = apexX
//   CP2y = apexY - (apexY - startY) * 0.421
// (symmetric for the bottom half)

export function makeArcPath(startX, startY, apexX, apexY, endX, endY) {
  const dx = apexX - startX;
  const dyTop = apexY - startY;
  const dyBot = endY - apexY;

  const cp1x = startX + dx * 0.623;
  const cp1y = startY + dyTop * 0.208;
  const cp2x = apexX;
  const cp2y = apexY - dyTop * 0.421;

  const cp3x = apexX;
  const cp3y = apexY + dyBot * 0.421;
  const cp4x = endX + dx * 0.623; // endX mirrors startX, dx is same sign
  const cp4y = endY - dyBot * 0.208;

  return `M${startX} ${startY}C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${apexX} ${apexY}C${cp3x} ${cp3y} ${cp4x} ${cp4y} ${endX} ${endY}`;
}

// Sample a cubic bezier at parameter t → {x, y}
function cubicPoint(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  return {
    x: mt**3*p0.x + 3*mt**2*t*p1.x + 3*mt*t**2*p2.x + t**3*p3.x,
    y: mt**3*p0.y + 3*mt**2*t*p1.y + 3*mt*t**2*p2.y + t**3*p3.y,
  };
}

// Given an arc definition and a target Y, find the point on the arc at that Y.
// The arc is two cubic segments. We binary-search for t on the correct half.
export function sampleArcAtY(startX, startY, apexX, apexY, endX, endY, targetY) {
  const dx = apexX - startX;
  const dyTop = apexY - startY;
  const dyBot = endY - apexY;

  // Decide which half
  const useTop = targetY <= apexY;

  let p0, p1, p2, p3;
  if (useTop) {
    p0 = { x: startX, y: startY };
    p1 = { x: startX + dx * 0.623, y: startY + dyTop * 0.208 };
    p2 = { x: apexX,               y: apexY - dyTop * 0.421  };
    p3 = { x: apexX,               y: apexY                  };
  } else {
    p0 = { x: apexX,               y: apexY                  };
    p1 = { x: apexX,               y: apexY + dyBot * 0.421  };
    p2 = { x: endX + dx * 0.623,   y: endY - dyBot * 0.208   };
    p3 = { x: endX,                y: endY                   };
  }

  // Binary search for t where y ≈ targetY
  let lo = 0, hi = 1;
  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2;
    const pt = cubicPoint(p0, p1, p2, p3, mid);
    if (pt.y < targetY) lo = mid; else hi = mid;
  }
  return cubicPoint(p0, p1, p2, p3, (lo + hi) / 2);
}

// ─── Coordinate offset ────────────────────────────────────────────────────────
// The GlobeArcs nested SVG sits at x="270" y="-44" inside the parent SVG.
// Arc coordinates are in local space (0 0 900 900). To convert to parent space
// (0 0 1440 812) add this offset. Filters live in parent space, so they need it.
export const ARC_SVG_OFFSET = { x: 270, y: -44 };

// ─── Arc definitions ───────────────────────────────────────────────────────────

// [id, side, tier, startX, startY, endX, endY, strokeWidth]
export const ARC_DEFS = [
  ["pg0", "left",  "middle", 225, 60.3,  225, 839.7, 1.5],
  ["pg1", "right", "middle", 675, 60.3,  675, 839.7, 1.5],
  ["pg2", "left",  "inner",  275, 146.9, 275, 753.1, 1  ],
  ["pg3", "right", "inner",  625, 146.9, 625, 753.1, 1  ],
  ["pg4", "left",  "outer",  75,  -26.3, 75,  926.3, 1  ],
  ["pg5", "right", "outer",  825, -26.3, 825, 926.3, 1  ],
];

const TIER_Y = {
  middle: { y1: 60.3,  y2: 839.7 },
  inner:  { y1: 146.9, y2: 753.1 },
  outer:  { y1: -26.3, y2: 926.3 },
};

const GRADIENTS_BASE = [
  { id: "pg0", side: "left",  tier: "middle", stops: [{offset:"0",opacity:0},{offset:"0.2",opacity:0.2},{offset:"0.8",opacity:0.2},{offset:"1",opacity:0}] },
  { id: "pg1", side: "right", tier: "middle", stops: [{offset:"0",opacity:0},{offset:"0.2",opacity:0.2},{offset:"0.8",opacity:0.2},{offset:"1",opacity:0}] },
  { id: "pg2", side: "left",  tier: "inner",  stops: [{offset:"0",opacity:0},{offset:"0.25",opacity:0.05},{offset:"0.75",opacity:0.05},{offset:"1",opacity:0}] },
  { id: "pg3", side: "right", tier: "inner",  stops: [{offset:"0",opacity:0},{offset:"0.25",opacity:0.05},{offset:"0.75",opacity:0.05},{offset:"1",opacity:0}] },
  { id: "pg4", side: "left",  tier: "outer",  stops: [{offset:"0",opacity:0},{offset:"0.25",opacity:0.05},{offset:"0.75",opacity:0.05},{offset:"1",opacity:0}] },
  { id: "pg5", side: "right", tier: "outer",  stops: [{offset:"0",opacity:0},{offset:"0.25",opacity:0.05},{offset:"0.75",opacity:0.05},{offset:"1",opacity:0}] },
];

// ─── Fixed apex values ────────────────────────────────────────────────────────
// Curvature is constant at all window widths. The apex x never changes.
// Only the spacing between arcs was meant to be dynamic — but that feature
// was removed. Apex stays at original static values always.

export const FIXED_APEX = {
  left:  { inner: 100.015, middle: 0.0198,    outer: -199.9758 },
  right: { inner: 799.985, middle: 899.98,    outer: 1099.976  },
};

export function interpolateApex(_width) {
  return FIXED_APEX;
}

export default function GlobeArcs({ onApexChange }) {
  // Apex is fixed — curvature never changes with window size.
  const apex = FIXED_APEX;

  useEffect(() => {
    onApexChange?.(apex);
  }, []); // eslint-disable-line

  return (
    <svg x="270" y="-44" width="900" height="900" viewBox="0 0 900 900" overflow="visible">
      <defs>
        {GRADIENTS_BASE.map(({ id, side, tier, stops }) => {
          const x = apex[side][tier];
          const { y1, y2 } = TIER_Y[tier];
          return (
            <linearGradient key={id} id={id} x1={x} y1={y1} x2={x} y2={y2} gradientUnits="userSpaceOnUse">
              {stops.map((s) => (
                <stop key={s.offset} offset={s.offset} stopColor="white" stopOpacity={s.opacity} />
              ))}
            </linearGradient>
          );
        })}
        <clipPath id="planetClip">
          <rect x="-200" y="-100" width="1300" height="1100" fill="white" />
        </clipPath>
      </defs>

      <g clipPath="url(#planetClip)">
        {ARC_DEFS.map(([id, side, tier, startX, startY, endX, endY, strokeWidth]) => {
          const apexX = apex[side][tier];
          const apexY = (startY + endY) / 2;
          const d = makeArcPath(startX, startY, apexX, apexY, endX, endY);
          return (
            <path key={id} d={d} stroke={`url(#${id})`} strokeWidth={strokeWidth} fill="none" />
          );
        })}
      </g>
    </svg>
  );
}
