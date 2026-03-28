export const TIME_MARKERS = [
  { label: "1H", y: 266, value: "1h" },
  { label: "2H", y: 338, value: "2h" },
  { label: "6H", y: 410, value: "6h" },
  { label: "12H", y: 482, value: "12h" },
  { label: "24H", y: 554, value: "24h" },
];

export const FILTER_DATA = {
  magnitude: {
    label: "MAG",
    options: [
      { label: "0-2", value: "0-2" },
      { label: "2-4", value: "2-4" },
      { label: "4-6", value: "4-6" },
      { label: "6+",  value: "6+"  },
    ],
  },
  significance: {
    label: "SIG",
    options: [
      { label: "0-100",   value: "0-100"   },
      { label: "100-200", value: "100-200" },
      { label: "200-300", value: "200-300" },
      { label: "300+",    value: "300+"    },
    ],
  },
  tsunami: {
    label: "TSU",
    options: [
      { label: "Yes",     value: "yes"     },
      { label: "No",      value: "no"      },
    ],
  },
  status: {
    label: "STA",
    options: [
      { label: "Reviewed",  value: "reviewed"  },
      { label: "Automatic", value: "automatic" },
    ],
  },
  alert: {
    label: "ALT",
    options: [
      { label: "Green",  value: "green"  },
      { label: "Yellow", value: "yellow" },
      { label: "Orange", value: "orange" },
      { label: "Red",    value: "red"    },
    ],
  },
  type: {
    label: "TYP",
    options: [
      { label: "ML",  value: "ml"  },
      { label: "MD",  value: "md"  },
      { label: "MB",  value: "mb"  },
      { label: "MWW", value: "mww" },
    ],
  },
};

export const CATEGORIES = [
  { key: "magnitude",    y: 270 },
  { key: "significance", y: 326 },
  { key: "tsunami",      y: 382 },
  { key: "status",       y: 438 },
  { key: "alert",        y: 494 },
  { key: "type",         y: 550 },
];
