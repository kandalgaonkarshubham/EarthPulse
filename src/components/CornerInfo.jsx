import { useFilterContext } from "@/context/Filter";

export const CornerInfo = () => {
  const { earthquakes, filterCount } = useFilterContext();

  const totalQuakes = earthquakes.length;
  const maxMag = earthquakes.reduce(
    (max, q) => Math.max(max, q.properties.mag || 0),
    0
  );

  return (
    <>
      {/* Top Left */}
      <div className="absolute top-8 left-8 pointer-events-auto z-20">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-bold">
            Total Events
          </span>
          <span className="text-4xl font-light text-white">
            {filterCount !== null ? filterCount : totalQuakes}
          </span>
        </div>
      </div>

      {/* Bottom Left */}
      <div className="absolute bottom-8 left-8 pointer-events-auto z-20">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-bold">
            Max Magnitude
          </span>
          <span className="text-4xl font-light text-white">
            {maxMag.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-8 right-8 pointer-events-auto z-20 text-right">
        <div className="flex flex-col gap-1 items-end">
          <span className="text-xs text-purple-400 uppercase tracking-widest font-bold">
            Status
          </span>
          <span className="text-xl font-light text-white flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live Monitoring
          </span>
        </div>
      </div>
    </>
  );
};
