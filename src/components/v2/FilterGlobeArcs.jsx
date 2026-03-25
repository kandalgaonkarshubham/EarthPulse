import { useEffect, useRef, useState } from "react";

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
  const cp4x = endX + dx * 0.623;
  const cp4y = endY - dyBot * 0.208;

  return `M${startX} ${startY}C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${apexX} ${apexY}C${cp3x} ${cp3y} ${cp4x} ${cp4y} ${endX} ${endY}`;
}

function lerp(a, b, t) { return a + (b - a) * t; }

function cubicPoint(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  return {
    x: mt**3*p0.x + 3*mt**2*t*p1.x + 3*mt*t**2*p2.x + t**3*p3.x,
    y: mt**3*p0.y + 3*mt**2*t*p1.y + 3*mt*t**2*p2.y + t**3*p3.y,
  };
}

export function sampleArcAtY(startX, startY, apexX, apexY, endX, endY, targetY) {
  const dx = apexX - startX;
  const dyTop = apexY - startY;
  const dyBot = endY - apexY;
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

  let lo = 0, hi = 1;
  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2;
    const pt = cubicPoint(p0, p1, p2, p3, mid);
    if (pt.y < targetY) lo = mid; else hi = mid;
  }
  return cubicPoint(p0, p1, p2, p3, (lo + hi) / 2);
}

export const ARC_SVG_OFFSET = { x: 270, y: -44 };

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

export const FIXED_APEX = {
  left:  { inner: 100.015, middle: 0.0198,    outer: -199.9758 },
  right: { inner: 799.985, middle: 899.98,    outer: 1099.976  },
};

export function interpolateApex(_width) {
  return FIXED_APEX;
}

// ---------------------------------------------------------------------------
// Hug shift — how far the main arc translates toward its edge (local SVG units).
// Parent-space target: left → x=24, right → x=1416 (24px viewBox padding).
// Local shift = target_parent_x - (startX + SVG_offset_x)
//   left:  24   - (225 + 270) = -471
//   right: 1416 - (675 + 270) =  471
//
// IMPORTANT: main arcs are rendered OUTSIDE the clipPath group so the
// translation is never clipped. Secondary arcs stay inside clipPath.
// ---------------------------------------------------------------------------
// Single source of truth — change EDGE_PADDING here and dots + lines both update.
export const EDGE_PADDING     =  84;  // viewBox units from each side
export const LEFT_HUG_SHIFT  = EDGE_PADDING - 495;   // 24 - (225+270)
export const RIGHT_HUG_SHIFT = (1440 - EDGE_PADDING) - 945; // (1440-24) - (675+270)

// ---------------------------------------------------------------------------
// useSpringT — smoothly animates toward a binary target (0 or 1) via rAF spring.
// Exported so FiltersLeft / FiltersRight share the exact same animated value.
// ---------------------------------------------------------------------------
export function useSpringT(target, { stiffness = 140, damping = 20 } = {}) {
  const [t, setT] = useState(target);
  const state = useRef({ pos: target, vel: 0, raf: null });

  useEffect(() => {
    const s = state.current;
    if (s.raf) cancelAnimationFrame(s.raf);

    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.064);
      last = now;

      const force = stiffness * (target - s.pos);
      const damp  = damping   * s.vel;
      s.vel += (force - damp) * dt;
      s.pos += s.vel * dt;

      if (Math.abs(target - s.pos) < 0.0005 && Math.abs(s.vel) < 0.0005) {
        s.pos = target;
        s.vel = 0;
        setT(target);
        s.raf = null;
        return;
      }

      setT(s.pos);
      s.raf = requestAnimationFrame(tick);
    };

    s.raf = requestAnimationFrame(tick);
    return () => { if (s.raf) cancelAnimationFrame(s.raf); };
  }, [target, stiffness, damping]);

  return t;
}

// ---------------------------------------------------------------------------
// GlobeArcs
// ---------------------------------------------------------------------------
export default function GlobeArcs({ 
  onApexChange, 
  zoomProgress = 0, 
  isLeftActive = false, 
  isRightActive = false,
  activeLeftYs = [],
  activeRightYs = [],
}) {
  const apex = FIXED_APEX;
  const t = useSpringT(zoomProgress);

  useEffect(() => {
    onApexChange?.(apex);
  }, []); // eslint-disable-line

  const secondaryArcs = ARC_DEFS.filter(([,, tier]) => tier !== "middle");
  const mainArcs      = ARC_DEFS.filter(([,, tier]) => tier === "middle");

  return (
    <svg x="270" y="-44" width="900" height="900" viewBox="0 0 900 900" overflow="visible">
      <defs>
        {GRADIENTS_BASE.map(({ id, side, tier, stops }) => {
          const x = apex[side][tier];
          const { y1, y2 } = TIER_Y[tier];
          
          const isActiveLine = (side === "left" && isLeftActive) || (side === "right" && isRightActive);
          const activeYs = side === "left" ? activeLeftYs : activeRightYs;
          
          let finalStops;
          if (isActiveLine && tier === "middle") {
            const range = y2 - y1;
            const sortedYs = [...activeYs].sort((a, b) => a - b);
            const minY = sortedYs[0];
            const maxY = sortedYs[sortedYs.length - 1];
            
            // Calculate localized green range with 40px padding for better presence
            const startOffset = (minY - 40 - y1) / range;
            const endOffset = (maxY + 40 - y1) / range;

            // Completely regenerate stops for the active arc to ensure perfect symmetry
            // and prevent base stops from interfering with the green highlight.
            finalStops = [
              { offset: 0, color: "white", opacity: 0 },
              { offset: Math.max(0, startOffset - 0.08), color: "white", opacity: 0.1 },
              { offset: Math.max(0, startOffset), color: "#f59e0b", opacity: 0.8 },
              { offset: Math.min(1, endOffset), color: "#f59e0b", opacity: 0.8 },
              { offset: Math.min(1, endOffset + 0.08), color: "white", opacity: 0.1 },
              { offset: 1, color: "white", opacity: 0 }
            ];
          } else {
            finalStops = stops.map(s => ({
              offset: parseFloat(s.offset),
              color: "white",
              opacity: s.opacity
            }));
          }

          return (
            <linearGradient key={id} id={id} x1={x} y1={y1} x2={x} y2={y2} gradientUnits="userSpaceOnUse">
              {finalStops.map((s, i) => (
                <stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity} />
              ))}
            </linearGradient>
          );
        })}
        <clipPath id="planetClip">
          <rect x="-200" y="-100" width="1300" height="1100" fill="white" />
        </clipPath>
      </defs>

      {/* Secondary arcs (inner + outer) — clipped, fade out on zoom */}
      <g clipPath="url(#planetClip)">
        {secondaryArcs.map(([id, side, tier, startX, startY, endX, endY, strokeWidth]) => {
          const apexX   = apex[side][tier];
          const apexY   = (startY + endY) / 2;
          const opacity = lerp(1, 0, Math.min(1, t * 2));
          const d       = makeArcPath(startX, startY, apexX, apexY, endX, endY);
          return (
            <path key={id} d={d} stroke={`url(#${id})`} strokeWidth={strokeWidth} fill="none" opacity={opacity} />
          );
        })}
      </g>

      {/* Main arcs (middle) — NOT clipped so translate can reach the viewport edges */}
      {mainArcs.map(([id, side, , startX, startY, endX, endY, strokeWidth]) => {
        const apexX       = apex[side].middle;
        const apexY       = (startY + endY) / 2;
        const morphedApexX = lerp(apexX, startX, t);
        const shift        = side === "left" ? lerp(0, LEFT_HUG_SHIFT, t) : lerp(0, RIGHT_HUG_SHIFT, t);
        const d            = makeArcPath(startX, startY, morphedApexX, apexY, endX, endY);
        return (
          <g key={id} transform={`translate(${shift}, 0)`}>
            <path d={d} stroke={`url(#${id})`} strokeWidth={strokeWidth} fill="none" />
          </g>
        );
      })}
    </svg>
  );
}
