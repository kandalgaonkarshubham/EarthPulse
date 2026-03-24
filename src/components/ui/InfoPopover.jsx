import { CircleHelpIcon, LinkIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function InfoPopover({ label, value, content, url }) {
  if (!content) {
    return (
      <div className="info-popover-row">
        {url ? (
          <div className="info-popover-link">
            <span className="info-popover-label">{label}:</span>
            <a href={value} target="_blank" className="info-popover-url-link">
              <LinkIcon size={14} />
            </a>
          </div>
        ) : (
          <div className="info-popover-item">
            <span className="info-popover-label">{label}:</span>
            <span className="info-popover-value">{value}</span>
          </div>
        )}
      </div>
    );
  }
  return (
    <Popover>
      <div className="info-popover-row">
        <div className="info-popover-item">
          <span className="info-popover-label">{label}:</span>
          <span className="info-popover-value">{value}</span>
        </div>
        <PopoverTrigger className="info-popover-help-icon">
          <CircleHelpIcon size={14} />
        </PopoverTrigger>
      </div>
      <PopoverContent className="info-popover-content">
        {content}
      </PopoverContent>
    </Popover>
  );
}
