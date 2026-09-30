## Theme guide

Before changing pages, components, content, configuration, styles or scripts, read the
`astro-template-guidance` skill in `.agents/skills/astro-template-guidance/SKILL.md` and the
reference file it routes you to.

Key rules:
- Keep Webflow attributes (`data-wf-*`, `to-top-*`, `title-animation`, `w-*` classes). They drive the animations and widgets.
- Every page passes a Webflow `pageId` (from `config.webflow.pages`) to `BaseLayout`.
- CMS data is read through `src/lib/content.ts`. It comes from Strapi when `STRAPI_URL` is set, otherwise from `src/content/data/*.json`.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
