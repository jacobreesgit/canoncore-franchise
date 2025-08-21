import type { Universe, Content, User } from '@/lib/types';

export interface JSONLDBase {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export function determineSeriesType(universe: Universe): string {
  const name = universe.name.toLowerCase();
  
  // Franchise detection patterns
  if (name.includes('mcu') || name.includes('marvel cinematic')) return 'MovieSeries';
  if (name.includes('star wars') && (name.includes('movie') || name.includes('film'))) return 'MovieSeries';
  if (name.includes('doctor who') || name.includes('tv') || name.includes('series')) return 'TVSeries';
  if (name.includes('game') || name.includes('gaming')) return 'VideoGameSeries';
  if (name.includes('book') || name.includes('novel')) return 'BookSeries';
  
  // Default fallback based on common franchise types
  return 'CreativeWorkSeries';
}

export function determineContentType(content: Content): string {
  const mediaType = content.mediaType.toLowerCase();
  const name = content.name.toLowerCase();
  
  switch (mediaType) {
    case 'video':
      // Determine if movie or episode based on name patterns
      if (name.includes('episode') || name.includes('ep ') || name.includes('s0') || name.includes('season')) {
        return 'Episode';
      }
      return 'Movie';
    case 'audio':
      return 'AudioObject';
    case 'text':
      return 'Book';
    case 'character':
      return 'Person';
    case 'location':
      return 'Place';
    case 'item':
      return 'Thing';
    case 'event':
      return 'Event';
    case 'collection':
      return 'CreativeWorkSeries';
    default:
      return 'CreativeWork';
  }
}

export function generateUniverseJSONLD(universe: Universe, baseUrl: string): JSONLDBase {
  const seriesType = determineSeriesType(universe);
  
  const jsonLd: JSONLDBase = {
    '@context': 'https://schema.org',
    '@type': seriesType,
    '@id': `${baseUrl}/universes/${universe.id}`,
    'name': universe.name,
    'description': universe.description || `Explore ${universe.name}. Track your progress through real fictional franchises.`,
    'url': `${baseUrl}/universes/${universe.id}`,
    'dateCreated': universe.createdAt.toDate().toISOString(),
    'dateModified': universe.updatedAt?.toDate().toISOString() || universe.createdAt.toDate().toISOString(),
  };

  // Add series-specific properties
  if (seriesType === 'MovieSeries' || seriesType === 'TVSeries') {
    jsonLd.genre = extractGenresFromName(universe.name);
  }

  // Add visibility metadata
  if (universe.isPublic) {
    jsonLd.audience = {
      '@type': 'Audience',
      'audienceType': 'General Public'
    };
  }

  return jsonLd;
}

export function generateContentJSONLD(
  content: Content, 
  universe: Universe, 
  baseUrl: string
): JSONLDBase {
  const contentType = determineContentType(content);
  
  const jsonLd: JSONLDBase = {
    '@context': 'https://schema.org',
    '@type': contentType,
    '@id': `${baseUrl}/content/${content.id}`,
    'name': content.name,
    'url': `${baseUrl}/content/${content.id}`,
    'dateCreated': content.createdAt.toDate().toISOString(),
    'dateModified': content.updatedAt?.toDate().toISOString() || content.createdAt.toDate().toISOString(),
  };

  // Add description if available
  if (content.description) {
    jsonLd.description = content.description;
  }

  // Add series relationship
  jsonLd.isPartOf = {
    '@type': determineSeriesType(universe),
    '@id': `${baseUrl}/universes/${universe.id}`,
    'name': universe.name
  };

  // Add content-specific properties
  if (contentType === 'Episode' || contentType === 'Movie') {
    // Duration and release date would need to be stored in content metadata
    // For now, we'll add basic properties
    if (content.progress !== undefined) {
      jsonLd.interactionStatistic = {
        '@type': 'InteractionCounter',
        'interactionType': 'https://schema.org/WatchAction',
        'userInteractionCount': content.progress > 0 ? 1 : 0
      };
    }
  }

  if (contentType === 'Person') {
    jsonLd.characterName = content.name;
    // Add fictional character context
    jsonLd.additionalType = 'https://schema.org/FictionalCharacter';
  }

  if (contentType === 'Place') {
    jsonLd.containedInPlace = {
      '@type': 'Place',
      'name': universe.name
    };
  }

  return jsonLd;
}

export function generateProfileJSONLD(user: User, baseUrl: string): JSONLDBase {
  const jsonLd: JSONLDBase = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${baseUrl}/profile/${user.id}`,
    'name': `${user.displayName || 'User'} Profile | CanonCore`,
    'description': `View ${user.displayName || 'user'}'s franchise collection and favourites on CanonCore`,
    'url': `${baseUrl}/profile/${user.id}`,
    'dateCreated': user.createdAt?.toDate().toISOString(),
    'dateModified': user.createdAt?.toDate().toISOString(),
    'mainEntity': {
      '@type': 'Person',
      'name': user.displayName || 'Anonymous User',
      'identifier': user.id
    }
  };

