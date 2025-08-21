import type { Metadata } from 'next';
import { universeService } from '@/lib/services';
import { 
  generateCollectionPageJSONLD, 
  generateBreadcrumbJSONLD, 
  injectJSONLD,
  getBaseUrl,
  createCanonicalUrl,
  createOpenGraphMetadata,
  createTwitterMetadata
} from '@/lib/metadata';
import DiscoverPageClient from './discover-page-client';

async function getPublicUniverses() {
  try {
    return await universeService.getPublicUniverses();
  } catch (error) {
    console.error('Error fetching public universes:', error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const canonicalUrl = createCanonicalUrl('/discover');
  const title = 'Discover Franchises | CanonCore';
  const description = 'Explore public franchise universes created by the community. Find Marvel, Doctor Who, Star Wars universes and more.';

  // Get universes for structured data
  const universes = await getPublicUniverses();
  const franchiseItems = universes.map(universe => ({
    name: universe.name,
    url: `${baseUrl}/universes/${universe.id}`,
    description: universe.description || `Explore ${universe.name} franchise content`
  }));

  // Generate structured data
  const collectionJsonLd = generateCollectionPageJSONLD(
    title,
    description,
    franchiseItems,
    baseUrl,
    canonicalUrl
  );
  
  const breadcrumbJsonLd = generateBreadcrumbJSONLD([
    { name: 'Home', url: '/' },
    { name: 'Discover Franchises', url: '/discover' }
  ], baseUrl);

  return {
    title,
    description,
    keywords: [
      'franchise discovery',
      'Marvel',
      'Doctor Who', 
      'Star Wars',
      'DC Comics',
      'fictional universes',
      'entertainment catalog',
      'viewing order',
      'franchise exploration'
    ],
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: createOpenGraphMetadata(
      title,
      description,
      canonicalUrl,
      'website',
      {
        section: 'Discovery'
      }
    ),
    twitter: createTwitterMetadata(
      title,
      'Explore public franchise universes created by the community.',
      'summary_large_image'
    ),
    other: injectJSONLD([collectionJsonLd, breadcrumbJsonLd])
  };
}

export default async function DiscoverPage() {
  // Server-side data fetching for public universes
  const rawUniverses = await getPublicUniverses();
  
  // Serialize Firebase Timestamps for client component
  const initialUniverses = rawUniverses.map(universe => ({
    ...universe,
    createdAt: universe.createdAt.toDate(),
    updatedAt: universe.updatedAt?.toDate() || universe.createdAt.toDate()
  }));
  
  return <DiscoverPageClient initialUniverses={initialUniverses} />;
}