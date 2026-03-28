export default function Cluster({ value = 0 }) {
  const low = 30;
  const mid = 70;

  let config = {};

  switch (true) {
    case value <= low:
      config = {
        shadow: "hsl(192.5 100% 23.5%",
        bg: "bg-[hsl(192.5,100%,23.5%)]",
        scale: 1.6,
        size: "size-6",
      };
      break;

    case value <= mid:
      config = {
        shadow: "hsl(266.6 86.4% 40.4%",
        bg: "bg-[hsl(266.6,86.4%,40.4%)]",
        scale: 2,
        size: "size-8",
      };
      break;

    case value > mid:
      config = {
        shadow: "hsl(340.4 100% 32.4%",
        bg: "bg-[hsl(340.4,100%,32.4%)]",
        scale: 2.4,
        size: "size-10",
      };
  }

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        "--glow-color-low": `${config.shadow} / 0.3)`,
        "--glow-color-high": `${config.shadow} / 0.5)`,
        "--scale-peak": config.scale,
      }}
    >
      <div
        className={`breathe-glow absolute ${config.size} rounded-full ${config.bg} blur-[18px]`}
      />
      <div
        className={`breathe-dot ${config.size} rounded-full ${config.bg} flex items-center justify-center text-xs text-black`}
      >
        {value}
      </div>
    </div>
  );
}
