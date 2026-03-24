/* eslint-disable react/prop-types */
import { RadioIcon, ArrowRight } from 'lucide-react';

export default function EQPopover({ quake, onReadMore }) {
  const mag = quake.properties.mag;
  const place = quake.properties.place;
  const coords = `${quake.geometry.coordinates[1].toFixed(3)}°N ${Math.abs(quake.geometry.coordinates[0]).toFixed(3)}°W`;

  const getMagnitudeColor = () => {
    if (mag < 3) return '#FF9D00';
    if (mag < 5) return '#FF6B35';
    return '#FF0000';
  };

  return (
    <div className="relative w-[280px] bg-[rgba(19,19,24,0.95)] backdrop-blur-[20px] border border-[rgba(78,222,3,0.15)] rounded-xl p-5 text-[#E4E1E9] font-['Inter',sans-serif] shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(78,222,3,0.05)]">
      <div className="relative z-[2]">

        {/* Header */}
        <div className="flex justify-end mb-4">
          <div className="w-9 h-9 border border-[rgba(78,222,3,0.4)] rounded-lg flex items-center justify-center text-[#00B981] shadow-[0_0_12px_rgba(0,185,129,0.2)]">
            <RadioIcon size={16} />
          </div>
        </div>

        {/* Magnitude */}
        <div className="mb-[18px]">
          <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[#00B981] mb-1.5 [text-shadow:0_0_8px_rgba(0,185,129,0.2)]">MAGNITUDE</div>
          <div className="text-4xl font-black font-['Space_Grotesk',sans-serif] leading-none" style={{ color: getMagnitudeColor() }}>
            {mag.toFixed(1)} <span className="text-xs ml-1">ML</span>
          </div>
        </div>

        {/* Location */}
        <div className="mb-[18px] pb-[18px] border-b border-[rgba(78,222,3,0.1)]">
          <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[#00B981] mb-1.5 [text-shadow:0_0_8px_rgba(0,185,129,0.2)]">LOCATION</div>
          <div className="text-[13px] font-semibold my-2 text-[#E4E1E9]">{place}</div>
          <div className="text-[11px] text-[#00B981] font-mono [text-shadow:0_0_6px_rgba(0,185,129,0.1)]">
            <span>📍</span> {coords}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-[1px] uppercase text-[#00B981]">
            <span className="w-1.5 h-1.5 bg-[#00B981] rounded-full shadow-[0_0_8px_#00B981] animate-[statusPulse_2s_ease-in-out_infinite]"></span>
            LIVE FEED
          </div>
          <button
            className="flex items-center gap-1.5 px-3.5 py-2 bg-transparent border border-[rgba(78,222,3,0.5)] rounded-md text-[#00B981] text-[9px] font-bold tracking-[1px] uppercase cursor-pointer transition-all [transition-duration:250ms] font-mono shadow-[0_0_12px_rgba(0,185,129,0.1)] hover:bg-[rgba(0,185,129,0.1)] hover:border-[rgba(78,222,3,0.8)] hover:shadow-[0_0_20px_rgba(0,185,129,0.3)] hover:-translate-y-0.5"
            onClick={onReadMore}
          >
            READ MORE <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
