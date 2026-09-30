# CargoHype: Freight Forwarding Astro Theme

CargoHype is an Astro theme for logistics companies, freight forwarders and shipping
businesses. Services, Newsroom and Careers content can come from an optional **Strapi 5** CMS.
Without Strapi, the theme builds from the bundled seed content.

## Repository layout

| Folder | What it is |
| --- | --- |
| [`Astro/`](Astro) | The Astro theme. This is the site you deploy. |
| [`Strapi/`](Strapi) | Optional Strapi 5 CMS for the Services, Newsroom and Careers collections |

## Quick start

```bash
cd Astro
npm install
npm run dev          # http://localhost:4321
```

To connect Strapi, see the [Astro README](Astro/README.md#quick-start).

## Deploy

The site is fully static. On Vercel, Netlify or Cloudflare Pages, set the project's
**root directory** to `Astro`. The build command is `npm run build` and the output folder is `dist`.

Full documentation (features, commands, customization) is in [`Astro/README.md`](Astro/README.md).

## License

MIT. See [LICENSE](LICENSE).
