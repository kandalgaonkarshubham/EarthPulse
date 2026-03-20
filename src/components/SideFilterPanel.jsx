import { useFilterContext } from '@/context/Filter';
import { useState } from 'react';

export default function SideFilterPanel({ side = 'left' }) {
  const {
    timeRangeFilter,
    setTimeRangeFilter,
    magnitudeFilter,
    setMagnitudeFilter,
    magnitudeTypeFilter,
    setMagnitudeTypeFilter,
    statusFilter,
    setStatusFilter,
    tsunamiFilter,
    setTsunamiFilter,
  } = useFilterContext();

  const isLeft = side === 'left';

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
    { label: 'ML', value: 'ml' },
    { label: 'MD', value: 'md' },
    { label: 'MB', value: 'mb' },
    { label: 'MW', value: 'mw' },
  ];

  const statusOptions = [
    { label: 'Auto', value: 'automatic' },
    { label: 'Rev', value: 'reviewed' },
  ];

  const tsunamiOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 },
  ];

  const filters = isLeft ? timePresets : magnitudeRanges;
  const height = 600;
  const itemSpacing = height / (filters.length + 1);

  return (
    <div className={`fixed top-1/2 -translate-y-1/2 z-40 ${isLeft ? 'left-0' : 'right-0'}`}>
      {/* SVG Curved Line */}
      <svg
        className="absolute"
        style={{
          width: '80px',
          height: `${height}px`,
          top: `${-height / 2}px`,
          [isLeft ? 'left' : 'right']: '0',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <linearGradient id={`gradient-${side}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 212, 255, 0)" />
            <stop offset="50%" stopColor="rgba(0, 212, 255, 0.6)" />
            <stop offset="100%" stopColor="rgba(0, 212, 255, 0)" />
          </linearGradient>
        </defs>
        {/* Curved path */}
        <path
          d={
            isLeft
              ? `M 70 0 Q 40 ${height / 2}, 70 ${height}`
              : `M 10 0 Q 40 ${height / 2}, 10 ${height}`
          }
          stroke={`url(#gradient-${side})`}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Filter Items positioned along curve */}
      <div className="relative" style={{ width: '80px', height: `${height}px` }}>
        {filters.map((filter, index) => {
          const topPosition = itemSpacing * (index + 1) - height / 2;
          const isActive = isLeft 
            ? timeRangeFilter === filter.value
            : magnitudeFilter === filter.value;
          
          const handleClick = () => {
            if (isLeft) {
              setTimeRangeFilter(timeRangeFilter === filter.value ? null : filter.value);
            } else {
              setMagnitudeFilter(magnitudeFilter === filter.value ? null : filter.value);
            }
          };

          return (
            <button
              key={`${side}-${filter.value}`}
              onClick={handleClick}
              className={`absolute transition-all duration-300 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                isLeft ? 'left-12' : 'right-12'
              } ${
                isActive
                  ? 'bg-neon-cyan/40 border border-neon-cyan text-neon-cyan shadow-glow-cyan'
                  : 'bg-dark-card/50 border border-dark-border text-gray-300 hover:bg-dark-card hover:border-neon-cyan/50'
              }`}
              style={{ top: `${topPosition}px` }}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Additional secondary filters for right side */}
      {!isLeft && (
        <div className="mt-4 space-y-3 mr-4 ml-0">
          {/* Magnitude Type */}
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-bold px-3">TYPE</p>
            <div className="flex gap-1 flex-wrap">
              {magnitudeTypes.map((type) => (
                <button
                  key={`magtype-${type.value}`}
                  onClick={() =>
                    setMagnitudeTypeFilter(
                      magnitudeTypeFilter === type.value ? null : type.value
                    )
                  }
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    magnitudeTypeFilter === type.value
                      ? 'bg-neon-purple/40 border border-neon-purple text-neon-purple'
                      : 'bg-dark-card/50 border border-dark-border text-gray-400 hover:border-neon-purple/50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-bold px-3">STATUS</p>
            <div className="flex gap-1 flex-wrap">
              {statusOptions.map((status) => (
                <button
                  key={`status-${status.value}`}
                  onClick={() =>
                    setStatusFilter(
                      statusFilter === status.value ? null : status.value
                    )
                  }
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    statusFilter === status.value
                      ? 'bg-neon-green/40 border border-neon-green text-neon-green'
                      : 'bg-dark-card/50 border border-dark-border text-gray-400 hover:border-neon-green/50'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tsunami */}
          <div className="space-y-1">
            <p className="text-xs text-gray-400 font-bold px-3">TSUNAMI</p>
            <div className="flex gap-1 flex-wrap">
              {tsunamiOptions.map((tsunami) => (
                <button
                  key={`tsunami-${tsunami.value}`}
                  onClick={() =>
                    setTsunamiFilter(
                      tsunamiFilter === tsunami.value ? null : tsunami.value
                    )
                  }
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    tsunamiFilter === tsunami.value
                      ? 'bg-neon-pink/40 border border-neon-pink text-neon-pink'
                      : 'bg-dark-card/50 border border-dark-border text-gray-400 hover:border-neon-pink/50'
                  }`}
                >
                  {tsunami.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
