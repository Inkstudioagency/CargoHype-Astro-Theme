# Component Usage

All components are plain `.astro` files with no client-side framework. Interactivity comes
from the Webflow runtime and `public/js/*`.

## Layouts

### `BaseLayout.astro`
Wraps every page: `<html data-wf-page …>`, SEO tags, styles, Webflow/GSAP/Lenis scripts.

| Prop | Type | Notes |
| --- | --- | --- |
| `pageId` | string, required | Webflow page id from `config.webflow.pages` |
| `title` | string | Rendered as `"{title} - {site.title}"` |
| `fullTitle` | string | Used verbatim (CMS meta titles) |
| `description` | string | Falls back to `metadata.meta_description` |
| `image` | string | OG/Twitter image. Falls back to `metadata.meta_image` |
| `noindex` | boolean | Adds `robots: noindex` |

### `UtilityLayout.astro`
Text page with the Style Guide hero. Props: `title`, `summary`, `description?`. Slot: `UtilityBlock`s.

## Site components

| Component | Props | Purpose |
| --- | --- | --- |
| `Header` | none | Utility bar + light and dark navbars. Links from `menu.json`, active link marked automatically |
| `Footer` | `backTo`, `pageId` | Contact, newsletter form, socials, link columns, services list from the CMS |
| `Cta` | none | "Ready to move?" band above the footer |
| `Faq` | none | Image + accordion. Questions in `src/data/faq.json` |
| `SeoMeta` | same as the BaseLayout SEO props | Used by `BaseLayout`. Title, canonical, OG, Twitter |
| `UtilityBlock` | `title`, `icon?`, `entries`, `last?` | One row on a utility page |

## UI

### `ui/ArrowButton.astro`
Pill button with a sliding label and an arrow ("Get a Quote", "View Details").

```astro
<ArrowButton href="/contact" label="Get a Quote" />                 <!-- light -->
<ArrowButton href="/contact" label="Get a Quote" variant="brand" /> <!-- orange -->
<ArrowButton href={url} label="View Details" variant="black" />
```
It adds `w--current` and `aria-current` automatically when `href` is the current page.

### `ui/Button.astro`
Dot button ("Book Shipment", "Back Home"). `variant`: `base` (default) or `brand`.

```astro
<Button href="/contact" label="Book Shipment" />
```

## Webflow widgets used in page markup

These are HTML patterns driven by `webflow.js`, not Astro components. Copy them from an
existing page:

- **Slider**: `.w-slider > .w-slider-mask > .w-slide`, with arrows `.w-slider-arrow-left/right`.
- **Tabs**: `.w-tabs > .w-tab-menu > a.w-tab-link[data-w-tab]` + `.w-tab-content > .w-tab-pane[data-w-tab]`.
- **Background video**: `.w-background-video` with `data-video-urls` and `data-poster-url`.
  Files live in `public/videos`.
- **Forms**: `.w-form > form` + `.w-form-done` + `.w-form-fail`. Handled by
  `public/js/forms.js` (see `page-configuration.md → forms`).
- **Counters**: add `data-counter` to any element whose text starts with a number. It counts
  up when scrolled into view.
