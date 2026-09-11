import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { listPublicDocs } from '@/lib/firestore-rest';

const staticRoutes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/programs', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/transparency', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/news', priority: 0.8, changeFrequency: 'daily' },
  { path: '/donate', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/volunteer', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/legal', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
];

function parseDate(value: unknown): Date | undefined {
  if (typeof value !== 'string') return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const news = await listPublicDocs('news');
  for (const article of news) {
    if (article.status && article.status !== 'published') continue;
    entries.push({
      url: `${SITE_URL}/news/${article.id}`,
      lastModified: parseDate(article.date) ?? new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return entries;
}
