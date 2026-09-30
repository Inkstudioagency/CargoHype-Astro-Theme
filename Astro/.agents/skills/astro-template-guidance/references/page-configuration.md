# Page Configuration

Site-wide settings live in `src/config/`. They are JSON files, so you can edit them without
touching components.

## `config.json`

```jsonc
{
  "site": {
    "title": "CargoHype - Freight Forwarding Astro Theme", // suffix of every page title
    "base_url": "https://cargohype.example.com",          // canonical URLs, sitemap, OG images
    "lang": "en",
    "logo": "/images/Frame-265.webp",        // light navbar (over the hero)
    "logo_dark": "/images/Link_2Link.webp",  // dark navbar (after scrolling)
    "logo_footer": "/images/Link_1Link.webp",
    "logo_alt": "…", "logo_dark_alt": "…", "logo_footer_alt": "…"
  },
  "metadata": {
    "meta_author": "CargoHype",
    "meta_image": "/images/og-image.webp",   // default social share image (1200×630)
    "meta_description": "…"                   // default description
  },
  "webflow": {
    "site_id": "…",                           // needed by the Webflow runtime
    "pages": { "home": "…", "about": "…", … } // interaction ids per layout (see adding-new-pages.md)
  },
  "cms": {
    "provider": "strapi",
    "fallback_to_local": true                  // use seed JSON if Strapi is unreachable
  },
  "forms": { "endpoint": "" },                 // see "Forms" below
  "contact": { "email": "…", "phone": "…" },  // footer contact links
  "footer": { "blurb": "…", "newsletter_label": "…", "newsletter_note": "…", "copyright": "…", "powered_by": "…" }
}
```

Set `site.base_url` to your production domain before deploying. `astro.config.mjs` reads it.

## `menu.json`

```jsonc
{
  "main": [{ "name": "Services", "url": "/services" }, …], // both navbars
  "cta":  { "name": "Get a Quote", "url": "/contact" },    // navbar button
  "footer": {
    "company": { "label": "Company", "links": [ … ] },
    "services": { "label": "Services" },                   // filled from the services collection
    "utility": { "label": "Utility pages", "links": [ … ] }
  }
}
```

## `social.json`

`{ "main": [{ "name": "LinkedIn", "url": "…" }, …] }`. These are shown as footer social links.

## `src/data/faq.json`

`{ "items": [{ "question": "…", "answer": "…" }] }`. Items are numbered Q—01, Q—02 … automatically.

## SEO per page

Static pages pass `title` and `description` to `BaseLayout`. CMS detail pages use each
entry's `seo.metaTitle` and `seo.metaDescription`, falling back to its title and summary,
and use the entry image as the social image.

## Forms

All forms (hero tracking, contact, service request, newsletter) use Webflow form markup.
`public/js/forms.js` intercepts them:

- `forms.endpoint` empty: demo mode. The success message shows and nothing is sent.
- `forms.endpoint` set, for example `"https://formspree.io/f/xxxx"`: the form is POSTed as
  `FormData` with `Accept: application/json`. A 2xx response shows `.w-form-done`, anything
  else shows `.w-form-fail`.

Formspree, Getform, Basin, or your own endpoint all work. The field names are the `name`
attributes in the page markup.
