import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import config from './config/config.json';
import { fetchCollection, isStrapiEnabled, renderRichText, type CollectionName } from './lib/strapi';
import servicesSeed from './content/data/services.json';
import newsroomSeed from './content/data/newsroom.json';
import careersSeed from './content/data/careers.json';

const seeds: Record<CollectionName, Record<string, any>[]> = {
  services: servicesSeed,
  newsroom: newsroomSeed,
  careers: careersSeed,
};

/** Rich-text fields per collection, rendered to HTML for local seed data. */
const richTextFields: Record<CollectionName, string[]> = {
  services: ['overview', 'approach', 'work'],
  newsroom: ['overview', 'details', 'conclusion'],
  careers: ['overview'],
};

function localEntries(name: CollectionName) {
  return seeds[name].map((entry) => {
    const out = { ...entry };
    for (const field of richTextFields[name]) out[field] = renderRichText(out[field]);
    return out;
  });
}

/**
 * Loads a collection from Strapi when `STRAPI_URL` is set, otherwise from the local
 * seed JSON in `src/content/data`. If Strapi is unreachable and `cms.fallback_to_local`
 * is true, the build falls back to the seed data instead of failing.
 */
function cmsLoader(name: CollectionName) {
  return async () => {
    let entries: Record<string, any>[];
    if (isStrapiEnabled()) {
      try {
        entries = await fetchCollection(name);
      } catch (error) {
        if (!config.cms.fallback_to_local) throw error;
        console.warn(`[cms] ${(error as Error).message}\n[cms] Falling back to local "${name}" seed data.`);
        entries = localEntries(name);
      }
    } else {
      entries = localEntries(name);
    }
    return entries.map((entry) => ({ id: entry.slug, ...entry }));
  };
}

const seo = z
  .object({
    metaTitle: z.string().default(''),
    metaDescription: z.string().default(''),
    ogImage: z.string().optional(),
  })
  .default({ metaTitle: '', metaDescription: '' });

const card = z.object({ title: z.string(), summary: z.string() });

const services = defineCollection({
  loader: cmsLoader('services'),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    serialNumber: z.string(),
    summary: z.string(),
    transit: z.string(),
    cutOff: z.string(),
    coverage: z.string(),
    overview: z.string(),
    includedServices: z.array(z.string()),
    mainImage: z.string(),
    image: z.string(),
    logoWhite: z.string(),
    logoBlack: z.string(),
    approach: z.string(),
    approachCards: z.array(card),
    work: z.string(),
    steps: z.array(card),
    price: z.string(),
    priceUnit: z.string(),
    availability: z.string(),
    availabilityDate: z.string(),
    seo,
  }),
});

const newsroom = defineCollection({
  loader: cmsLoader('newsroom'),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    publishedDate: z.coerce.date(),
    featured: z.boolean(),
    category: z.string(),
    authorName: z.string(),
    mainImage: z.string(),
    overview: z.string(),
    details: z.string(),
    conclusion: z.string(),
    tags: z.array(z.string()),
    transit: z.string(),
    cutOff: z.string(),
    coverage: z.string(),
    cardTitle: z.string(),
    cardSummary: z.string(),
    includedServices: z.array(z.string()),
    seo,
  }),
});

const careers = defineCollection({
  loader: cmsLoader('careers'),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    postLabel: z.string(),
    location: z.string(),
    jobType: z.string(),
    summary: z.string(),
    buttonText: z.string(),
    date: z.coerce.date(),
    overview: z.string(),
    seo,
  }),
});

export const collections = { services, newsroom, careers };
