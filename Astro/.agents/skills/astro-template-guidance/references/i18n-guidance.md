# i18n Guidance

CargoHype ships as a **single-language (English)** site. `config.site.lang` sets
`<html lang>`. No translation files or localized routes are included.

To add languages, use Astro's built-in i18n routing and Strapi's Internationalization
feature:

## 1. Astro routing

```js
// astro.config.mjs
export default defineConfig({
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false }, // /about-us, /de/about-us
  },
});
```

Move or duplicate pages into `src/pages/de/…`. Generate links with `getRelativeLocaleUrl`
from `astro:i18n`.

## 2. UI strings

Move static copy from `menu.json`, `config.json` (footer) and `faq.json` into per-locale
files, e.g. `src/i18n/en.json` and `src/i18n/de.json`. Load the right one with
`Astro.currentLocale`. Pass the locale into `Header`/`Footer` so they read the matching menu.

## 3. CMS content

1. In Strapi, open **Settings → Internationalization**, add the locale, then enable
   *Internationalization* on the Service, Newsroom Article and Career content types.
2. In `src/lib/strapi.ts`, add `&locale=<code>` to the request URL and create one Astro
   collection per locale (or add a `locale` field and filter in `src/lib/content.ts`).
3. In `getStaticPaths`, return paths per locale.

## 4. SEO

Set `<html lang={Astro.currentLocale}>` in `BaseLayout` and add
`<link rel="alternate" hreflang="…">` tags in `SeoMeta.astro`.
