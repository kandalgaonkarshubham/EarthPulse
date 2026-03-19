import { useFilterContext } from '@/context/Filter';
import { useMemo } from 'react';

export default function CornerInfo() {
  const { earthquakes, getFilteredData } = useFilterContext();
  const filteredData = useMemo(() => getFilteredData(), []);

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        total: 0,
        maxMagnitude: 'N/A',
        avgMagnitude: '0.0',
        maxLocation: 'N/A',
      };
    }

    const magnitudes = filteredData.map(e => e.properties.mag);
    const maxMag = Math.max(...magnitudes);
    const avgMag = (magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length).toFixed(1);
    const maxEarthquake = filteredData.find(e => e.properties.mag === maxMag);
    
    return {
      total: filteredData.length,
      maxMagnitude: maxMag.toFixed(2),
      avgMagnitude: avgMag,
      maxLocation: maxEarthquake?.properties.place || 'Unknown',
    };
  }, [filteredData]);

  // Get hemisphere info
  const getHemisphere = () => {
    const coords = earthquakes.length > 0 
      ? earthquakes.map(e => ({
          lat: e.geometry.coordinates[1],
          lng: e.geometry.coordinates[0],
        }))
      : [];
    
    if (coords.length === 0) return { lat: 'N/A', lng: 'N/A' };
    
    const avgLat = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;
    const avgLng = coords.reduce((sum, c) => sum + c.lng, 0) / coords.length;
    
    const latHem = avgLat >= 0 ? 'N' : 'S';
    const lngHem = avgLng >= 0 ? 'E' : 'W';
    
    return {
      lat: `${Math.abs(avgLat).toFixed(1)}°${latHem}`,
      lng: `${Math.abs(avgLng).toFixed(1)}°${lngHem}`,
    };
  };

  const hemisphere = useMemo(() => getHemisphere(), [earthquakes]);

  return (
    <>
      {/* Top Left - Total Events */}
      <div className="corner-info top-6 left-6">
        <div className="corner-info-label">TOTAL EVENTS</div>
        <div className="corner-info-value">{stats.total}</div>
        <div className="text-xs text-gray-400 mt-1">active earthquakes</div>
      </div>

      {/* Top Right - Max Magnitude */}
      <div className="corner-info top-6 right-6 text-right">
        <div className="corner-info-label">MAX MAGNITUDE</div>
        <div className="corner-info-value text-accent-orange">{stats.maxMagnitude}</div>
        <div className="text-xs text-gray-400 mt-1 overflow-hidden overflow-ellipsis">
          {stats.maxLocation.substring(0, 25)}
        </div>
      </div>

      {/* Bottom Left - Coordinates */}
      <div className="corner-info bottom-6 left-6">
        <div className="corner-info-label">LOCATION</div>
        <div className="corner-info-value text-neon-green">{hemisphere.lat}</div>
        <div className="corner-info-value text-neon-green">{hemisphere.lng}</div>
        <div className="text-xs text-gray-400 mt-1">average position</div>
      </div>

      {/* Bottom Right - Average Magnitude */}
      <div className="corner-info bottom-6 right-6 text-right">
        <div className="corner-info-label">AVERAGE MAG</div>
        <div className="corner-info-value text-neon-purple">{stats.avgMagnitude}</div>
        <div className="text-xs text-gray-400 mt-1">mean intensity</div>
      </div>
    </>
  );
}
