# Script Usage

Run the scripts with npm (pnpm or yarn work the same way: `pnpm dev`, `pnpm build` …).
Requires Node.js ≥ 22.12.

## Astro theme (`Astro/`)

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:4321 (CMS data is loaded at startup; restart to refetch) |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run check` | Astro/TypeScript diagnostics |
| `npm run cms:import -- <dir>` | Convert Webflow CMS CSV exports into `src/content/data/*.json` and download their images to `public/images/cms/` (default dir `../CMS`) |

Environment variables (`.env`, see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `STRAPI_URL` | Strapi base URL, e.g. `http://localhost:1337`. Empty → local seed data |
| `STRAPI_TOKEN` | Optional read-only API token |

## Strapi backend (`../Strapi/`)

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run develop` | Strapi with admin + Content-Type Builder at http://localhost:1337/admin |
| `npm run start` | Production mode (no Content-Type Builder) |
| `npm run build` | Build the admin panel |
| `npm run seed` | Import the theme's seed content and images (skips entries that already exist) |

Typical first run:

```bash
cd Strapi && npm install && npm run seed && npm run develop   # create the admin user
cd ../Astro && cp .env.example .env && npm install && npm run dev
```
