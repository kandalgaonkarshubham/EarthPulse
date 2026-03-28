function getRings() {
  return [
    { radius: 38, count: 6, shape: "diamond", size: 4, opacity: 0.5, color: "hsl(10 80% 60%)" },
    { radius: 56, count: 12, shape: "dot", size: 3, opacity: 0.7, color: "hsl(10 80% 60%)" },
    { radius: 75, count: 12, shape: "teardrop", size: 7, offset: 15, opacity: 0.5, color: "hsl(10 80% 60%)" },
    { radius: 95, count: 18, shape: "dot", size: 1.5, opacity: 0.3, color: "hsl(10 80% 60%)" },
  ];
}

function renderShape(ring, ri, i, angle, rad, cx, cy) {
  const key = `${ri}-${i}`;
  const fg = ring.color;

  switch (ring.shape) {
    case "dot":
      return <circle key={key} cx={cx} cy={cy} r={ring.size} fill={fg} opacity={ring.opacity ?? 0.8} />;

    case "diamond":
      return (
        <polygon
          key={key}
          points={`${cx},${cy - ring.size} ${cx + ring.size * 0.5},${cy} ${cx},${cy + ring.size} ${cx - ring.size * 0.5},${cy}`}
          fill={fg}
          opacity={ring.opacity ?? 0.7}
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      );

    case "teardrop": {
      const s = ring.size;
      return (
        <ellipse
          key={key}
          cx={cx}
          cy={cy}
          rx={s * 0.45}
          ry={s}
          fill={fg}
          opacity={ring.opacity ?? 0.6}
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      );
    }

    default:
      return null;
  }
}

const SeismicMandala = ({ number }) => {
  const rings = getRings();

  return (
    <div className="flex flex-col items-center group">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg viewBox="-110 -110 220 220" className="w-full h-full">
          {rings.map((ring, ri) => {
            const elements = [];

            for (let i = 0; i < ring.count; i++) {
              const angle = (360 / ring.count) * i + (ring.offset || 0);
              const rad = (angle * Math.PI) / 180;
              const cx = Math.cos(rad) * ring.radius;
              const cy = Math.sin(rad) * ring.radius;

              elements.push(renderShape(ring, ri, i, angle, rad, cx, cy));
            }

            const direction = ri % 2 === 0 ? 1 : -1;
            const rotateAmount = (ri + 1) * 3 * direction;
            const scaleAmount = 1 + (ri + 1) * 0.015;

            return (
              <g key={ri}>
                <g
                  className="transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
                            group-hover:[transform:rotate(var(--rotate))_scale(var(--scale))]"
                  style={{
                    "--rotate": `${rotateAmount}deg`,
                    "--scale": scaleAmount,
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                >
                  {elements}
                </g>
              </g>
            );
          })}
        </svg>

        <span className="absolute text-xl font-bold tracking-tight text-white/90 drop-shadow-md">
          {number}
        </span>
      </div>
    </div>
  );
};

export default SeismicMandala;
