import type { Metadata } from 'next';

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://canoncore.app';
}

export function createCanonicalUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export function generatePageTitle(title: string, includeAppName: boolean = true): string {
  return includeAppName ? `${title} | CanonCore` : title;
}

export function generatePageDescription(
  content: string,
  fallback: string = 'Organise and track your progress through real fictional franchises like Marvel, Doctor Who, Star Wars, and more.'
): string {
  return content || fallback;
}

export function createOpenGraphMetadata(
  title: string,
  description: string,
  url: string,
  type: 'website' | 'article' | 'profile' = 'website',
  additional?: Partial<Metadata['openGraph']>
): Metadata['openGraph'] {
  return {
    type,
    title,
    description,
    url,
    siteName: 'CanonCore',
    locale: 'en_GB',
    ...additional
  };
}

export function createTwitterMetadata(
  title: string,
  description: string,
  card: 'summary' | 'summary_large_image' = 'summary'
): Metadata['twitter'] {
  return {
    card,
    title,
    description,
    creator: '@canoncore'
  };
}

export function createRobotsMetadata(
  index: boolean = true,
  follow: boolean = true
): Metadata['robots'] {
  return {
    index,
    follow,
    googleBot: {
      index,
      follow,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1
    }
  };
}

export function formatDateForMetadata(date: Date): string {
  return date.toISOString();
}

export function generateAlternateLanguages(path: string): Metadata['alternates'] {
  return {
    canonical: createCanonicalUrl(path),
    languages: {
      'en-GB': createCanonicalUrl(path),
      'en-US': createCanonicalUrl(path),
      'x-default': createCanonicalUrl(path)
    }
  };
}

export function createMetadataKeywords(
  primary: string[],
  franchise?: string,
  contentType?: string
): string[] {
  const keywords = [...primary];
  
  // Add franchise-specific keywords
  if (franchise) {
    keywords.push(franchise);
  }
  
  // Add content type keywords
  if (contentType) {
    keywords.push(contentType);
  }
  
  // Add common CanonCore keywords
  keywords.push(
    'franchise tracking',
    'viewing order',
    'progress tracking',
    'fictional universes',
    'entertainment catalog'
  );
  
  return [...new Set(keywords)]; // Remove duplicates
}