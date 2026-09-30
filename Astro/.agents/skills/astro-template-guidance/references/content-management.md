# Content Management

The site has three collections. Each one is read from **Strapi 5** when `STRAPI_URL` is set,
and otherwise from local JSON seed files.

| Collection | Strapi API | Seed file | Pages |
| --- | --- | --- | --- |
| `services` | `/api/services` | `src/content/data/services.json` | `/services`, `/services/[slug]`, home slider, footer |
| `newsroom` | `/api/articles` | `src/content/data/newsroom.json` | `/newsroom`, `/newsroom/[slug]`, home "Newsroom" |
| `careers` | `/api/careers` | `src/content/data/careers.json` | `/careers`, `/careers/[slug]` |

Field definitions are the zod schemas in `src/content.config.ts`. The Strapi content types
in `../Strapi/src/api/*` use the same field names.

## Editing content in Strapi (recommended)

1. Start Strapi: `cd ../Strapi && npm run develop` → http://localhost:1337/admin
2. Edit or create entries under **Content Manager**, then **Publish**. Drafts are not built.
3. In `Astro/.env` set `STRAPI_URL=http://localhost:1337`. `STRAPI_TOKEN` is optional because
   the Public role can read.
4. Rebuild with `npm run build`, or restart `npm run dev`. The content is fetched at build time.

In production, add a Strapi **webhook** (Settings → Webhooks, on entry publish/unpublish)
that calls your host's deploy hook (Netlify, Vercel, Cloudflare Pages) so the site rebuilds
when content changes.

If Strapi can't be reached during a build, the build logs a warning and uses the seed files.
Set `cms.fallback_to_local: false` in `src/config/config.json` to make the build fail instead.

### Managing content with AI (Strapi MCP server)
The Strapi project has the MCP server enabled at `http://localhost:1337/mcp`. Create an
admin token in the Strapi admin, then connect your assistant:

```bash
claude mcp add strapi-mcp --transport http http://localhost:1337/mcp \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```
The assistant can then list, create, update, publish and unpublish services, articles and
careers. The MCP server can't upload new media, so upload images in the admin Media Library
first.

## Editing content without Strapi

Edit the JSON files in `src/content/data/` directly. Rich-text fields (`overview`,
`approach`, `work`, `details`, `conclusion`) accept HTML or Markdown. Images are paths under
`public/`, for example `/images/cms/my-image.webp`.

To re-import a Webflow CMS CSV export:
```bash
npm run cms:import -- ../CMS
```

## Field reference

**Service**: `title`, `slug`, `serialNumber` ("01" controls the order), `summary`,
`transit`, `cutOff`, `coverage` (stats, animated), `overview`/`approach`/`work` (rich text),
`includedServices[5]`, `approachCards[3] {title, summary}`, `steps[4] {title, summary}`,
`mainImage`, `image`, `logoWhite`, `logoBlack`, `price`, `priceUnit`, `availability`,
`availabilityDate`, `seo {metaTitle, metaDescription}`.

**Newsroom article**: `title`, `slug`, `summary`, `publishedDate` (sort order, newest first),
`featured` (the newest featured article leads the newsroom page), `category`, `authorName`,
`mainImage`, `overview`/`details`/`conclusion` (rich text), `tags[]`, `transit`, `cutOff`,
`coverage`, `cardTitle`, `cardSummary`, `includedServices[5]`, `seo`.

**Career**: `title`, `slug`, `postLabel`, `location`, `jobType`, `summary`, `buttonText`,
`date`, `overview` (rich text), `seo {…, ogImage}`.

## Adding a field

1. Add it to the Strapi content type (Content-Type Builder or `schema.json`).
2. Map it in `src/lib/strapi.ts` → `normalisers.<collection>`.
3. Add it to the zod schema in `src/content.config.ts` and to the seed JSON.
4. Use it in the page: `service.myField`.

## Adding a collection

1. Create the content type in Strapi and give the Public role `find`/`findOne` (see
   `../Strapi/src/index.ts` bootstrap).
2. Add it to `CollectionName`, `endpoints` and `normalisers` in `src/lib/strapi.ts`.
3. Add a seed file and a `defineCollection` in `src/content.config.ts`.
4. Add a getter in `src/lib/content.ts` and create the pages.
