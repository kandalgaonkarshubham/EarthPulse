export default function Loader() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="text-center">
        <p className="text-lg font-Syne font-bold text-neon-cyan">INITIALIZING SEISMIC NETWORK</p>
        <p className="text-sm text-gray-400 mt-2">Scanning global earthquake data...</p>
      </div>
    </div>
  );
}
