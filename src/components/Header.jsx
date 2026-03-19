import { BadgeInfoIcon, XIcon, RefreshCcwIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useFilterContext } from "@/context/Filter";

export default function Header({ fetchedTime, handleRefetch }) {
  const { filterCount } = useFilterContext();
  return (
    <div className="absolute top-0 w-full flex items-start justify-between bg-gradient-to-b from-dark-bg/80 to-transparent border-b border-neon-cyan/10 backdrop-blur-lg px-6 pt-6 z-50">
      <div className="flex flex-col gap-4 text-white">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-Syne font-bold tracking-widest">
            <span className="text-neon-cyan">EARTH</span>
            <span className="text-neon-purple">PULSE</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {filterCount != null && (
            <p className="text-2xl font-bold font-Syne">
              <span className="text-accent-yellow">{filterCount}</span>
              <span className="text-gray-400 text-sm ml-2">ACTIVE</span>
            </p>
          )}
          <p className="flex items-center text-xs font-Jetbrains gap-2 text-gray-400">
            <span>UPDATED</span>
            <time className="text-neon-cyan font-bold">{fetchedTime}</time>
            <button
              onClick={handleRefetch}
              className="ml-2 p-1 hover:text-neon-cyan transition-colors"
            >
              <RefreshCcwIcon size={14} />
            </button>
          </p>
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger className="text-neon-cyan hover:text-accent-yellow mt-4 me-2 transition-colors">
          <BadgeInfoIcon size={28} />
        </AlertDialogTrigger>
        <AlertDialogContent className="futuristic-modal border-neon-cyan/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center justify-between mb-4 font-Syne text-neon-cyan">
              <span>MAGNITUDE LEGEND</span>
              <AlertDialogCancel className="bg-transparent hover:bg-neon-cyan/10 hover:text-neon-cyan border-none">
                <XIcon />
              </AlertDialogCancel>
            </AlertDialogTitle>
            <div className="px-2 text-sm space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#eed7a1]" />
                  <span className="text-gray-300">Magnitude &lt; 3.0</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#84cdee]" />
                  <span className="text-gray-300">Magnitude 3.0 - 5.0</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#ffbcda]" />
                  <span className="text-gray-300">Magnitude 5.0 - 7.0</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#eb2d3a]" />
                  <span className="text-gray-300">Magnitude &gt; 7.0</span>
                </div>
              </div>
              <div className="pt-4 border-t border-neon-cyan/20">
                <p className="text-xs text-gray-500 mb-2">Cluster indicators:</p>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#baebff]" />
                    <div className="w-3 h-3 rounded-full bg-[#bebcfc]" />
                    <div className="w-3 h-3 rounded-full bg-[#d689ff]" />
                    <div className="w-3 h-3 rounded-full bg-[#a564d3]" />
                  </div>
                  <span className="text-gray-300">Event groupings by magnitude</span>
                </div>
              </div>
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
