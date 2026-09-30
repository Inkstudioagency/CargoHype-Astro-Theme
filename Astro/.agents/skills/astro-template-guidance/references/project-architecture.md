# Project Architecture

CargoHype is a static Astro site. Its markup and CSS come from a Webflow design, and its
animations run on the Webflow runtime (`public/js/webflow.js`) plus GSAP. The three CMS
collections (Services, Newsroom, Careers) load from **Strapi 5** at build time and fall back
to local JSON seed data when Strapi isn't configured.

## Directory map

```
Astro/
├── .agents/skills/astro-template-guidance/   ← this handbook
├── public/
│   ├── images/            static images (cms/ holds images for the seed content)
│   ├── videos/            background videos + poster frames
│   ├── fonts/             Overused Grotesk variable font
│   └── js/
│       ├── webflow.js     Webflow runtime: interactions (IX3), sliders, tabs, navbar
│       ├── main.js        Lenis smooth scroll + [data-counter] number animations
│       ├── forms.js       form submission → config.forms.endpoint
│       └── vendor/        jQuery, GSAP, ScrollTrigger, SplitText, Lenis, WebFont
├── scripts/import-csv.mjs Webflow CSV export → src/content/data/*.json
└── src/
    ├── config/            config.json · menu.json · social.json
    ├── content/data/      local seed content (services, newsroom, careers)
    ├── content.config.ts  content collections + Strapi/local loader
    ├── data/faq.json      FAQ questions
    ├── layouts/           BaseLayout (every page) · UtilityLayout (simple text pages)
    ├── components/        Header · Footer · Cta · Faq · SeoMeta · UtilityBlock · ui/*
    ├── lib/               content.ts (query helpers) · strapi.ts (REST client)
    ├── pages/             routes (see below)
    └── styles/            normalize · webflow · theme (design tokens) · interactions · lenis
```

The Strapi backend lives next to the theme in `../Strapi` (see `script-usage.md`).

## Routes

| Route | File | Data |
| --- | --- | --- |
| `/` | `pages/index.astro` | services, newsroom |
| `/about-us`, `/pricing`, `/contact`, `/style-guide` | `pages/*.astro` | static |
| `/services` · `/services/[slug]` | `pages/services/` | services |
| `/newsroom` · `/newsroom/[slug]` | `pages/newsroom/` | newsroom |
| `/careers` · `/careers/[slug]` | `pages/careers/` | careers |
| 404 | `pages/404.astro` | static |

## Data flow

```
Strapi (REST /api/services|articles|careers)      src/content/data/*.json
            │  STRAPI_URL set                              │  no STRAPI_URL / Strapi down
            └──────────► src/lib/strapi.ts ◄───────────────┘   (cms.fallback_to_local)
                               │ normalised to one shape
                               ▼
               src/content.config.ts  (zod schemas)
                               ▼
         src/lib/content.ts  getServices() · getArticles() · getCareers()
                               ▼
                   pages + Footer (services column)
```

Rich-text fields are Markdown in Strapi and HTML in the seed files. Both are rendered to
HTML with `marked` and output with `set:html` into Webflow `.w-richtext` blocks.

## Webflow runtime contract

The Webflow runtime reads certain attributes. Keep them when you edit markup:

- `<html data-wf-page data-wf-site>`: set by `BaseLayout` from `pageId` and `config.webflow`.
  Interactions are bound per page id.
- `data-wf-component-id`, `data-wf-variant-state`, `data-w-id`, `id="w-node-…"`: element
  identity for interactions and grid placement.
- `to-top-0`, `to-top-2s`, `title-animation` …: custom attributes that trigger the
  scroll-reveal animations.
- `w-slider`, `w-tabs`, `w-nav`, `w-form`, `w-background-video`: Webflow widgets.
- `.w-dyn-list > .w-dyn-items > .w-dyn-item`: collection-list wrappers. The CSS still targets
  them, so CMS loops keep this markup.
