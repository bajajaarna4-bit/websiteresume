import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (process.env.SITE_URL ?? 'https://localhost:3000').replace(/\/$/, '');
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date('2026-11-26T00:00:00Z'),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
