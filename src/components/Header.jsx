import {
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

export default function Header({ fetchedTime, handleRefetch }) {
  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto z-50">
      <div className="flex items-center gap-3">
        <p className="text-3xl font-Syne tracking-widest text-white uppercase">EarthPulse</p>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <p className="flex items-center gap-2">
          Last updated: <time className="text-white">{fetchedTime}</time>
        </p>
        <button
          onClick={handleRefetch}
          className="hover:text-cyan-400 transition-colors"
        >
          <RefreshCcwIcon size={16} />
        </button>
        <AlertDialog>
          <AlertDialogTrigger className="hover:text-cyan-400 transition-colors">
            <BadgeInfoIcon size={16} />
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-black/90 border border-cyan-500/30 text-white font-Syne backdrop-blur-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center justify-between mb-2 text-cyan-400">
                <span>Legend</span>
                <AlertDialogCancel className="bg-transparent hover:bg-transparent hover:text-white border-none">
                  <XIcon />
                </AlertDialogCancel>
              </AlertDialogTitle>
              <div className="px-2 text-base">
                <ul className="flex flex-col gap-3 mb-4">
                  <li className="flex items-center gap-3">
                    <div className="bg-[#eed7a1] w-4 h-4 rounded-full shadow-[0_0_10px_#eed7a1]" />
                    <span className="text-gray-300">Magnitude &lt; 3</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-[#84cdee] w-5 h-5 rounded-full shadow-[0_0_10px_#84cdee]" />
                    <span className="text-gray-300">Magnitude 3 - 5</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-[#ffbcda] w-6 h-6 rounded-full shadow-[0_0_10px_#ffbcda]" />
                    <span className="text-gray-300">Magnitude 5 - 7</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-[#eb2d3a] w-8 h-8 rounded-full shadow-[0_0_10px_#eb2d3a]" />
                    <span className="text-gray-300">Magnitude &gt; 7</span>
                  </li>
                  <li className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-800">
                    <div className="flex gap-1">
                      <div className="bg-[#baebff] w-6 h-6 rounded-full flex items-center justify-center text-black text-xs font-bold">10</div>
                    </div>
                    <span className="text-gray-300">Clustered Events</span>
                  </li>
                </ul>
              </div>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
