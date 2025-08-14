'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { userService, universeService, contentService } from '@/lib/services';
import { User, Universe, Content, Favorite } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import Link from 'next/link';
import { FavouriteButton, Navigation, PageHeader, EmptyState, Button, UniverseCard, ProgressBar, ViewToggle, LoadingSpinner, PageContainer, CardGrid, DeleteConfirmationModal } from '@/components';

export default function ProfilePage() {
  const { user: currentUser, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userUniverses, setUserUniverses] = useState<Universe[]>([]);
  const [favourites, setFavourites] = useState<Favorite[]>([]);
  const [favouriteUniverses, setFavouriteUniverses] = useState<Universe[]>([]);
  const [favouriteContent, setFavouriteContent] = useState<Content[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'universes' | 'favourites'>('universes');
  const [showClearFavouritesConfirm, setShowClearFavouritesConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [universeOwners, setUniverseOwners] = useState<Record<string, User>>({});

  // Set dynamic page title
  usePageTitle(profileUser?.displayName || 'Profile', profileUser);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setProfileLoading(true);
        setError(null);
        
        
        const userData = await userService.getById(userId);
        
        if (!userData) {
          setError('User not found');
          return;
        }

        setProfileUser(userData);

        // Get user's public universes
        const universes = await universeService.getUserUniverses(userId);
        const publicUniverses = universes.filter(u => u.isPublic);
        setUserUniverses(publicUniverses);

        // Get user's favourites if viewing own profile
        if (currentUser && currentUser.id === userId) {
          try {
            const userFavorites = await userService.getFavourites(userId);
            setFavourites(userFavorites);
            
            // Get universe details for favourited universes
            const universeIds = userFavorites
              .filter(fav => fav.targetType === 'universe')
              .map(fav => fav.targetId);
            
            // Get content details for favourited content
            const contentIds = userFavorites
              .filter(fav => fav.targetType === 'content')
              .map(fav => fav.targetId);
            
            // Fetch universe details
            if (universeIds.length > 0) {
              const favouriteUniverseDetails = await Promise.all(
                universeIds.map(id => universeService.getById(id))
              );
              const validUniverses = favouriteUniverseDetails.filter(Boolean) as Universe[];
              setFavouriteUniverses(validUniverses);
              
              // Fetch owner information for favourite universes not owned by current user
              if (currentUser) {
                const ownersToFetch = [...new Set(
                  validUniverses
                    .filter(universe => universe.userId !== currentUser.id)
                    .map(universe => universe.userId)
                )];
                
                const owners: Record<string, User> = {};
                await Promise.all(
                  ownersToFetch.map(async (userId) => {
                    try {
                      const ownerData = await userService.getById(userId);
                      if (ownerData) {
                        owners[userId] = ownerData;
                      }
                    } catch (error) {
                      console.error(`Error fetching owner ${userId}:`, error);
                    }
                  })
                );
                setUniverseOwners(owners);
              }
            } else {
              setFavouriteUniverses([]);
            }

            // Fetch content details
            if (contentIds.length > 0) {
              const favouriteContentDetails = await Promise.all(
                contentIds.map(id => contentService.getById(id))
              );
              setFavouriteContent(favouriteContentDetails.filter(Boolean) as Content[]);
            } else {
              setFavouriteContent([]);
            }
          } catch (error) {
            console.error('Error fetching favourites:', error);
            setFavourites([]);
            setFavouriteUniverses([]);
            setFavouriteContent([]);
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Error loading profile data');
      } finally {
        setProfileLoading(false);
      }
    };

    // Only fetch when we have userId, auth is not loading, and user is authenticated
    if (userId && !loading && currentUser) {
      // Add a small delay to ensure Firebase auth is fully initialized
      const timer = setTimeout(() => {
        fetchProfileData();
      }, 100);
      
      return () => clearTimeout(timer);
    } else if (userId && !loading && !currentUser) {
      // User is not authenticated, redirect to home
      setError('Authentication required');
      setProfileLoading(false);
    }
  }, [userId, currentUser, loading]);

  const handleClearFavourites = async () => {
    if (!currentUser) return;
    
    setIsClearing(true);
    try {
      await userService.clearAllFavourites(currentUser.id);
      
      // Refresh favourites data
      setFavourites([]);
      setFavouriteUniverses([]);
      setFavouriteContent([]);
      setShowClearFavouritesConfirm(false);
    } catch (error) {
      console.error('Error clearing favourites:', error);
      setError('Failed to clear favourites. Please try again.');
    } finally {
      setIsClearing(false);
    }
  };

  if (loading || profileLoading) {
    return <LoadingSpinner variant="fullscreen" message="Loading..." />;
  }

  if (!currentUser) {
    router.push('/');
    return null;
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-surface-page">
        <Navigation variant="detail" />

        <PageContainer variant="wide">
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-lg font-medium text-red-600 mb-2">
                {error || 'User not found'}
              </h3>
              <Link
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  const isOwnProfile = currentUser.id === userId;
  const totalUniverses = userUniverses.length;
  const totalFavourites = favourites.length;

  return (
    <div className="min-h-screen bg-surface-page">
      <Navigation 
        variant="detail"
        currentPage="profile"
        actions={isOwnProfile ? [
          { type: 'secondary', label: 'Edit Profile', href: `/profile/${userId}/edit` }
        ] : []}
        showNavigationMenu={true}
      />

      <PageContainer variant="wide">
        <PageHeader
          variant="detail"
          title={profileUser.displayName || 'Anonymous User'}
          description={isOwnProfile ? 'Your Profile' : 'User Profile'}
          extraContent={
            <div>
              {isOwnProfile && profileUser.email && (
                <p className="text-sm text-gray-500 mb-4">
                  {profileUser.email}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-secondary">
                <div>
                  <span className="font-medium text-gray-900">{totalUniverses}</span>
                  <span className="ml-1">Public Franchise{totalUniverses !== 1 ? 's' : ''}</span>
                </div>
                {isOwnProfile && (
                  <div>
                    <span className="font-medium text-gray-900">{totalFavourites}</span>
                    <span className="ml-1">Favourite{totalFavourites !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>
          }
          actions={isOwnProfile ? [
            { type: 'secondary' as const, label: 'Edit Profile', href: `/profile/${userId}/edit` },
            ...(activeTab === 'favourites' && totalFavourites > 0 ? [
              { type: 'danger' as const, label: 'Clear All Favourites', onClick: () => setShowClearFavouritesConfirm(true) }
            ] : [])
          ] : []}
        />

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <h2 className="text-xl font-bold text-gray-900">Content</h2>
            <ViewToggle
              value={activeTab}
              onChange={(value) => setActiveTab(value as 'universes' | 'favourites')}
              options={[
                { value: 'universes', label: `Public Franchises (${totalUniverses})` },
                ...(isOwnProfile ? [{ value: 'favourites' as const, label: `Favourites (${totalFavourites})` }] : [])
              ]}
            />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'universes' && (
          <div>
            {userUniverses.length === 0 ? (
              <EmptyState
                variant="default"
                title="No public franchises"
                description={isOwnProfile 
                  ? "You haven't created any public franchises yet"
                  : "This user hasn't shared any public franchises yet"
                }
              />
            ) : (
              <CardGrid variant="default">
                {userUniverses.map((universe) => (
                  <UniverseCard
                    key={universe.id}
                    universe={universe}
                    href={`/universes/${universe.id}?from=profile&profileId=${profileUser?.id}`}
                    showFavourite={false}
                    showOwner={false}
                    showOwnerBadge={true}
                    currentUserId={currentUser?.id}
                  />
                ))}
              </CardGrid>
            )}
          </div>
        )}

        {activeTab === 'favourites' && isOwnProfile && (
          <div>
            {favouriteUniverses.length === 0 && favouriteContent.length === 0 ? (
              <EmptyState
                variant="default"
                title="No favourites yet"
                description="Start exploring franchises to add them to your favourites"
                actionText="Discover Franchises"
                actionHref="/discover"
              />
            ) : (
              <div className="space-y-8">
                {/* Favourite Universes */}
                {favouriteUniverses.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Favourite Universes</h2>
                    <CardGrid variant="default">
                      {favouriteUniverses.map((universe) => {
                        const isOwned = currentUser && universe.userId === currentUser.id;
                        const ownerData = universeOwners[universe.userId];
                        
                        return (
                          <UniverseCard
                            key={`universe-${universe.id}`}
                            universe={universe}
                            href={`/universes/${universe.id}?from=profile&profileId=${profileUser?.id}`}
                            showFavourite={true}
                            showOwner={!isOwned && !!ownerData}
                            ownerName={ownerData?.displayName || ownerData?.email || 'Unknown User'}
                            showOwnerBadge={true}
                            currentUserId={currentUser?.id}
                          />
                        );
                      })}
                    </CardGrid>
                  </div>
                )}

                {/* Favourite Content */}
                {favouriteContent.length > 0 && (
                  <CardGrid 
                    variant="default"
                    content={favouriteContent}
                    contentHref={(content) => `/content/${content.id}?from=profile&profileId=${profileUser?.id}`}
                    sortContent={true}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </PageContainer>

      {/* Clear Favourites Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showClearFavouritesConfirm}
        onCancel={() => setShowClearFavouritesConfirm(false)}
        onConfirm={handleClearFavourites}
        isDeleting={isClearing}
        title="Clear All Favourites?"
        itemName={`${totalFavourites} favourite${totalFavourites !== 1 ? 's' : ''}`}
        warningMessage="This action will remove all favourites from your profile"
        deleteButtonText="Clear All Favourites"
      />
    </div>
  );
}