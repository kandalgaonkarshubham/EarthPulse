import { useFilterContext } from '@/context/Filter';
import { X } from 'lucide-react';

export default function FuturisticModal({ isOpen, onClose, earthquake }) {
  if (!isOpen || !earthquake) return null;

  const props = earthquake.properties;
  const coords = earthquake.geometry.coordinates;

  const sections = [
    {
      title: '📍 LOCATION',
      items: [
        { label: 'Place', value: props.place },
        { label: 'Latitude', value: coords[1].toFixed(4) },
        { label: 'Longitude', value: coords[0].toFixed(4) },
        { label: 'Depth', value: `${coords[2].toFixed(1)} km` },
      ],
    },
    {
      title: '📊 SEISMIC DATA',
      items: [
        { label: 'Magnitude', value: props.mag.toFixed(2), highlight: true },
        { label: 'Type', value: props.type },
        { label: 'Magnitude Type', value: props.magType },
        { label: 'RMS', value: props.rms ? props.rms.toFixed(3) : 'N/A' },
      ],
    },
    {
      title: '⏰ TIME INFORMATION',
      items: [
        { label: 'UTC Time', value: new Date(props.time).toUTCString() },
        { label: 'Status', value: props.status },
        { label: 'Network', value: props.net },
      ],
    },
    {
      title: '⚠️ ALERTS',
      items: [
        { label: 'Tsunami Alert', value: props.tsunami ? 'YES' : 'NO', highlight: props.tsunami },
        { label: 'Alert Level', value: props.alert || 'NONE' },
        { label: 'Significance', value: props.sig },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="futuristic-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative px-6 py-6 border-b border-neon-cyan/20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-neon-cyan/10 rounded transition-all"
          >
            <X size={20} className="text-neon-cyan" />
          </button>
          <h2 className="text-xl font-Syne font-bold text-neon-cyan mb-2">EARTHQUAKE DETAILS</h2>
          <p className="text-sm text-gray-400">{props.title}</p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-sm font-Syne font-bold text-neon-purple uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex justify-between items-start py-2 px-3 rounded bg-dark-bg/50 border border-dark-border/50">
                    <span className="text-xs text-gray-400 uppercase tracking-widest">{item.label}</span>
                    <span className={`text-sm font-Jetbrains font-bold text-right ${
                      item.highlight 
                        ? item.value === 'YES' || item.value === 'ALERT' 
                          ? 'text-accent-orange' 
                          : 'text-neon-cyan'
                        : 'text-accent-yellow'
                    }`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Additional Info */}
          <div className="pt-4 border-t border-neon-cyan/20">
            <div className="text-xs text-gray-500 space-y-1">
              <p>🔗 ID: {props.ids}</p>
              <p>🌐 Source: {props.net}</p>
              {props.url && (
                <p>
                  📎{' '}
                  <a
                    href={props.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-cyan hover:underline"
                  >
                    View on USGS
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neon-cyan/20 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition-all text-sm font-medium"
          >
            Close
          </button>
          {props.url && (
            <a
              href={props.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 rounded bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:shadow-glow-cyan transition-all text-sm font-medium text-center"
            >
              Learn More
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
