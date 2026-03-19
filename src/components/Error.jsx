export default function Error({ error }) {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-center">
        <p className="text-accent-orange font-Syne font-bold text-2xl mb-2">⚠️ SYSTEM ERROR</p>
        <div className="futuristic-modal p-6 max-w-md">
          <p className="text-sm text-gray-300 font-Jetbrains mb-4">
            Unable to retrieve seismic data from the network.
          </p>
          <p className="text-xs text-accent-yellow font-bold mb-4">ERROR: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded border border-neon-cyan/30 hover:shadow-glow-cyan transition-all text-sm font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    </div>
  );
}
