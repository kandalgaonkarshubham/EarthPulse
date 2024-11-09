import {
  ChartNoAxesGanttIcon,
  BadgeInfoIcon,
  XIcon,
  RefreshCcwIcon,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useFilterContext } from "@/context/Filter";

export default function Header({ toggleDrawer, fetchedTime }) {
  const { filterCount, resetMap } = useFilterContext();
  return (
    <div className="absolute top-0 w-full flex items-start justify-between bg-secondary/10 border-b border-b-secondary backdrop-blur-lg px-4 pt-4 -ms-4 z-50">
      <div className="flex flex-col gap-4 text-white">
        <div className="flex items-center gap-3">
          <button
            className="border border-neutral-200 text-white rounded-lg p-1"
            onClick={toggleDrawer}
          >
            <ChartNoAxesGanttIcon />
          </button>
          <p className="text-xl font-Syne">EarthPulse</p>
        </div>
        <div className="flex flex-col gap-2 mb-2">
          {filterCount != null && (
            <p className="text-3xl font-bold">
              <span>{filterCount}</span> Matching Events
            </p>
          )}
          <p className="flex items-center text-sm font-medium gap-1">
            Last fetched on <time className="font-bold">{fetchedTime}</time>{" "}
            <RefreshCcwIcon size={14} />
          </p>
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger className="text-white hover:text-cyan-400 mt-2 me-2">
          <BadgeInfoIcon size={30} />
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-primary border-secondary text-white font-Syne">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-between mb-2">
              <span>Info</span>
              <AlertDialogCancel className="bg-transparent hover:bg-transparent hover:text-white border-none">
                <XIcon />
              </AlertDialogCancel>
            </AlertDialogTitle>
            <div className="px-2 text-base">
              <ul className="flex flex-col gap-2 mb-4">
                <l className="flex items-center gap-2">
                  <p className="bg-[#eed7a1] w-6 h-4 rounded p-0 m-0" />
                  <span> - Lower Magnitude</span>
                </l>
                <li className="flex items-center gap-2">
                  <p className="bg-[#84cdee] w-6 h-4 rounded p-0 m-0" />
                  <span> - Medium Magnitude</span>
                </li>
                <li className="flex items-center gap-2">
                  <p className="bg-[#ffbcda] w-6 h-4 rounded p-0 m-0" />
                  <span> - Higher Magnitude</span>
                </li>
                <li className="flex items-center gap-2">
                  <p className="bg-[#eb2d3a] w-6 h-4 rounded p-0 m-0" />
                  <span> - Very High Magnitude</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <p className="bg-[#baebff] w-6 h-4 rounded p-0 m-0" />
                      <p className="bg-[#bebcfc] w-6 h-4 rounded p-0 m-0" />
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="bg-[#d689ff] w-6 h-4 rounded p-0 m-0" />
                      <p className="bg-[#a564d3] w-6 h-4 rounded p-0 m-0" />
                    </div>
                  </div>
                  <span>
                    {" "}
                    - Clusters (Groups Markers to reduce Clutter & Lag on Map)
                  </span>
                </li>
              </ul>
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
