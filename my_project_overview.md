# My EarthPulse Visualization Dashboard

I built EarthPulse, a React-based Earthquake global visualization dashboard that fetches and beautifully maps out daily earthquakes across the globe.

---

## 1. My Tech Stack & Setup
- **Core Framework:** I chose React 18 and built it with [Vite](https://vitejs.dev/) for a lightning-fast development experience.
- **Map Render Engine:** I used [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/) to power the interactive globe and handle all the mapping features.
- **Styling:** I used TailwindCSS v3 extended with my own custom colors (`primary: #000000`, `secondary: #2a2929`). I also incorporated custom fonts natively (`Syne`, `Quicksand`, `Jetbrains Mono`).
- **UI Components:** I adopted the shadcn/ui component pattern by using [Radix UI](https://www.radix-ui.com/) primitives together with `vaul` (for my Drawer elements).
- **Global State Management:** I went with native React Context (`src/context/Filter.jsx`) to keep things simple and avoid prop drilling.
- **Icons:** I used `lucide-react` for slick, scalable vector icons throughout my interface.

### How I Configured the Project
- **`vite.config.js`:** I explicitly set an `@/` alias mapped directly to my `src/` directory to make importing cleaner.
- **`tailwind.config.js`:** I registered the `class` dark mode, added the `tailwindcss-animate` plugin, and handled all my theme overrides here.

## 2. Global State & API Source
### Real-time USGS Data Fetching
In my `src/App.jsx`, immediately upon loading, I use a `useEffect` hook to request data from the highly reliable **USGS Earthquakes API**:
`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`
- It grabs all earthquakes globally mapped from the past 24 hours.
- It translates that JSON list straight into my Context provider using my `setEarthquakes()` method.

### My Content Filter State (`src/context/Filter.jsx`)
This context module is the heart of EarthPulse. Rather than passing props deeply, the state wraps my app and holds:
- **Raw List**: `earthquakes` (my complete unfiltered feature array).
- **Filters**: Magnitude bounds, Type, Significance, Tsunami Threat, Verification Status, and Alert Level.
- **Filtration Engine**: I created a `getFilteredData()` function that takes the master list of features and runs a composite filter across all my conditions. It calculates exactly what to pass toward the `Map` component dynamically. The results don't override my master list but are instead dynamically served up when referenced.

## 3. My Map Component Deep Dive (`src/components/Map.jsx`)
Mapbox GL allows me to create rich data structures directly on top of my maps using WebGL.

- **Initialization:** I initialize an empty `<div />` as a Mapbox container with the `"mapbox://styles/mapbox/dark-v11"` template and start the center around western India.
- **Data Layers:** Once loaded, my code defines a GeoJSON data source (`earthquakes`) representing the map point geometry for every reported earthquake.
- **Clustering:** 
  - To prevent my browser from lagging when rendering 10k markers, I turned on standard Mapbox GL clustering up until `zoom: 14` with a radius of `50`. 
  - Overlapping items group into single larger circles. Supercluster powers my backend grouping sizes (`#baebff` -> `#bebcfc` -> `#d689ff` -> `#a564d3` progressively as cluster volume increases up to 750 entities).
- **Unclustered Points:** 
  - Standard earthquake dots alter both in physical `radius` size and color scale based purely on `magnitude` power. 
  - I set the colors to: Magnitude **< 3** (`#eed7a1`), **<= 5** (`#84cdee`), **<= 7** (`#ffbcda`), **> 7** (`#eb2d3a`).
- **Interactions:**
  - Standard `onclick` events on the map dots moves the camera smoothly to the exact coordinate location via `.easeTo()`.
  - I have it sequentially generate a standard Mapbox GL Popup component that injects raw HTML displaying the spot name, magnitude and a **"Read More..."** tag.
  - Adding a manual listener to that "Read More" element triggers my React `EQModal` layer by flipping the `isModalOpen` boolean.

## 4. How I Laid Out My Components
- **`<App />`**: This is my central traffic controller. It decides whether to render my `<Loader />`, the actual `<Map />`, or an `<Error />` boundary state if the USGS fetching fails.
- **`<Header />`**: This is my fixed overlay on the top border. It reflects the active context `filterCount`. I also added an informational popout (`<AlertDialog />`) functioning as a Mapbox style legend reference (explaining my marker colors).
- **`<FilterDrawer />`**: A fixed slider overlay appearing from the right border. It houses multi-tier `<Select />` dropdown elements adjusting my Context variables. It automatically fires Map re-renders upon application since the `useFilterContext()` properties update instantly.
- **`<EQModal />`**: My Radix `<AlertDialog />`. It takes a single `quake` prop and restructures its flattened JSON properties into categorized logical buckets (Identifiers, Location Specs, Timestamps, Seismic Details). Then recursively parses those via my local `<InfoPopover />` component that acts as a localized tooltip for advanced seismology data specs (RMS, gap angles).
