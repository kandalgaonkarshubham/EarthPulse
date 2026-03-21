import { useState, useCallback } from "react";
import GlobeArcs from "./FilterGlobeArcs";
import FiltersLeft from "./FiltersLeft";
import FiltersRight from "./FiltersRight";
import Map from "../Map";

export default function FilterLayout({
  selectedTime,
  setSelectedTime,
  selectedMonth,
  setSelectedMonth,
}) {
  const [apex, setApex] = useState(null);

  const handleApexChange = useCallback((newApex) => {
    setApex(newApex);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* Background Map */}
      <div className="absolute inset-0 w-full h-full">
        <Map />
      </div>

      {/* SVG Overlay */}
      <svg
        viewBox="0 0 1440 812"
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
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

        {/* GlobeArcs drives the apex state and notifies parent */}
        <GlobeArcs onApexChange={handleApexChange} />

        <g className="pointer-events-auto">
          <FiltersLeft
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            apex={apex}
          />
        </g>

        <g className="pointer-events-auto">
          <FiltersRight
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            apex={apex}
          />
        </g>
      </svg>
    </div>
  );
}
