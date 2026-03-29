# 🌍 EarthPulse

[![API Status](https://img.shields.io/badge/Status-Online-brightgreen)](https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson)
[![Framework: Vite](https://img.shields.io/badge/Framework-Vite-646CFF?logo=vite)](https://vitejs.dev/)

**EarthPulse** is a high-performance, aesthetically-driven earthquake visualization platform. It transforms raw seismic data from the USGS into a compelling, interactive experience, allowing users to monitor global tectonic activity in real-time.

---

## ✨ Key Features

- 🛰️ **Real-time Data:** Fetches live earthquake data directly from the USGS (U.S. Geological Survey) every time you load.
- 🗺️ **Interactive Global Map:** Powered by **Mapbox GL**, featuring custom dark-themed styling and high-performance rendering.
- 🧬 **Dynamic Clustering:** Uses **Supercluster** to efficiently handle thousands of data points, with custom pulsating dot animations.
- 🎛️ **Advanced Filtering:**
  - **Time Range:** Filter by the last hour, upto 24 hours.
  - **Magnitude:** Focus on significant events or see everything.
  - **Depth:** Analyze the vertical profile of seismic activity.
  - **Event Type:** Distinguish between earthquakes, explosions, and other seismic events.
- 💎 **Premium Aesthetic:** Designed with a modern **Glassmorphism** UI, featuring glowing elements, smooth transitions, and a sophisticated color palette.
- 📱 **Fully Responsive:** Seamlessly transitions to mobile-optimized filter layouts for on-the-go monitoring.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite |
| **Styling** | Tailwind CSS, Lucide Icons |
| **Mapping** | Mapbox GL JS |
| **Data Visualization** | Supercluster, Radix UI |
| **Animations** | Framer Motion (or CSS Transitions/Springs) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (used in this project) or npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/EarthPulse.git
   cd EarthPulse
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Mapbox configuration:
   ```env
   VITE_MAPBOX_KEY=your_mapbox_public_key
   VITE_MAPBOX_STYLE=your_mapbox_style_url
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

5. **Build for production:**
   ```bash
   pnpm build
   ```

---

## 🎨 Design Language

EarthPulse isn't just a tool; it's a visual experience. The interface utilizes:
- **Curved Glass Panels:** Semi-transparent, blurred backgrounds that feel light and modern.
- **Amber Accents:** A primary highlight color `#f59e0b` used for high-magnitude alerts and active filters.
- **Micro-Animations:** Pulsating markers and smooth "spring" based UI transitions for a living, breathing feel.

---
