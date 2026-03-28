export default function EarthquakePopup({ earthquake, timeStr, eventType }) {
  const magValue = earthquake.properties.mag || 0;
  const isHighMag = magValue >= 5.0;
  const magColorClass = isHighMag ? "text-[#ef4444]" : "text-[#f59e0b]";
  const magGlowClass = isHighMag ? "rich-glow-red" : "rich-glow-amber";

  return (
    <div className="glass-panel w-72 rounded-[2rem] p-6 shadow-2xl glass-highlight border-primary/20 bg-surface/80 font-body">
      <div className="flex justify-between items-start mb-5">
        <span className="font-['Space_Grotesk'] text-[9px] uppercase font-bold tracking-[0.3em] text-emerald-500/80 rich-glow-emerald">
          {eventType}
        </span>
        <span className="font-['Space_Grotesk'] text-[9px] font-bold text-slate-500">
          {timeStr}
        </span>
      </div>

      <div className="mb-0.5">
        <span className={`font-['Space_Grotesk'] ${magColorClass} font-black text-[42px] leading-none ${magGlowClass}`}>
          {magValue.toFixed(1)}
        </span>
        <span className={`font-['Space_Grotesk'] ${magColorClass} font-bold text-sm uppercase tracking-[0.2em] opacity-80 ml-2`}>
          {earthquake.properties.magType?.toUpperCase() || "MD"}
        </span>
      </div>

      <h3 className="font-['Space_Grotesk'] text-sm font-bold leading-relaxed text-slate-100 opacity-90">
        {earthquake.properties.place}
      </h3>

      <div className="border-t border-emerald-500/10 my-5 mt-4"></div>

      <button
        className="readmore w-full py-1 bg-transparent text-emerald-500 font-['Space_Grotesk'] text-[9px] font-bold tracking-[0.2em] border-none cursor-pointer uppercase flex items-center justify-center gap-2"
      >
        ANALYZE TELEMETRY
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </button>
    </div>
  );
}
