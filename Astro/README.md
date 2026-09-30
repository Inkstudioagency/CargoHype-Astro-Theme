# CargoHype: Freight Forwarding Astro Theme

CargoHype is an Astro theme for logistics companies, freight forwarders and shipping
businesses. Services, Newsroom and Careers content comes from **Strapi 5**. Without Strapi,
the theme builds from the bundled seed content.

## Features

- 14 page templates: Home, About, Services (+ detail), Pricing, Careers (+ detail),
  Newsroom (+ article), Contact, Style Guide, 404
- Strapi 5 CMS for three collections: **Services**, **Newsroom**, **Careers**
- Strapi MCP server support: manage content from Claude, Cursor or other MCP clients
- Local fallback: builds without a CMS from `src/content/data/*.json`
- Scroll animations (Webflow IX3 + GSAP), Lenis smooth scrolling, animated counters
- Background videos, sliders, tabs and a responsive navbar
- SEO: per-page titles and descriptions, canonical URLs, Open Graph and Twitter cards. CMS
  entries carry their own meta fields
- Forms (tracking, contact, service request, newsletter) that post to any form endpoint
- All settings in JSON: `config.json`, `menu.json`, `social.json`, `faq.json`
- An AI-assistant handbook in `.agents/skills/astro-template-guidance`

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321
```

This uses the bundled seed content. To connect Strapi:

```bash
# 1. Start the CMS (the Strapi folder is next to this one)
cd ../Strapi && npm install && npm run seed && npm run develop
#    → http://localhost:1337/admin (create your admin user on first run)

# 2. Point the theme at it
cd ../Astro && cp .env.example .env    # STRAPI_URL=http://localhost:1337
npm run dev
```

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Build the static site to `dist/` |
| `npm run preview` | Preview the build |
| `npm run check` | Type-check the project |
| `npm run cms:import -- <dir>` | Import Webflow CMS CSV exports into the seed JSON |

## Project structure

```
src/
├── config/          config.json · menu.json · social.json
├── content/data/    seed content (used when Strapi isn't configured)
├── content.config.ts
├── data/faq.json
├── layouts/         BaseLayout · UtilityLayout
├── components/      Header · Footer · Cta · Faq · SeoMeta · UtilityBlock · ui/
├── lib/             content.ts (queries) · strapi.ts (Strapi client)
├── pages/
└── styles/          theme.css holds the design tokens
public/              images · videos · fonts · js (Webflow runtime, GSAP, Lenis, forms)
```

## Customization

- **Brand, logo, contact details, SEO defaults:** `src/config/config.json`
- **Navigation and footer links:** `src/config/menu.json`
- **Colours and fonts:** the CSS custom properties at the top of `src/styles/theme.css`
- **Form submissions:** set `forms.endpoint` in `config.json` (Formspree, Getform, Basin or
  your own API). If it's empty, forms show their success message and send nothing (demo mode).
- **Content:** Strapi admin → Content Manager, or edit `src/content/data/*.json`

The handbook in `.agents/skills/astro-template-guidance/references/` covers these topics
in detail.

## Deployment

The output is fully static (`dist/`), so it runs on Netlify, Vercel, Cloudflare Pages,
GitHub Pages or any static host.

1. Set `site.base_url` in `src/config/config.json` to your domain.
2. Set `STRAPI_URL` (and `STRAPI_TOKEN` if the Public role can't read) in the host's
   environment variables.
3. In Strapi, add a webhook on entry publish/unpublish that calls your host's deploy hook,
   so the site rebuilds when content changes.

## Credits

Design and content by CargoHype. Fonts: Overused Grotesk and IBM Plex Mono (both SIL OFL).
Libraries: Astro, GSAP, Lenis, jQuery, the Webflow runtime and Strapi.

## License

MIT
