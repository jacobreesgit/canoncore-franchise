import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://canoncore.app';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/discover', '/universes'],
      disallow: ['/profile', '/universes/create', '/content/*/edit', '/universes/*/edit'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}