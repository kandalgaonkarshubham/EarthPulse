import { useState } from "react";
import { CheckCircle2, ChevronDown, Settings } from "lucide-react";
import { useFilterContext } from "@/context/Filter";
import { FILTER_DATA, CATEGORIES, TIME_MARKERS } from "@/lib/filterData";

export default function MobileFilters() {
  const { 
    selectedFilters, 
    setSelectedFilters, 
    selectedTimeRange, 
    setSelectedTimeRange,
    location,
    hemisphere,
    resetFilters,
    filterCount
  } = useFilterContext();
  
  const [openCategory, setOpenCategory] = useState(null);

  const handleOptionClick = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev?.[category] === value ? null : value,
    }));
    setOpenCategory(null);
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 pb-8 w-full justify-center pointer-events-auto max-h-[40vh] overflow-y-visible animate-[popoverSlideUp_0.3s_ease-out]">
      
      {/* ── Clear Filters ── */}
      {filterCount !== null && (
        <div
          className="glass-card rounded-[20px] px-4 py-2 flex items-center gap-2 cursor-pointer transition-all border-white/20"
          onClick={resetFilters}
        >
          <Settings size={14} className="text-white/60" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-white">
            Clear
          </span>
        </div>
      )}
      <div className="relative">
        <div 
          onClick={() => setOpenCategory(openCategory === 'time' ? null : 'time')}
          className={`glass-card rounded-[20px] px-4 py-2 flex items-center gap-2 cursor-pointer transition-all ${
            selectedTimeRange !== 'all' ? 'border-amber-500/50 bg-amber-500/5' : ''
          }`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider ${
            selectedTimeRange !== 'all' ? 'text-amber-500' : 'text-white/70'
          }`}>
            Time{selectedTimeRange !== 'all' ? `: ${TIME_MARKERS.find(t => t.value === selectedTimeRange)?.label}` : ''}
          </span>
          <ChevronDown size={14} className={`transition-transform duration-300 ${openCategory === 'time' ? 'rotate-180' : ''}`} />
        </div>
        
        {openCategory === 'time' && (
          <div className="absolute bottom-full left-0 mb-2 z-[100] glass-panel rounded-xl border border-white/10 p-2 min-w-[120px] shadow-2xl animate-in fade-in slide-in-from-bottom-2">
            {TIME_MARKERS.map((t) => (
              <div
                key={t.value}
                onClick={() => {
                  setSelectedTimeRange(t.value === selectedTimeRange ? 'all' : t.value);
                  setOpenCategory(null);
                }}
                className={`px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between text-[11px] font-bold tracking-wide uppercase transition-colors ${
                  selectedTimeRange === t.value ? 'bg-amber-500/20 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{t.label}</span>
                {selectedTimeRange === t.value && <CheckCircle2 size={12} className="text-amber-500" />}
              </div>
            ))}
            <div
                onClick={() => {
                  setSelectedTimeRange('all');
                  setOpenCategory(null);
                }}
                className={`px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between text-[11px] font-bold tracking-wide uppercase transition-colors ${
                  selectedTimeRange === 'all' ? 'bg-amber-500/20 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>All Time</span>
                {selectedTimeRange === 'all' && <CheckCircle2 size={12} className="text-amber-500" />}
              </div>
          </div>
        )}
      </div>

      {/* Dynamic Filters */}
      {CATEGORIES.map((cat) => {
        const marker = FILTER_DATA[cat.key];
        const selectedValue = selectedFilters?.[cat.key];
        const isActive = !!selectedValue;
        const displayLabel = isActive
          ? marker.options.find(opt => opt.value === selectedValue)?.label
          : "";
        const isOpen = openCategory === cat.key;

        return (
          <div key={cat.key} className="relative">
            <div 
              onClick={() => setOpenCategory(isOpen ? null : cat.key)}
              className={`glass-card rounded-[20px] px-4 py-2 flex items-center gap-2 cursor-pointer transition-all ${
                isActive ? 'border-amber-500/50 bg-amber-500/5' : ''
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                isActive ? 'text-amber-500' : 'text-white/70'
              }`}>
                {marker.label}{isActive ? `: ${displayLabel}` : ''}
              </span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
              <div className="absolute bottom-full left-0 mb-2 z-[100] glass-panel rounded-xl border border-white/10 p-2 min-w-[140px] shadow-2xl animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-1">
                  {marker.options.map((opt) => {
                    const isSelected = selectedFilters[cat.key] === opt.value;
                    return (
                      <div
                        key={opt.value}
                        onClick={() => handleOptionClick(cat.key, opt.value)}
                        className={`px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between text-[11px] font-bold tracking-wide uppercase transition-colors ${
                          isSelected ? 'bg-amber-500/20 text-white border border-amber-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <CheckCircle2 size={12} className="text-amber-500" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
