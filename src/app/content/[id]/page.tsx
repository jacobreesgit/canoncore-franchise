import type { Metadata } from 'next';
import { contentService, universeService } from '@/lib/services';
import { 
  generateContentJSONLD, 
  generateBreadcrumbJSONLD, 
  injectJSONLD,
  getBaseUrl,
  createCanonicalUrl,
  createOpenGraphMetadata,
  createTwitterMetadata,
  extractFranchiseKeywords,
  createMetadataKeywords
} from '@/lib/metadata';
import ContentPageClient from './content-page-client';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const content = await contentService.getById(id);
    if (!content) {
      return {
        title: 'Content Not Found - CanonCore',
        description: 'The requested content could not be found.',
      };
    }

    const universe = await universeService.getById(content.universeId);
    if (!universe) {
      return {
        title: 'Content - CanonCore',
        description: 'The requested content universe could not be found.',
      };
    }

    const baseUrl = getBaseUrl();
    const canonicalUrl = createCanonicalUrl(`/content/${id}`);
    const title = `${content.name} - ${universe.name} | CanonCore`;
    const description = content.description || `${content.name} from ${universe.name}. Track your progress through real fictional franchises.`;
    
    // Generate content-specific keywords
    const franchiseKeywords = extractFranchiseKeywords(universe);
    const keywords = createMetadataKeywords(
      [content.name, content.mediaType],
      universe.name,
      content.mediaType
    );
    
    // Generate structured data
    const contentJsonLd = generateContentJSONLD(content, universe, baseUrl);
    const breadcrumbJsonLd = generateBreadcrumbJSONLD([
      { name: 'Home', url: '/' },
      { name: 'Franchises', url: '/discover' },
      { name: universe.name, url: `/universes/${universe.id}` },
      { name: content.name, url: `/content/${id}` }
    ], baseUrl);

    // Determine Open Graph type based on media type
    const ogType = ['video', 'text'].includes(content.mediaType.toLowerCase()) 
      ? 'article' 
      : 'website';

    return {
      title,
      description,
      keywords: [...new Set([...keywords, ...franchiseKeywords])],
      alternates: {
        canonical: canonicalUrl
      },
      openGraph: createOpenGraphMetadata(
        `${content.name} - ${universe.name}`,
        description,
        canonicalUrl,
        ogType,
        {
          publishedTime: content.createdAt.toDate().toISOString(),
          modifiedTime: content.updatedAt?.toDate().toISOString() || content.createdAt.toDate().toISOString(),
          section: content.mediaType,
          tags: keywords
        }
      ),
      twitter: createTwitterMetadata(
        `${content.name} - ${universe.name}`,
        description,
        'summary'
      ),
      other: injectJSONLD([contentJsonLd, breadcrumbJsonLd])
    };
  } catch (error) {
    return {
      title: 'Content - CanonCore',
      description: 'Organise and track your progress through real fictional franchises.',
    };
  }
}

export default async function ContentPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  return <ContentPageClient params={resolvedParams} searchParams={resolvedSearchParams} />;
}