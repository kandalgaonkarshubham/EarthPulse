import GlobeArcs from "./FilterGlobeArcs";
import FiltersLeft from "./FiltersLeft";
import FiltersRight from "./FiltersRight";

export default function FilterLayout({
  selectedTime,
  setSelectedTime,
  selectedMonth,
  setSelectedMonth,
}) {
  return (
    <svg
      viewBox="0 0 1440 812"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <GlobeArcs />

      <FiltersLeft
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />

      <FiltersRight
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
    </svg>
  );
}
