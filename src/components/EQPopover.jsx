/* eslint-disable react/prop-types */
import { RadioIcon, ArrowRight } from 'lucide-react';

export default function EQPopover({ quake, onReadMore }) {
  const mag = quake.properties.mag;
  const place = quake.properties.place;
  const coords = `${quake.geometry.coordinates[1].toFixed(3)}°N ${Math.abs(quake.geometry.coordinates[0]).toFixed(3)}°W`;

  // Color based on magnitude
  const getMagnitudeColor = () => {
    if (mag < 3) return '#FF9D00'; // Orange for low
    if (mag < 5) return '#FF6B35'; // Orange-red for medium
    return '#FF0000'; // Red for high
  };

  return (
    <div className="eq-popover">
      <div className="eq-popover-inner">
        {/* Header with icon */}
        <div className="eq-popover-header">
          <div className="eq-popover-icon">
            <RadioIcon size={16} />
          </div>
        </div>

        {/* Magnitude Section */}
        <div className="eq-popover-magnitude-section">
          <div className="eq-popover-label">MAGNITUDE</div>
          <div className="eq-popover-magnitude" style={{ color: getMagnitudeColor() }}>
            {mag.toFixed(1)} <span className="eq-popover-magnitude-unit">ML</span>
          </div>
        </div>

        {/* Location Section */}
        <div className="eq-popover-location-section">
          <div className="eq-popover-label">LOCATION</div>
          <div className="eq-popover-location-text">{place}</div>
          <div className="eq-popover-coords">
            <span>📍</span> {coords}
          </div>
        </div>

        {/* Status and Actions */}
        <div className="eq-popover-footer">
          <div className="eq-popover-status">
            <span className="eq-popover-status-dot"></span>
            LIVE FEED
          </div>
          <button className="eq-popover-read-more" onClick={onReadMore}>
            READ MORE <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
