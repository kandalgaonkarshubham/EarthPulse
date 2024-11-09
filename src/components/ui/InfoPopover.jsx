import { CircleHelpIcon, LinkIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function InfoPopover({ label, value, content, url }) {
  if (!content) {
    return (
      <div className="flex items-start overflow-y-scroll">
        {url ? (
          <p className="flex items-center gap-2 p-0 m-0">
            <span>{label}:</span>
            <a href={value} target="_blank" className="underline">
              <LinkIcon size={16} color="cyan" />
            </a>
          </p>
        ) : (
          <p className="flex items-center gap-2 p-0 m-0">
            <span className="font-bold font-Syne">{label}:</span>
            <span>{value}</span>
          </p>
        )}
      </div>
    );
  }
  return (
    <Popover>
      <div className="flex items-start overflow-y-scroll">
        <p className="flex items-center gap-2 p-0 m-0">
          <span className="font-bold font-Syne">{label}:</span>
          <span>{value}</span>
        </p>
        <PopoverTrigger className="ml-[0.130rem]">
          <CircleHelpIcon size={12} />
        </PopoverTrigger>
      </div>
      <PopoverContent className="bg-secondary/30 border-primary backdrop-blur-lg text-white font-Syne">
        {content}
      </PopoverContent>
    </Popover>
  );
}
