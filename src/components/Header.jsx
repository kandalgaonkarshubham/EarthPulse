import { ChartNoAxesGanttIcon } from "lucide-react";

export default function Header({ toggleDrawer }) {
  return (
    <div className="absolute top-0 w-full flex flex-col gap-4 bg-secondary/10 border-b border-b-neutral-200 backdrop-blur-lg z-50 px-4 pt-4 -ms-4">
      <div className="flex items-center gap-3">
        <button
          className="border border-neutral-400 text-neutral-600 rounded-lg p-1"
          onClick={toggleDrawer}
        >
          <ChartNoAxesGanttIcon />
        </button>
        <p className="text-xl font-Syne">EarthPulse</p>
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <p className="text-4xl font-bold">Shipment #4512</p>
        <p className="text-sm font-medium">Completed on 12/34/5001 4:22pm</p>
      </div>
    </div>
  );
}
