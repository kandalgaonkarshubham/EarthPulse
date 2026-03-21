const gradients = [
  {
    id: "pg0",
    x1: "0.0198059", y1: "60.3", x2: "0.0198059", y2: "839.7",
    stops: [
      { offset: "0", opacity: 0 },
      { offset: "0.2", opacity: 0.2 },
      { offset: "0.8", opacity: 0.2 },
      { offset: "1", opacity: 0 },
    ],
  },
  {
    id: "pg1",
    x1: "675", y1: "60.3", x2: "675", y2: "839.7",
    stops: [
      { offset: "0", opacity: 0 },
      { offset: "0.2", opacity: 0.2 },
      { offset: "0.8", opacity: 0.2 },
      { offset: "1", opacity: 0 },
    ],
  },
  {
    id: "pg2",
    x1: "100.015", y1: "146.9", x2: "100.015", y2: "753.1",
    stops: [
      { offset: "0", opacity: 0 },
      { offset: "0.25", opacity: 0.05 },
      { offset: "0.75", opacity: 0.05 },
      { offset: "1", opacity: 0 },
    ],
  },
  {
    id: "pg3",
    x1: "625", y1: "146.9", x2: "625", y2: "753.1",
    stops: [
      { offset: "0", opacity: 0 },
      { offset: "0.25", opacity: 0.05 },
      { offset: "0.75", opacity: 0.05 },
      { offset: "1", opacity: 0 },
    ],
  },
  {
    id: "pg4",
    x1: "-99.9758", y1: "-26.3", x2: "-99.9758", y2: "926.3",
    stops: [
      { offset: "0", opacity: 0 },
      { offset: "0.25", opacity: 0.05 },
      { offset: "0.75", opacity: 0.05 },
      { offset: "1", opacity: 0 },
    ],
  },
  {
    id: "pg5",
    x1: "725", y1: "-26.3", x2: "725", y2: "926.3",
    stops: [
      { offset: "0", opacity: 0 },
      { offset: "0.25", opacity: 0.05 },
      { offset: "0.75", opacity: 0.05 },
      { offset: "1", opacity: 0 },
    ],
  },
];

const arcs = [
  { gradient: "pg0", strokeWidth: 1.5, d: "M225 60.3C85.7807 140.688 0.0198059 289.239 0.0198059 450C0.0198059 610.761 85.7807 759.312 225 839.7" },
  { gradient: "pg1", strokeWidth: 1.5, d: "M675 60.3C814.219 140.688 899.98 289.239 899.98 450C899.98 610.761 814.219 759.312 675 839.7" },
  { gradient: "pg2", strokeWidth: 1,   d: "M275 146.9C166.718 209.424 100.015 324.963 100.015 450C100.015 575.037 166.718 690.576 275 753.1" },
  { gradient: "pg3", strokeWidth: 1,   d: "M625 146.9C733.282 209.424 799.985 324.963 799.985 450C799.985 575.037 733.282 690.576 625 753.1" },
  { gradient: "pg4", strokeWidth: 1,   d: "M175 -26.3C4.84305 71.9517 -99.9758 253.514 -99.9758 450C-99.9758 646.486 4.84305 828.048 175 926.3" },
  { gradient: "pg5", strokeWidth: 1,   d: "M725 -26.3C895.157 71.9517 999.976 253.514 999.976 450C999.976 646.486 895.157 828.048 725 926.3" },
];

export default function GlobeArcs() {
  return (
    <svg
      x="270"
      y="-44"
      width="900"
      height="900"
      viewBox="0 0 900 900"
      overflow="visible"
    >
      <defs>
        {gradients.map(({ id, x1, y1, x2, y2, stops }) => (
          <linearGradient key={id} id={id} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
            {stops.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor="white" stopOpacity={s.opacity} />
            ))}
          </linearGradient>
        ))}
        <clipPath id="planetClip">
          <rect width="900" height="900" fill="white" />
        </clipPath>
      </defs>

      <g clipPath="url(#planetClip)">
        {arcs.map((arc) => (
          <path
            key={arc.gradient}
            d={arc.d}
            stroke={`url(#${arc.gradient})`}
            strokeWidth={arc.strokeWidth}
            fill="none"
          />
        ))}
      </g>
    </svg>
  );
}
