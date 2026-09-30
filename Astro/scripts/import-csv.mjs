#!/usr/bin/env node
/**
 * Convert Webflow CMS CSV exports into the local seed files used when Strapi is not
 * configured (src/content/data/*.json). Remote images are downloaded to
 * public/images/cms/ so the site has no runtime dependency on the Webflow CDN.
 *
 *   npm run cms:import -- <folder-with-csv-files>     (default: ../CMS)
 *
 * The CSV files are matched by name: "*Services*.csv", "*Newsroom*.csv", "*Careers*.csv".
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const csvDir = path.resolve(process.argv[2] ?? path.join(root, '..', 'CMS'));
const imageDir = path.join(root, 'public/images/cms');
const dataDir = path.join(root, 'src/content/data');

function parseCSV(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows;
  return body.filter((r) => r.length > 1).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

function load(name) {
  const file = fs.readdirSync(csvDir).find((f) => f.includes(name) && f.endsWith('.csv'));
  if (!file) throw new Error(`No "${name}" CSV found in ${csvDir}`);
  return parseCSV(fs.readFileSync(path.join(csvDir, file), 'utf8')).filter((r) => r.Draft !== 'true' && r.Archived !== 'true');
}

const downloads = new Map(); // local file → remote url
const localByUrl = new Map(); // remote url → public path (one file per image)
const image = (url, name) => {
  if (!url) return '';
  if (localByUrl.has(url)) return localByUrl.get(url);
  const ext = (/\.(webp|png|jpe?g|svg|avif|gif)(?:$|\?)/i.exec(url)?.[1] ?? 'webp').toLowerCase();
  const file = `${name}.${ext}`;
  downloads.set(path.join(imageDir, file), url);
  localByUrl.set(url, `/images/cms/${file}`);
  return `/images/cms/${file}`;
};
// Images embedded inside rich text
const localiseRichText = (html, prefix) => {
  let n = 0;
  return (html ?? '').replace(/https:\/\/cdn\.prod\.website-files\.com\/[^"'\s]+/g, (url) => image(url, `${prefix}-inline-${++n}`));
};
const text = (s) => (s ?? '').trim();
const date = (s) => (s ? new Date(s).toISOString() : '');
const list = (r, pattern, count) => Array.from({ length: count }, (_, i) => text(r[pattern.replace('N', String(i + 1).padStart(2, '0'))])).filter(Boolean);

const services = load('Services')
  .map((r) => ({
    title: r.Name,
    slug: r.Slug,
    serialNumber: text(r['Serial Number']),
    summary: text(r['Service Summary']),
    transit: text(r.Transit),
    cutOff: text(r['Cut Off']),
    coverage: text(r.Coverage),
    overview: localiseRichText(r['Service Overview'], `service-${r.Slug}`),
    includedServices: list(r, 'Include Service N', 5),
    mainImage: image(r['Service Main Image'], `service-${r.Slug}-main`),
    image: image(r['Service Image'], `service-${r.Slug}`),
    logoWhite: image(r['Service Logo White'], `service-${r.Slug}-logo-white`),
    logoBlack: image(r['Service Logo Black'], `service-${r.Slug}-logo-black`),
    approach: localiseRichText(r.Approach, `service-${r.Slug}-approach`),
    approachCards: [1, 2, 3].map((i) => ({ title: text(r[`Card Title 0${i}`]), summary: text(r[`Card Summary 0${i}`]) })),
    work: localiseRichText(r['Service Work'], `service-${r.Slug}-work`),
    steps: [1, 2, 3, 4].map((i) => ({ title: text(r[`Step Title 0${i}`]), summary: text(r[`Step Summary 0${i}`]) })),
    price: text(r.Price),
    priceUnit: text(r['Price Unit']),
    availability: text(r.Availability),
    availabilityDate: text(r['Availability Date']),
    seo: { metaTitle: text(r['Meta Title']), metaDescription: text(r['Meta Description']) },
  }))
  .sort((a, b) => a.serialNumber.localeCompare(b.serialNumber, undefined, { numeric: true }));

const newsroom = load('Newsroom')
  .map((r) => {
    const key = `news-${r.Slug.slice(0, 60)}`;
    return {
      title: r.Name,
      slug: r.Slug,
      summary: text(r.Summary),
      publishedDate: date(r['Published Date']),
      featured: r.Featured === 'true',
      category: text(r.Category),
      authorName: text(r['Author Name']),
      mainImage: image(r['Main Image'], key),
      overview: localiseRichText(r['Newsroom Overview'], key),
      details: localiseRichText(r.Details, `${key}-details`),
      conclusion: localiseRichText(r.Conclusion, `${key}-conclusion`),
      tags: list(r, 'Tag N', 9),
      transit: text(r.Transit),
      cutOff: text(r['Cut Off']),
      coverage: text(r.Coverage),
      cardTitle: text(r['Card Title']),
      cardSummary: text(r['Card Summary']),
      includedServices: list(r, 'Incluted Service N', 5),
      seo: { metaTitle: text(r['Meta Title']), metaDescription: text(r['Meta Description']) },
    };
  })
  .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));

const careers = load('Careers').map((r) => ({
  title: r.Name,
  slug: r.Slug,
  postLabel: text(r['Post Label']),
  location: text(r.Location),
  jobType: text(r['Job Type']),
  summary: text(r.Summary),
  buttonText: text(r['Button Text']) || 'Apply now',
  date: date(r.Date),
  overview: localiseRichText(r['Career Overview'], `career-${r.Slug}`),
  seo: {
    metaTitle: text(r['Meta Title']),
    metaDescription: text(r['Meta Description']),
    ogImage: image(r['Opengraph Image'], `career-${r.Slug}-og`),
  },
}));

fs.mkdirSync(imageDir, { recursive: true });
let fetched = 0;
await Promise.all(
  [...downloads].map(async ([file, url]) => {
    if (fs.existsSync(file)) return;
    const res = await fetch(url);
    if (!res.ok) return console.warn(`! ${res.status} ${url}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    fetched++;
  })
);

for (const [name, data] of Object.entries({ services, newsroom, careers })) {
  fs.writeFileSync(path.join(dataDir, `${name}.json`), JSON.stringify(data, null, 2) + '\n');
}
console.log(`Imported ${services.length} services, ${newsroom.length} articles, ${careers.length} careers (${fetched} new images).`);
