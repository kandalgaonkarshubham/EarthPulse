/* eslint-disable react/prop-types */
import { X, CheckCircle2, Radio } from 'lucide-react';

export default function EQModalNew({ quake, isOpen, onClose }) {
  if (!isOpen) return null;

  const mag = quake?.properties?.mag || 0;
  const place = quake?.properties?.place || "Unknown Location";
   const eventCode = (quake?.id || quake?.properties?.code || quake?.properties?.ids?.split(',')[0] || "UNKNOWN").toUpperCase();
  
  // Get magnitude color
  const getMagnitudeColor = () => {
    if (mag < 3) return '#FF9D00'; // Orange for low
    if (mag < 5) return '#FF6B35'; // Orange-red for medium
    return '#FF0000'; // Red for high
  };

  // Format dates
  const timeValue = quake?.properties?.time || Date.now();
  const eventTime = new Date(timeValue).toLocaleString();
  const eventDate = new Date(timeValue).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Get status based on review
  const getStatus = () => {
    return quake?.properties?.status === 'reviewed' ? 'AUTOMATIC' : 'PENDING';
  };

  return (
    <div className="eq-modal-overlay" onClick={onClose}>
      <div className="eq-modal-new" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="eq-modal-new-header">
          <div className="eq-modal-new-header-left">
            <div className="eq-modal-new-icon">
              <Radio size={20} />
            </div>
            <div className="eq-modal-new-title-section">
              <h2 className="eq-modal-new-title">EVENT ID: {eventCode}</h2>
              <p className="eq-modal-new-subtitle">{(quake?.properties?.sources || "").replace(/,/g, ' ').trim().toUpperCase()} NETWORK — {(quake?.properties?.net || "").toUpperCase()}</p>
            </div>
          </div>
          <button className="eq-modal-new-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="eq-modal-new-content">
          {/* Top Row - Three Cards */}
          <div className="eq-modal-new-grid-top">
            {/* Magnitude Card - Teal */}
            <div className="eq-modal-new-card eq-modal-new-card-magnitude">
              <div className="eq-modal-new-card-label">MAGNITUDE ({quake?.properties?.magType?.toUpperCase() || 'ML'})</div>
              <div className="eq-modal-new-magnitude-display">{mag.toFixed(1)}</div>
            </div>

            {/* Status Card - Orange */}
            <div className="eq-modal-new-card eq-modal-new-card-status">
              <div className="eq-modal-new-card-label">EVENT STATUS</div>
              <div className="eq-modal-new-status-icon">
                <CheckCircle2 size={32} />
              </div>
              <div className="eq-modal-new-status-text">{getStatus()}</div>
              <div className="eq-modal-new-status-meta">
                SIGNIFICANCE: {quake?.properties?.sig ?? "N/A"}<br/>RMS ERROR: {quake?.properties?.rms ?? "N/A"}
              </div>
            </div>

            {/* Analytics Card */}
            <div className="eq-modal-new-card eq-modal-new-card-analytics">
              <div className="eq-modal-new-card-label">ARRAY ANALYTICS</div>
              <div className="eq-modal-new-analytics-item">
                <span className="eq-modal-new-analytics-label">ACTIVE MODES</span>
                <span className="eq-modal-new-analytics-value">18 Stations</span>
              </div>
              <div className="eq-modal-new-analytics-item">
                <span className="eq-modal-new-analytics-label">GAP APERTURE</span>
                <span className="eq-modal-new-analytics-value">{(quake?.properties?.gap ?? 128).toFixed(1)}°</span>
              </div>
              <div className="eq-modal-new-analytics-item">
                <span className="eq-modal-new-analytics-label">MIN DISTANCE</span>
                <span className="eq-modal-new-analytics-value">{(quake?.properties?.dmin ?? 0.0105).toFixed(4)}°</span>
              </div>
              <div className="eq-modal-new-analytics-item">
                <span className="eq-modal-new-analytics-label">CONFIDENCE</span>
                <span className="eq-modal-new-analytics-value">Tier 3 (High)</span>
              </div>
            </div>
          </div>

          {/* Middle Row - Data Cards */}
          <div className="eq-modal-new-grid-middle">
            {/* Global Location */}
            <div className="eq-modal-new-card eq-modal-new-card-small">
              <div className="eq-modal-new-card-label">GLOBAL LOCATION</div>
              <div className="eq-modal-new-location-text">{place}</div>
              <div className="eq-modal-new-location-coords">
                {(quake?.geometry?.coordinates?.[1] ?? 0).toFixed(4)}°N {Math.abs(quake?.geometry?.coordinates?.[0] ?? 0).toFixed(4)}°W
              </div>
            </div>

            {/* Telemetry */}
            <div className="eq-modal-new-card eq-modal-new-card-small">
              <div className="eq-modal-new-card-label">TELEMETRY TIMESTAMP</div>
              <div className="eq-modal-new-timestamp">{eventDate}</div>
              <div className="eq-modal-new-epoch">
                EPOCH: {quake?.properties?.time || "N/A"}
              </div>
            </div>

            {/* Seismic Event Type */}
            <div className="eq-modal-new-card eq-modal-new-card-small">
              <div className="eq-modal-new-card-label">EVENT TYPE</div>
              <div className="eq-modal-new-location-text">{(quake?.properties?.type || "N/A").toUpperCase()}</div>
              <div className="eq-modal-new-magtype-desc">
                Seismic Classification
              </div>
            </div>
          </div>

          {/* Bottom Row - More Data Cards */}
          <div className="eq-modal-new-grid-bottom">
            {/* Focal Depth */}
            <div className="eq-modal-new-card eq-modal-new-card-small">
              <div className="eq-modal-new-card-label">FOCAL DEPTH</div>
              <div className="eq-modal-new-depth-value">{(quake?.geometry?.coordinates?.[2] ?? 0).toFixed(2)}</div>
              <div className="eq-modal-new-depth-unit">KM</div>
            </div>

            {/* Magnitude Type */}
            <div className="eq-modal-new-card eq-modal-new-card-small">
              <div className="eq-modal-new-card-label">MAGNITUDE TYPE</div>
              <div className="eq-modal-new-magtype">{quake?.properties?.magType?.toUpperCase() || 'N/A'}</div>
              <div className="eq-modal-new-magtype-desc">
                Source: {quake?.properties?.net?.toUpperCase() || 'USGS'}
              </div>
            </div>

            {/* Verified Source */}
            <div className="eq-modal-new-card eq-modal-new-card-verified">
              <div className="eq-modal-new-card-label">VERIFIED SOURCE</div>
              <p className="eq-modal-new-verified-text">
                COMPLETE EVENT DATA<br/>
                PROVIDED BY USGS
              </p>
              <button 
                className="eq-modal-new-archive-link"
                onClick={() => window.open(quake?.properties?.url, '_blank')}
              >
                EVENT PAGE →
              </button>
            </div>
          </div>

          {/* Footer Status */}
          <div className="eq-modal-new-footer-status">
            <div className="eq-modal-new-status-indicator">
              <span className="eq-modal-new-status-dot"></span>
              EVENT TYPE: {(quake?.properties?.type || "unknown").toUpperCase()}
            </div>
            <div className="eq-modal-new-status-indicator">
              TSUNAMI WARNING: {quake?.properties?.tsunami === 1 ? "ACTIVE" : "NONE"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
