import { getCollection, type CollectionEntry } from 'astro:content';

export type Service = CollectionEntry<'services'>['data'];
export type Article = CollectionEntry<'newsroom'>['data'];
export type Career = CollectionEntry<'careers'>['data'];

/** Services ordered by their serial number (01, 02, …). */
export async function getServices(): Promise<Service[]> {
  const entries = await getCollection('services');
  return entries.map((e) => e.data).sort((a, b) => a.serialNumber.localeCompare(b.serialNumber, undefined, { numeric: true }));
}

/** Newsroom articles, newest first. */
export async function getArticles(): Promise<Article[]> {
  const entries = await getCollection('newsroom');
  return entries.map((e) => e.data).sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
}

/** Open roles in the order they were entered in the CMS. */
export async function getCareers(): Promise<Career[]> {
  const entries = await getCollection('careers');
  return entries.map((e) => e.data);
}

/** Unique, non-empty categories in the order they first appear. */
export const uniqueCategories = (articles: Article[]) => [...new Set(articles.map((a) => a.category).filter(Boolean))];

/** "January 14, 2026" — the Webflow default date format used across the template. */
export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export const serviceUrl = (slug: string) => `/services/${slug}`;
export const articleUrl = (slug: string) => `/newsroom/${slug}`;
export const careerUrl = (slug: string) => `/careers/${slug}`;
