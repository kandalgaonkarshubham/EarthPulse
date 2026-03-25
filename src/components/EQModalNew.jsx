/* eslint-disable react/prop-types */
import { X, CheckCircle2, Radio, Activity, Database, ArrowRight, MapPin, AlertTriangle } from 'lucide-react';
import { useFilterContext } from "@/context/Filter";

export default function EQModalNew({ quake, isOpen, onClose }) {
  const { userLocation } = useFilterContext();
  if (!isOpen) return null;

  const mag = quake?.properties?.mag || 0;
  const place = quake?.properties?.place || "Unknown Location";
  const eventCode = (quake?.id || quake?.properties?.code || quake?.properties?.ids?.split(',')[0] || "UNKNOWN").toUpperCase();

  // Format dates
  const timeValue = quake?.properties?.time || Date.now();
  const eventDate = new Date(timeValue).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium'
  });

  // Get status based on review
  const getStatus = () => {
    return quake?.properties?.status === 'reviewed' ? 'AUTOMATIC' : 'PENDING';
  };

  // Get Alert level config
  const getAlertConfig = (level) => {
    const l = level?.toLowerCase();
    switch(l) {
      case 'green':
        return {
          theme: 'primary',
          color: 'text-primary',
          border: 'border-primary/20',
          bg: 'bg-emerald-900/5',
          glow: 'rich-glow-emerald',
          label: 'NORMAL',
          shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
          icon: CheckCircle2,
          borderClass: 'emerald-border'
        };
      case 'yellow':
        return {
          theme: 'secondary',
          color: 'text-secondary',
          border: 'border-secondary/20',
          bg: 'bg-amber-900/5',
          glow: 'rich-glow-amber',
          label: 'ADVISORY',
          shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
          icon: AlertTriangle,
          borderClass: 'gold-border'
        };
      case 'orange':
        return {
          theme: 'tertiary',
          color: 'text-tertiary',
          border: 'border-tertiary/20',
          bg: 'bg-orange-900/5',
          glow: 'rich-glow-copper',
          label: 'WATCH',
          shadow: 'shadow-[0_0_20px_rgba(234,88,12,0.2)]',
          icon: AlertTriangle,
          borderClass: 'orange-border'
        };
      case 'red':
        return {
          theme: 'red-500',
          color: 'text-red-500',
          border: 'border-red-500/20',
          bg: 'bg-red-900/5',
          glow: 'rich-glow-red',
          label: 'CRITICAL',
          shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]',
          icon: AlertTriangle,
          borderClass: 'red-border'
        };
      default:
        return {
          theme: 'slate-500',
          color: 'text-slate-500',
          border: 'border-slate-500/10',
          bg: 'bg-slate-900/5',
          glow: '',
          label: 'NONE',
          shadow: '',
          icon: CheckCircle2,
          borderClass: 'slate-border'
        };
    }
  };

  const alertConfig = getAlertConfig(quake?.properties?.alert);
  const AlertIcon = alertConfig.icon;

  // Helper to calculate distance (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const getDistance = () => {
    if (!userLocation || !quake?.geometry?.coordinates) return null;
    return calculateDistance(
      userLocation.lat,
      userLocation.lng,
      quake.geometry.coordinates[1],
      quake.geometry.coordinates[0]
    );
  };

  const distance = getDistance();
  const isHighMag = mag >= 5.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-xl transition-all duration-500" onClick={onClose}>
      <div
        className="relative glass-panel max-w-5xl w-full max-h-[92vh] overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-[0_0_150px_rgba(0,0,0,1)] flex flex-col glass-highlight border-primary/10 font-body"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 md:px-10 py-6 md:py-8 border-b border-primary/5 flex justify-between items-center bg-primary/[0.02]">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center emerald-border glass-highlight shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <Radio className="text-primary w-6 h-6 md:w-7 md:h-7 rich-glow-emerald" />
            </div>
            <div>
              <h2 className="font-headline text-lg md:text-2xl font-bold text-on-surface tracking-[0.05em] uppercase rich-glow-emerald">EVENT ID: {eventCode}</h2>
              <p className="text-[8px] md:text-[10px] font-headline font-bold text-slate-500 tracking-[0.3em] uppercase mt-1">
                {(quake?.properties?.sources || "").replace(/,/g, ' ').trim().toUpperCase()} NETWORK — {(quake?.properties?.net || "").toUpperCase()} FEED
              </p>
            </div>
          </div>
          <button
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all text-slate-500 hover:text-white shadow-inner"
            onClick={onClose}
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-transparent scrollbar-thin">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            {/* Main Stats */}
            <div className="lg:col-span-2 space-y-8 md:space-y-10">
              {/* Magnitude & Status Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {/* Magnitude Box */}
                <div className={`md:col-span-2 ${isHighMag ? 'bg-red-900/10 border-red-500/30' : 'bg-emerald-900/5 border-primary/20'} p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border glass-highlight flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br transition-colors duration-500 ${isHighMag ? 'from-red-500/10' : 'from-primary/10'} to-transparent`}>
                  <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10">
                    <Activity className={`w-16 h-16 md:w-20 md:h-20 ${isHighMag ? 'text-red-500' : 'text-primary'}`} />
                  </div>
                  <div className={`text-[8px] md:text-[9px] font-headline ${isHighMag ? 'text-red-500 rich-glow-red' : 'text-primary rich-glow-emerald'} uppercase font-bold tracking-[0.4em] mb-2 md:mb-4`}>
                    MAGNITUDE SCALE
                   </div>
                  <div className={`font-headline text-7xl md:text-9xl font-black text-white leading-none tracking-tighter ${isHighMag ? 'rich-glow-red drop-shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 'rich-glow-emerald drop-shadow-[0_0_40px_rgba(16,185,129,0.4)]'}`}>
                    {mag.toFixed(1)}
                  </div>
                  <div className="mt-4 md:mt-6 flex gap-3">
                    <div className="h-[3px] w-32 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${isHighMag ? 'bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.6)]' : 'bg-primary/80 shadow-[0_0_10px_rgba(16,185,129,0.6)]'} animate-pulse`}
                        style={{ width: `${Math.min((mag / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Event Status Box */}
                <div className="bg-amber-900/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-secondary/20 glass-highlight overflow-hidden flex flex-col justify-center items-center text-center bg-gradient-to-br from-secondary/10 to-transparent">
                  <div className="text-[8px] md:text-[9px] font-headline text-secondary uppercase font-bold tracking-[0.4em] mb-4 md:mb-6 rich-glow-amber text-nowrap">Event Status</div>
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 md:mb-5 gold-border shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                    <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-secondary pulse-amber" />
                  </div>
                  <div className="font-headline text-xl md:text-2xl font-bold text-white uppercase tracking-widest rich-glow-amber">
                    {getStatus()}
                  </div>
                  <div className="text-[7px] md:text-[8px] font-headline text-slate-500 mt-3 md:mt-4 uppercase font-bold tracking-[0.2em] leading-relaxed">
                    Significance: {quake?.properties?.sig ?? "N/A"}<br/>
                    RMS Error: {quake?.properties?.rms ?? "N/A"}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-surface/40 p-5 md:p-6 rounded-xl md:rounded-2xl border border-primary/10 glass-highlight overflow-hidden group hover:border-primary/40 transition-all hover:bg-surface/60">
                  <div className="text-[8px] md:text-[9px] font-headline text-slate-600 uppercase font-bold tracking-[0.3em] mb-2">Global Location</div>
                  <div className="font-headline text-on-surface font-bold text-sm md:text-base tracking-tight">{place}</div>
                  <div className="text-[9px] md:text-[10px] font-headline text-primary mt-3 font-bold rich-glow-emerald tracking-wide">
                    {(quake?.geometry?.coordinates?.[1] ?? 0).toFixed(4)}°N {Math.abs(quake?.geometry?.coordinates?.[0] ?? 0).toFixed(4)}°W
                  </div>
                </div>

                <div className="bg-surface/40 p-5 md:p-6 rounded-xl md:rounded-2xl border border-secondary/10 glass-highlight overflow-hidden group hover:border-secondary/40 transition-all hover:bg-surface/60">
                  <div className="text-[8px] md:text-[9px] font-headline text-slate-600 uppercase font-bold tracking-[0.3em] mb-2">Telemetry Timestamp</div>
                  <div className="font-headline text-on-surface font-bold text-sm md:text-base tracking-tight">{eventDate}</div>
                  <div className="text-[9px] md:text-[10px] font-headline text-secondary mt-3 font-bold uppercase tracking-[0.2em]">EPOCH: {quake?.properties?.time || "N/A"}</div>
                </div>

                <div className="bg-surface/40 p-5 md:p-6 rounded-xl md:rounded-2xl border border-tertiary/10 glass-highlight overflow-hidden group hover:border-tertiary/40 transition-all hover:bg-surface/60">
                  <div className="text-[8px] md:text-[9px] font-headline text-slate-600 uppercase font-bold tracking-[0.3em] mb-2">Focal Depth</div>
                  <div className="font-headline text-2xl md:text-3xl text-tertiary font-black rich-glow-copper tracking-tighter">
                    {(quake?.geometry?.coordinates?.[2] ?? 0).toFixed(2)} <span className="text-[10px] md:text-xs font-bold text-slate-600 tracking-normal ml-1">KM</span>
                  </div>
                  <div className="text-[8px] md:text-[9px] font-headline text-slate-600 mt-2 uppercase font-bold tracking-[0.2em]">
                    Status: {
                      (quake?.geometry?.coordinates?.[2] ?? 0) <= 70 ? 'Shallow Depth Event' :
                      (quake?.geometry?.coordinates?.[2] ?? 0) <= 300 ? 'Intermediate Depth Event' : 'Deep Crustal Event'
                    }
                  </div>
                </div>

                <div className="bg-surface/40 p-5 md:p-6 rounded-xl md:rounded-2xl border border-primary/10 glass-highlight overflow-hidden group hover:border-primary/40 transition-all hover:bg-surface/60">
                  <div className="text-[8px] md:text-[9px] font-headline text-slate-600 uppercase font-bold tracking-[0.3em] mb-2">Magnitude Type</div>
                  <div className="font-headline text-2xl md:text-3xl text-primary font-black uppercase tracking-tighter rich-glow-emerald">
                    {(quake?.properties?.magType || "N/A").toUpperCase()}
                  </div>
                  <div className="text-[8px] md:text-[9px] font-headline text-slate-600 mt-2 uppercase font-bold tracking-[0.2em]">
                    {
                      {
                        'md': 'Duration Magnitude',
                        'ml': 'Local Magnitude',
                        'ms': 'Surface-wave Magnitude',
                        'mw': 'Moment Magnitude',
                        'me': 'Energy Magnitude',
                        'mi': 'Moment Magnitude',
                        'mb': 'Body-wave Magnitude',
                        'mww': 'W-phase Moment Magnitude',
                        'mwb': 'Body-wave Moment Magnitude',
                        'mwc': 'Centroid Moment Magnitude',
                        'mwr': 'Regional Moment Magnitude'
                      }[quake?.properties?.magType?.toLowerCase()] || (quake?.properties?.magType?.toUpperCase() + ' Magnitude')
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="flex flex-col h-full gap-6 md:gap-8">
              {/* Array Analytics Panel */}
              <div className="glass-panel p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-primary/10 bg-surface/40 glass-highlight overflow-hidden shadow-xl">
                <h4 className="font-headline text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-6 md:mb-8 rich-glow-emerald border-b border-primary/10 pb-4">Array Analytics</h4>
                <ul className="space-y-4 md:space-y-6">
                  <li className="flex justify-between items-center">
                    <span className="text-[8px] md:text-[9px] font-headline text-slate-600 uppercase font-bold tracking-[0.2em]">Active Nodes</span>
                    <span className="text-[10px] md:text-xs font-headline font-bold text-on-surface">{quake?.properties?.nst ?? 18} Stations</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-[8px] md:text-[9px] font-headline text-slate-600 uppercase font-bold tracking-[0.2em]">Gap Aperture</span>
                    <span className="text-[10px] md:text-xs font-headline font-bold text-on-surface">{(quake?.properties?.gap ?? 128.0).toFixed(1)}°</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-[8px] md:text-[9px] font-headline text-slate-600 uppercase font-bold tracking-[0.2em]">Min Distance</span>
                    <span className="text-[10px] md:text-xs font-headline font-bold text-primary rich-glow-emerald">{(quake?.properties?.dmin ?? 0.0105).toFixed(4)}°</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-[8px] md:text-[9px] font-headline text-slate-600 uppercase font-bold tracking-[0.2em]">Seismic Type</span>
                    <span className="text-[10px] md:text-xs font-headline font-bold text-on-surface">{(quake?.properties?.type || "unknown").toUpperCase()}</span>
                  </li>
                </ul>
              </div>

              {/* Alert Level Box */}
              <div className={`${alertConfig.bg} p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border ${alertConfig.border} glass-highlight overflow-hidden flex-1 flex flex-col justify-center items-center text-center bg-gradient-to-br from-${alertConfig.theme}/10 to-transparent shadow-xl`}>
                <div className={`text-[8px] md:text-[9px] font-headline ${alertConfig.color} uppercase font-bold tracking-[0.4em] mb-4 md:mb-6 ${alertConfig.glow} text-nowrap`}>Alert Level</div>
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${alertConfig.bg.replace('900/5', '500/10')} flex items-center justify-center mb-4 md:mb-5 ${alertConfig.borderClass} ${alertConfig.shadow}`}>
                  <AlertIcon className={`w-8 h-8 md:w-10 md:h-10 ${alertConfig.color}`} />
                </div>
                <div className={`font-headline text-xl md:text-2xl font-bold text-white uppercase tracking-widest ${alertConfig.glow}`}>
                  {alertConfig.label}
                </div>
                <div className="text-[7px] md:text-[8px] font-headline text-slate-500 mt-3 md:mt-4 uppercase font-bold tracking-[0.2em] leading-relaxed">
                  MMI Intensity: {quake?.properties?.mmi ?? "N/A"}<br/>
                  Felt Reports: {quake?.properties?.felt ?? 0}
                </div>
              </div>

            </div>
          </div>

          {/* External Source Link (Full Width Action Bar) */}
          <div
            className="mt-8 md:mt-10 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-secondary/15 glass-highlight overflow-hidden bg-gradient-to-r from-secondary/10 via-secondary/5 to-secondary/10 group cursor-pointer shadow-2xl hover:border-secondary/30 hover:from-secondary/15 transition-all flex flex-col md:flex-row items-center justify-between gap-6"
            onClick={() => window.open(quake?.properties?.url, '_blank')}
          >
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-inner group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                <Database className="w-5 h-5 md:w-8 md:h-8 text-secondary" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[9px] md:text-xs font-headline text-secondary font-black tracking-[0.3em] md:tracking-[0.4em] uppercase rich-glow-amber">Verified Source</span>
                  <div className="h-px w-6 md:w-8 bg-secondary/30"></div>
                </div>
                <p className="text-[8px] md:text-[11px] text-slate-400 font-headline font-medium uppercase tracking-[0.1em] md:tracking-[0.2em] leading-relaxed max-w-2xl">
                  Full Geological Context & Advanced Telemetry metrics accessible via the United States Geological Survey global data network
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-secondary/10 px-8 py-4 rounded-2xl border border-secondary/20 group-hover:bg-secondary/20 transition-all shadow-lg group-hover:shadow-secondary/10">
              <span className="font-headline font-black text-secondary uppercase tracking-[0.3em] text-[10px] md:text-xs rich-glow-amber">USGS EVENT PAGE</span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-secondary group-hover:translate-x-3 transition-transform duration-500" />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 md:px-10 py-6 md:py-8 border-t border-primary/5 bg-primary/[0.03] flex justify-between items-center">
          <div className="flex items-center gap-6 md:gap-12 flex-wrap">
            <div className="flex items-center gap-3 md:gap-4">
              <span className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${quake?.properties?.tsunami === 1 ? 'bg-secondary animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.8)]' : 'bg-slate-800'}`}></span>
              <span className="text-[7px] md:text-[9px] font-headline text-slate-600 uppercase font-black tracking-[0.4em]">
                Tsunami: {quake?.properties?.tsunami === 1 ? 'ACTIVE WARNING' : 'NONE'}
              </span>
            </div>
          </div>
          {distance && (
            <div className="flex items-center gap-2 md:gap-3 text-slate-600">
              <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-700" />
              <span className="text-[7px] md:text-[8px] font-headline uppercase font-bold tracking-[0.4em]">Approx {distance} km from your location</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
