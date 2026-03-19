import { useFilterContext } from '@/context/Filter';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function SideFilterPanel({ side = 'left' }) {
  const {
    magnitudeFilter,
    setMagnitudeFilter,
    magnitudeTypeFilter,
    setMagnitudeTypeFilter,
    significanceFilter,
    setSignificanceFilter,
    tsunamiFilter,
    setTsunamiFilter,
    statusFilter,
    setStatusFilter,
    alertFilter,
    setAlertFilter,
  } = useFilterContext();

  const [timeRange, setTimeRange] = useState('24h');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState(null);

  // Time filter presets
  const timePresets = [
    { label: '6h', value: '6h' },
    { label: '12h', value: '12h' },
    { label: '24h', value: '24h' },
    { label: '7d', value: '7d' },
    { label: '30d', value: '30d' },
  ];

  const magnitudeRanges = [
    { label: 'All', value: null },
    { label: '1.0+', value: '1' },
    { label: '2.0+', value: '2' },
    { label: '3.0+', value: '3' },
    { label: '4.0+', value: '4' },
    { label: '5.0+', value: '5' },
  ];

  const magnitudeTypes = [
    { label: 'All', value: null },
    { label: 'ML (Local)', value: 'ml' },
    { label: 'MD (Duration)', value: 'md' },
    { label: 'MB (Body-wave)', value: 'mb' },
    { label: 'MW (Moment)', value: 'mw' },
  ];

  const statusOptions = [
    { label: 'All', value: null },
    { label: 'Automatic', value: 'automatic' },
    { label: 'Reviewed', value: 'reviewed' },
  ];

  const tsunamiOptions = [
    { label: 'All', value: null },
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 },
  ];

  const isLeft = side === 'left';
  const panelClass = isLeft
    ? 'fixed left-4 top-1/2 -translate-y-1/2'
    : 'fixed right-4 top-1/2 -translate-y-1/2';

  const contentClass = isLeft ? 'items-start' : 'items-end';
  const lineClass = isLeft ? 'left-3' : 'right-3';

  const toggleFilterSection = (filterName) => {
    setExpandedFilter(expandedFilter === filterName ? null : filterName);
  };

  const renderFilterSection = (title, items, currentValue, onSelect, filterKey) => (
    <div className="panel-item">
      <button
        onClick={() => toggleFilterSection(filterKey)}
        className="filter-chip w-full flex items-center justify-between transition-all hover:shadow-glow-purple"
      >
        <span className="text-xs">{title}</span>
        <ChevronDown
          size={12}
          className={`transition-transform ${expandedFilter === filterKey ? 'rotate-180' : ''}`}
        />
      </button>
      {expandedFilter === filterKey && (
        <div className="mt-2 space-y-1">
          {items.map((item) => (
            <button
              key={`${item.label}-${item.value}`}
              onClick={() => onSelect(item.value)}
              className={`w-full text-xs px-3 py-2 rounded transition-all text-right ${
                currentValue === item.value
                  ? 'bg-neon-cyan/30 border border-neon-cyan text-neon-cyan'
                  : 'bg-dark-bg/50 hover:bg-dark-bg'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`${panelClass} w-52 max-h-[70vh] curved-panel p-6 z-40 overflow-y-auto`}>
      {/* Curved vertical line */}
      <div className={`curved-line ${lineClass} h-full top-0`} />

      <div className={`flex flex-col gap-3 relative z-10 ${contentClass}`}>
        {/* Header */}
        <div className="text-xs uppercase tracking-widest font-Syne font-bold pb-3 border-b border-neon-cyan/20">
          <div className="text-neon-cyan">{isLeft ? '⏱ Time' : '🔍 Filters'}</div>
        </div>

        {/* Filter Items */}
        <div className="flex flex-col gap-2">
          {isLeft ? (
            // Time Filters
            <>
              {/* Preset filters */}
              {timePresets.map((preset) => (
                <div key={preset.value} className="panel-item">
                  <button
                    onClick={() => setTimeRange(preset.value)}
                    className={`filter-chip w-full text-left transition-all ${
                      timeRange === preset.value ? 'active' : ''
                    }`}
                  >
                    {preset.label}
                  </button>
                </div>
              ))}

              {/* Custom date range button */}
              <div className="panel-item pt-2 border-t border-neon-cyan/20">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="filter-chip w-full text-left text-xs"
                >
                  📅 Custom
                </button>
                {showDatePicker && (
                  <div className="mt-2 p-2 bg-dark-card rounded text-xs space-y-1">
                    <input type="date" className="w-full bg-dark-bg text-white rounded px-2 py-1 text-xs border border-neon-cyan/20" />
                    <input type="date" className="w-full bg-dark-bg text-white rounded px-2 py-1 text-xs border border-neon-cyan/20" />
                  </div>
                )}
              </div>
            </>
          ) : (
            // Seismic Filters
            <>
              {renderFilterSection('Magnitude', magnitudeRanges, magnitudeFilter, setMagnitudeFilter, 'magnitude')}
              {renderFilterSection('Magnitude Type', magnitudeTypes, magnitudeTypeFilter, setMagnitudeTypeFilter, 'magtype')}
              {renderFilterSection('Status', statusOptions, statusFilter, setStatusFilter, 'status')}
              {renderFilterSection('Tsunami', tsunamiOptions, tsunamiFilter, setTsunamiFilter, 'tsunami')}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
