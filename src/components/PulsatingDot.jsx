function SonarSweep() {
  return (
    <div className="cursor-pointer relative flex items-center justify-center">
      <div
        className="sonar-field absolute size-2 rounded-full"
        style={{ background: "radial-gradient(circle, hsl(187.7 100% 47.5% / 0.4) 0%, transparent 70%)" }}
      />
      <div
        className="sonar-field absolute size-2 rounded-full"
        style={{ background: "radial-gradient(circle, hsl(187.7 100% 47.5% / 0.4) 0%, transparent 70%)" }}
      />
      <div
        className="size-2 rounded-full bg-cyan-400 z-20"
        style={{ boxShadow: "0 0 10px 2px hsl(187.7 100% 47.5% / 0.5)" }}
      />
    </div>
  );
}

function Heartbeat() {
  return (
    <div className="cursor-pointer relative flex items-center justify-center">
      <div className="heartbeat-ring absolute size-4 rounded-full border-[1.5px] border-orange-500" />
      <div className="heartbeat-ring absolute size-4 rounded-full border-[1.5px] border-orange-500" />
      <div
        className="heartbeat-dot size-3 rounded-full bg-orange-500 z-10"
        style={{ boxShadow: "0 0 10px 2px hsl(0 75% 55% / 0.4)" }}
      />
    </div>
  );
}

function Beacon() {
  return (
    <div className="cursor-pointer relative flex items-center justify-center">
      <div className="beacon-ring absolute size-4 rounded-full border border-pink-700 border-[1.5px]"></div>
      <div className="beacon-ring absolute size-4 rounded-full border border-pink-700 border-[1.5px]"></div>
      <div className="beacon-core size-4 rounded-full bg-pink-700 z-10 shadow-[0_0_12px_4px_hsl(332.1,100%,38.8%,0.5)]"></div>
    </div>
  );
}

function WaveRipple() {
  return (
    <div className="cursor-pointer relative flex items-center justify-center">
      <div className="wave-ring" />
      <div className="wave-ring" />
      <div className="wave-ring" />
      <div className="wave-ring" />
      <div
        className="size-[10px] rounded-full bg-rose-600 z-10"
        style={{ boxShadow: "0 0 14px 3px oklch(58.6% 0.253 17.585)" }}
      />
    </div>
  );
}

export default function PulsatingDot({ variant = "minor" }) {
  const map = {
    minor: <SonarSweep />,
    moderate: <Heartbeat />,
    strong: <Beacon />,
    severe: <WaveRipple />,
  };
  return map[variant] ?? <></>;
}