  if (user.email && user.email.includes('@')) {
    jsonLd.mainEntity.email = user.email;
  }

  return jsonLd;
}

export function generateCollectionPageJSONLD(
  title: string,
  description: string,
  items: Array<{ name: string; url: string; description?: string }>,
  baseUrl: string,
  currentUrl: string
): JSONLDBase {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': currentUrl,
    'name': title,
    'description': description,
    'url': currentUrl,
    'hasPart': items.map(item => ({
      '@type': 'CreativeWork',
      'name': item.name,
      'url': item.url,
      'description': item.description
    }))
  };
}

export function generateBreadcrumbJSONLD(
  breadcrumbs: Array<{ name: string; url: string }>,
  baseUrl: string
): JSONLDBase {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.name,
      'item': crumb.url.startsWith('http') ? crumb.url : `${baseUrl}${crumb.url}`
    }))
  };
}

function extractGenresFromName(name: string): string[] {
  const lowerName = name.toLowerCase();
  const genres: string[] = [];

  // Common franchise genre patterns
  if (lowerName.includes('marvel') || lowerName.includes('superhero')) {
    genres.push('Superhero', 'Action', 'Adventure');
  }
  if (lowerName.includes('star wars')) {
    genres.push('Science Fiction', 'Adventure', 'Fantasy');
  }
  if (lowerName.includes('doctor who')) {
    genres.push('Science Fiction', 'Adventure', 'Drama');
  }
  if (lowerName.includes('horror')) {
    genres.push('Horror');
  }
  if (lowerName.includes('comedy')) {
    genres.push('Comedy');
  }
  if (lowerName.includes('romance')) {
    genres.push('Romance');
  }

  return genres.length > 0 ? genres : ['Entertainment'];
}

export function extractFranchiseKeywords(universe: Universe): string[] {
  const keywords: string[] = [];
  const name = universe.name.toLowerCase();

  // Add franchise name as keywords
  keywords.push(universe.name);

  // Add common franchise-related keywords
  keywords.push('franchise', 'series', 'universe', 'collection');

  // Add specific franchise keywords
  if (name.includes('marvel')) {
    keywords.push('Marvel', 'MCU', 'superhero', 'comics');
  }
  if (name.includes('star wars')) {
    keywords.push('Star Wars', 'sci-fi', 'space opera', 'Jedi');
  }
  if (name.includes('doctor who')) {
    keywords.push('Doctor Who', 'BBC', 'time travel', 'TARDIS');
  }
  if (name.includes('dc')) {
    keywords.push('DC Comics', 'Batman', 'Superman', 'superhero');
  }

  // Add tracking and organisation keywords
  keywords.push('tracking', 'progress', 'organisation', 'catalog', 'viewing order');

  return [...new Set(keywords)]; // Remove duplicates
}

export function injectJSONLD(jsonLd: JSONLDBase | JSONLDBase[]): Record<string, string> {
  const data = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
  return {
    'script:ld+json': JSON.stringify(data.length === 1 ? data[0] : data)
  };
}