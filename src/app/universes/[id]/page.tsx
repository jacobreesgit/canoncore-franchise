import type { Metadata } from 'next';
import { universeService } from '@/lib/services';
import { 
  generateUniverseJSONLD, 
  generateBreadcrumbJSONLD, 
  injectJSONLD,
  getBaseUrl,
  createCanonicalUrl,
  createOpenGraphMetadata,
  createTwitterMetadata,
  extractFranchiseKeywords
} from '@/lib/metadata';
import UniversePageClient from './universe-page-client';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const universe = await universeService.getById(id);
    if (!universe) {
      return {
        title: 'Universe Not Found - CanonCore',
        description: 'The requested universe could not be found.',
      };
    }

    const baseUrl = getBaseUrl();
    const canonicalUrl = createCanonicalUrl(`/universes/${id}`);
    const title = `${universe.name} | CanonCore`;
    const description = universe.description || `Explore ${universe.name}. Track your progress through real fictional franchises.`;
    const keywords = extractFranchiseKeywords(universe);

    // Generate structured data
    const universeJsonLd = generateUniverseJSONLD(universe, baseUrl);
    const breadcrumbJsonLd = generateBreadcrumbJSONLD([
      { name: 'Home', url: '/' },
      { name: 'Franchises', url: '/discover' },
      { name: universe.name, url: `/universes/${id}` }
    ], baseUrl);

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: canonicalUrl
      },
      openGraph: createOpenGraphMetadata(
        universe.name,
        description,
        canonicalUrl,
        'article',
        {
          publishedTime: universe.createdAt.toDate().toISOString(),
          modifiedTime: universe.updatedAt?.toDate().toISOString() || universe.createdAt.toDate().toISOString(),
          section: 'Franchise',
          tags: keywords
        }
      ),
      twitter: createTwitterMetadata(
        universe.name,
        description,
        'summary_large_image'
      ),
      other: injectJSONLD([universeJsonLd, breadcrumbJsonLd])
    };
  } catch (error) {
    return {
      title: 'Universe - CanonCore',
      description: 'Organise and track your progress through real fictional franchises.',
    };
  }
}

export default async function UniversePage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  return <UniversePageClient params={resolvedParams} searchParams={resolvedSearchParams} />;
}