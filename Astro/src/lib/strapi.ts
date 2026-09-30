/**
 * Strapi v5 REST client used by the content collections in `src/content.config.ts`.
 *
 * Every collection is normalised into the same shape as the local seed files in
 * `src/content/data/*.json`, so pages never need to know where the content came from.
 */
import { marked } from 'marked';

export type CollectionName = 'services' | 'newsroom' | 'careers';

const env = (key: string): string | undefined =>
  (import.meta.env?.[key] as string | undefined) ?? process.env[key];

export const STRAPI_URL = (env('STRAPI_URL') ?? '').replace(/\/$/, '');
const STRAPI_TOKEN = env('STRAPI_TOKEN') ?? '';

export const isStrapiEnabled = () => STRAPI_URL.length > 0;

/** Strapi API id (plural) and populate query for each collection. */
const endpoints: Record<CollectionName, { path: string; query: string }> = {
  services: {
    path: 'services',
    query:
      'populate[mainImage]=true&populate[image]=true&populate[logoWhite]=true&populate[logoBlack]=true' +
      '&populate[includedServices]=true&populate[approachCards]=true&populate[steps]=true&populate[seo]=true' +
      '&sort=serialNumber:asc',
  },
  newsroom: {
    path: 'articles',
    query:
      'populate[mainImage]=true&populate[tags]=true&populate[includedServices]=true&populate[seo]=true' +
      '&sort=publishedDate:desc',
  },
  careers: {
    path: 'careers',
    query: 'populate[seo][populate][ogImage]=true&sort=date:desc',
  },
};

type StrapiMedia = { url?: string } | null | undefined;
type StrapiEntry = Record<string, any>;

const mediaUrl = (media: StrapiMedia): string => {
  const url = media?.url ?? '';
  return url.startsWith('/') ? `${STRAPI_URL}${url}` : url;
};

/** Strapi `richtext` fields are Markdown; the seed content is HTML, which Markdown passes through untouched. */
const richText = (value: unknown): string => (value ? (marked.parse(String(value), { async: false }) as string) : '');

const listText = (items: unknown): string[] =>
  Array.isArray(items) ? items.map((i: any) => (typeof i === 'string' ? i : i?.text ?? '')).filter(Boolean) : [];

const cards = (items: unknown) =>
  Array.isArray(items) ? items.map((i: any) => ({ title: i?.title ?? '', summary: i?.summary ?? '' })) : [];

const seo = (value: any) => ({
  metaTitle: value?.metaTitle ?? '',
  metaDescription: value?.metaDescription ?? '',
  ...(value?.ogImage ? { ogImage: mediaUrl(value.ogImage) } : {}),
});

const normalisers: Record<CollectionName, (e: StrapiEntry) => Record<string, unknown>> = {
  services: (e) => ({
    title: e.title,
    slug: e.slug,
    serialNumber: e.serialNumber ?? '',
    summary: e.summary ?? '',
    transit: e.transit ?? '',
    cutOff: e.cutOff ?? '',
    coverage: e.coverage ?? '',
    overview: richText(e.overview),
    includedServices: listText(e.includedServices),
    mainImage: mediaUrl(e.mainImage),
    image: mediaUrl(e.image),
    logoWhite: mediaUrl(e.logoWhite),
    logoBlack: mediaUrl(e.logoBlack),
    approach: richText(e.approach),
    approachCards: cards(e.approachCards),
    work: richText(e.work),
    steps: cards(e.steps),
    price: e.price ?? '',
    priceUnit: e.priceUnit ?? '',
    availability: e.availability ?? '',
    availabilityDate: e.availabilityDate ?? '',
    seo: seo(e.seo),
  }),
  newsroom: (e) => ({
    title: e.title,
    slug: e.slug,
    summary: e.summary ?? '',
    publishedDate: e.publishedDate ?? e.publishedAt ?? '',
    featured: Boolean(e.featured),
    category: e.category ?? '',
    authorName: e.authorName ?? '',
    mainImage: mediaUrl(e.mainImage),
    overview: richText(e.overview),
    details: richText(e.details),
    conclusion: richText(e.conclusion),
    tags: listText(e.tags),
    transit: e.transit ?? '',
    cutOff: e.cutOff ?? '',
    coverage: e.coverage ?? '',
    cardTitle: e.cardTitle ?? '',
    cardSummary: e.cardSummary ?? '',
    includedServices: listText(e.includedServices),
    seo: seo(e.seo),
  }),
  careers: (e) => ({
    title: e.title,
    slug: e.slug,
    postLabel: e.postLabel ?? '',
    location: e.location ?? '',
    jobType: e.jobType ?? '',
    summary: e.summary ?? '',
    buttonText: e.buttonText || 'Apply now',
    date: e.date ?? '',
    overview: richText(e.overview),
    seo: seo(e.seo),
  }),
};

/** Fetch every published entry of a collection from Strapi (handles pagination). */
export async function fetchCollection(name: CollectionName) {
  const { path, query } = endpoints[name];
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (STRAPI_TOKEN) headers.Authorization = `Bearer ${STRAPI_TOKEN}`;

  const entries: StrapiEntry[] = [];
  for (let page = 1, pageCount = 1; page <= pageCount; page++) {
    const url = `${STRAPI_URL}/api/${path}?${query}&pagination[page]=${page}&pagination[pageSize]=100`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Strapi request failed (${res.status} ${res.statusText}): ${url}`);
    const json = await res.json();
    entries.push(...(json.data ?? []));
    pageCount = json.meta?.pagination?.pageCount ?? 1;
  }
  return entries.map(normalisers[name]);
}

/** Render seed HTML/Markdown the same way Strapi content is rendered. */
export const renderRichText = richText;
