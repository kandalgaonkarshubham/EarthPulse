import { CircleHelpIcon, LinkIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function InfoPopover({ label, value, content, url }) {
  if (!content) {
    return (
      <div className="flex items-center gap-2 py-2.5">
        {url ? (
          <div className="flex items-center gap-2 w-full px-2.5 py-2 rounded-md transition-all hover:bg-[rgba(0,240,255,0.08)]">
            <span className="font-bold text-[#00f0ff] text-[11px] tracking-[0.5px] uppercase min-w-max [text-shadow:0_0_8px_rgba(0,240,255,0.2)]">{label}:</span>
            <a
              href={value}
              target="_blank"
              className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-lg bg-[rgba(0,240,255,0.15)] border border-[rgba(0,240,255,0.4)] text-[#00f0ff] transition-all shrink-0 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.2)] hover:bg-[rgba(0,240,255,0.3)] hover:border-[rgba(0,240,255,0.8)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:scale-[1.15] hover:rotate-[5deg]"
            >
              <LinkIcon size={14} />
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md transition-all hover:bg-[rgba(0,240,255,0.08)] hover:translate-x-1">
            <span className="font-bold text-[#00f0ff] text-[11px] tracking-[0.5px] uppercase min-w-max [text-shadow:0_0_8px_rgba(0,240,255,0.2)]">{label}:</span>
            <span className="text-white text-[12px] font-mono break-all font-medium">{value}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Popover>
      <div className="flex items-center gap-2 py-2.5">
        <div className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md transition-all hover:bg-[rgba(0,240,255,0.08)] hover:translate-x-1">
          <span className="font-bold text-[#00f0ff] text-[11px] tracking-[0.5px] uppercase min-w-max [text-shadow:0_0_8px_rgba(0,240,255,0.2)]">{label}:</span>
          <span className="text-white text-[12px] font-mono break-all font-medium">{value}</span>
        </div>
        <PopoverTrigger className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(0,240,255,0.15)] text-[#00f0ff] cursor-help transition-all shrink-0 border border-[rgba(0,240,255,0.3)] text-[11px] font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-[rgba(0,240,255,0.3)] hover:border-[rgba(0,240,255,0.7)] hover:shadow-[0_0_16px_rgba(0,240,255,0.5)] hover:scale-[1.2] hover:-rotate-[5deg]">
          <CircleHelpIcon size={14} />
        </PopoverTrigger>
      </div>
      <PopoverContent className="bg-[rgba(10,15,25,0.85)] border border-[rgba(0,240,255,0.4)] backdrop-blur-[20px] text-[#f1f5f9] text-xs p-[14px_18px] rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.3),0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] font-['Quicksand',sans-serif] leading-relaxed">
        {content}
      </PopoverContent>
    </Popover>
  );
}
