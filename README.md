# UFO Atlas

> This repository also contains a standalone [Solana trading bot](trading-bot/README.md) in `trading-bot/`.

Explore the world's most significant UFO and UAP incidents on an interactive 3D map.

## Features

- Interactive world map powered by MapLibre GL JS
- 31 historically significant UFO/UAP incidents with detailed metadata and source links
- Marker clustering for dense areas
- Search by name, location, country, or year
- Filter by date range, evidence type, country, credibility, and status
- Detailed incident panel with evidence indicators and credibility scores
- Incident directory with table and card views
- CSV and GeoJSON export
- Timeline control with decade playback
- Multiple map styles (Streets, Dark Matter, Terrain, Dark)
- Deep-link support for individual incidents
- Location accuracy indicators (exact, approximate, regional, aerial-route, maritime)
- Responsive layout for desktop and mobile
- WCAG-friendly contrast, keyboard navigation, ARIA labels
- Reduced-motion support

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS v4
- MapLibre GL JS
- Lucide React icons
- CARTO basemap tiles (no API key required)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    page.tsx              # Main map page
    layout.tsx            # Root layout
    globals.css           # Global styles
    directory/page.tsx    # Incident directory
    incident/[id]/page.tsx # Incident deep-link
  components/
    map/MapView.tsx       # MapLibre GL map
    map/Legend.tsx         # Map legend
    incidents/IncidentDetail.tsx # Detail panel
    filters/FilterPanel.tsx     # Filter sidebar
    layout/Header.tsx     # Floating header
    layout/SearchBar.tsx  # Search with suggestions
    timeline/TimelineControl.tsx # Timeline bar
    ui/Badge.tsx          # Badge component
    ui/CredibilityMeter.tsx # Score meter
  data/incidents.ts       # Seed incident data
  types/incident.ts       # TypeScript types
  lib/
    utils.ts              # Filtering, search, export
    hooks.ts              # Custom React hooks
    map-styles.ts         # Map style configuration
```

## Data Disclaimer

Locations are based on publicly reported information. Some coordinates identify an approximate encounter area, witness location, military base, airport, town centre, or regional midpoint rather than a verified exact position. No entry should be interpreted as confirmation of extraterrestrial activity.

## Environment Variables

No API keys are required. See `.env.example` for optional configuration.

## Testing

```bash
npm test
```

Unit tests (Vitest) cover filtering, search, CSV/GeoJSON export, marker styling, and data integrity (unique IDs, valid coordinates, https-only sources).

## Deployment

The app is configured for static export (`output: "export"` in `next.config.ts`). Pushing to `main` triggers the GitHub Pages workflow (`.github/workflows/deploy.yml`), which runs the tests, builds with `NEXT_PUBLIC_BASE_PATH=/Jarvis`, and publishes the `out/` directory to GitHub Pages at `https://<owner>.github.io/Jarvis/`.

To deploy elsewhere (e.g. Vercel or any static host), build without the base path:

```bash
npm run build   # output in out/
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build (static export to `out/`)
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint
