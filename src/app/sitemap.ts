import { MetadataRoute } from 'next';
import { universeService } from '@/lib/services';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://canoncore.app';

  // Static routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/discover`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  try {
    // Get public universes for dynamic routes
    const publicUniverses = await universeService.getPublicUniverses();
    const universeRoutes = publicUniverses.map((universe) => ({
      url: `${baseUrl}/universes/${universe.id}`,
      lastModified: new Date(universe.updatedAt?.toDate() || universe.createdAt.toDate()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...routes, ...universeRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}