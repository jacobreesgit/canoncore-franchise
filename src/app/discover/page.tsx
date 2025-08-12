'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { universeService, userService } from '@/lib/services';
import { Universe, User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { Navigation, PageHeader, EmptyState, UniverseCard, LoadingSpinner, PageContainer, CardGrid } from '@/components';

export default function DiscoverPage() {
  const { user, loading } = useAuth();
  
  // Set page title
  usePageTitle('Discover');
  const [publicUniverses, setPublicUniverses] = useState<Universe[]>([]);
  const [universesLoading, setUniversesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [universeOwners, setUniverseOwners] = useState<Record<string, User>>({});

  useEffect(() => {
    const fetchPublicUniverses = async () => {
      try {
        let universes;
        if (user) {
          // Fetch with user progress for authenticated users
          universes = await universeService.getPublicUniversesWithUserProgress(user.id);
        } else {
          // Fetch without progress for non-authenticated users
          universes = await universeService.getPublicUniverses();
        }
        setPublicUniverses(universes);
        
        // Fetch owner information for universes not owned by current user
        if (user) {
          const ownersToFetch = [...new Set(
            universes
              .filter(universe => universe.userId !== user.id)
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
      } catch (error) {
        console.error('Error fetching public universes:', error);
      } finally {
        setUniversesLoading(false);
      }
    };

    fetchPublicUniverses();
  }, [user]);

  const filteredUniverses = publicUniverses.filter(universe => 
    universe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    universe.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner variant="fullscreen" message="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-surface-page">
      <Navigation 
        variant="detail"
        currentPage="discover"
        showNavigationMenu={true}
      />

      <PageContainer variant="wide">
        <PageHeader
          variant="centered"
          title="Discover Franchises"
          description="Explore public franchise collections created by the community"
          searchBar={publicUniverses.length > 0 ? {
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: 'Search Marvel, Doctor Who, Star Wars...',
            variant: 'default'
          } : undefined}
        />

        {universesLoading ? (
          <LoadingSpinner variant="inline" message="Loading public franchises..." />
        ) : filteredUniverses.length === 0 ? (
          <EmptyState
            variant="default"
            title={searchQuery ? 'No matching franchises found' : 'No public franchises yet'}
            description={searchQuery 
              ? 'Try adjusting your search terms'
              : 'Be the first to create and share a public franchise!'
            }
            actionText={user ? "Create First Public Franchise" : undefined}
            actionHref={user ? "/universes/create" : undefined}
            showAction={!!user}
          />
        ) : (
          <>
            <div className="mb-4 text-sm text-secondary">
              {searchQuery && (
                <span>
                  Showing {filteredUniverses.length} result{filteredUniverses.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
                </span>
              )}
              {!searchQuery && (
                <span>{filteredUniverses.length} public franchise{filteredUniverses.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            <CardGrid variant="default">
              {filteredUniverses.map((universe) => {
                const isOwned = user && universe.userId === user.id;
                const ownerData = universeOwners[universe.userId];
                
                return (
                  <UniverseCard
                    key={universe.id}
                    universe={universe}
                    href={`/universes/${universe.id}?from=discover`}
                    showFavourite={user ? true : false}
                    showOwner={!isOwned && !!ownerData}
                    ownerName={ownerData?.displayName || ownerData?.email}
                    showOwnerBadge={true}
                    currentUserId={user?.id}
                  />
                );
              })}
            </CardGrid>
          </>
        )}
      </PageContainer>
    </div>
  );
}