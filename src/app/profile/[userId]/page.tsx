import type { Metadata } from 'next';
import { userService } from '@/lib/services';
import { 
  generateProfileJSONLD, 
  generateBreadcrumbJSONLD, 
  injectJSONLD,
  getBaseUrl,
  createCanonicalUrl,
  createOpenGraphMetadata,
  createTwitterMetadata
} from '@/lib/metadata';
import ProfilePageClient from './profile-page-client';

type Props = {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { userId } = await params;
    const user = await userService.getById(userId);
    if (!user) {
      return {
        title: 'Profile Not Found - CanonCore',
        description: 'The requested user profile could not be found.',
      };
    }

    const baseUrl = getBaseUrl();
    const canonicalUrl = createCanonicalUrl(`/profile/${userId}`);
    const title = `${user.displayName || 'User'} Profile | CanonCore`;
    const description = `View ${user.displayName || 'user'}'s franchise collection and favourites on CanonCore. Discover their favourite fictional universes.`;

    // Generate structured data
    const profileJsonLd = generateProfileJSONLD(user, baseUrl);
    const breadcrumbJsonLd = generateBreadcrumbJSONLD([
      { name: 'Home', url: '/' },
      { name: 'Profile', url: `/profile/${userId}` }
    ], baseUrl);

    return {
      title,
      description,
      keywords: [
        user.displayName || 'user',
        'profile',
        'franchise collection',
        'favourites',
        'viewing progress',
        'fictional universes'
      ],
      alternates: {
        canonical: canonicalUrl
      },
      openGraph: createOpenGraphMetadata(
        `${user.displayName || 'User'} Profile`,
        description,
        canonicalUrl,
        'profile'
      ),
      twitter: createTwitterMetadata(
        `${user.displayName || 'User'} Profile`,
        description,
        'summary'
      ),
      other: injectJSONLD([profileJsonLd, breadcrumbJsonLd])
    };
  } catch (error) {
    return {
      title: 'Profile - CanonCore',
      description: 'User profiles on CanonCore - discover franchise collections and favourites.',
    };
  }
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  
  // Try to fetch initial user data for SSR
  let initialUser;
  try {
    initialUser = await userService.getById(resolvedParams.userId);
  } catch (error) {
    // User will be fetched client-side if server fetch fails
    initialUser = undefined;
  }
  
  return <ProfilePageClient userId={resolvedParams.userId} initialUser={initialUser || undefined} />;
}