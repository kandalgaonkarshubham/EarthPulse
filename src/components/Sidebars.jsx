import { useFilterContext } from "@/context/Filter";

export const LeftSidebar = () => {
  const { timeFilter, setTimeFilter } = useFilterContext();

  const timeOptions = [
    { label: "Past 1 Hour", value: 1 },
    { label: "Past 6 Hours", value: 6 },
    { label: "Past 12 Hours", value: 12 },
    { label: "Past 24 Hours", value: 24 },
  ];

  return (
    <div className="absolute left-0 top-0 bottom-0 w-64 pointer-events-auto flex items-center justify-start pl-8">
      {/* Curved SVG Line */}
      <svg
        className="absolute left-0 top-0 h-full w-full pointer-events-none"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
      >
        <path
          d="M 20,0 Q 80,500 20,1000"
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>

      <div className="relative z-10 flex flex-col gap-12">
        {timeOptions.map((option, index) => {
          // Calculate horizontal offset to follow the curve
          // The curve goes from x=20 to x=80 at the center, then back to x=20
          // We have 4 items, so let's distribute them
          const offset = index === 0 || index === 3 ? 20 : 60;
          
          return (
            <button
              key={option.value}
              onClick={() => setTimeFilter(timeFilter === option.value ? null : option.value)}
              className={`relative flex items-center gap-3 transition-all duration-300 ${
                timeFilter === option.value
                  ? "text-cyan-400 scale-110"
                  : "text-gray-400 hover:text-white"
              }`}
              style={{ transform: `translateX(${offset}px)` }}
            >
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  timeFilter === option.value
                    ? "bg-cyan-400 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                    : "bg-transparent border-gray-500"
                }`}
              />
              <span className="text-sm font-medium tracking-wider uppercase">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const RightSidebar = () => {
  const {
    magnitudeFilter,
    setMagnitudeFilter,
  } = useFilterContext();

  const magOptions = [
    { label: "All Mag", value: null },
    { label: "> 2.5", value: "2.5" },
    { label: "> 4.5", value: "4.5" },
    { label: "> 6.0", value: "6.0" },
  ];

  return (
    <div className="absolute right-0 top-0 bottom-0 w-64 pointer-events-auto flex items-center justify-end pr-8">
      {/* Curved SVG Line */}
      <svg
        className="absolute right-0 top-0 h-full w-full pointer-events-none"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
      >
        <path
          d="M 80,0 Q 20,500 80,1000"
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      </svg>

      <div className="relative z-10 flex flex-col gap-12 items-end">
        {magOptions.map((option, index) => {
          const offset = index === 0 || index === 3 ? -20 : -60;
          
          return (
            <button
              key={option.label}
              onClick={() => setMagnitudeFilter(option.value)}
              className={`relative flex items-center gap-3 transition-all duration-300 ${
                magnitudeFilter === option.value
                  ? "text-purple-400 scale-110"
                  : "text-gray-400 hover:text-white"
              }`}
              style={{ transform: `translateX(${offset}px)` }}
            >
              <span className="text-sm font-medium tracking-wider uppercase">
                {option.label}
              </span>
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  magnitudeFilter === option.value
                    ? "bg-purple-400 border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)]"
                    : "bg-transparent border-gray-500"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
