'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { universeService, userService } from '@/lib/services';
import { Universe, User } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { useSearch } from '@/lib/hooks/useSearch';
import { Navigation, PageHeader, EmptyState, UniverseCard, LoadingSpinner, PageContainer, CardGrid } from '@/components';

export default function DiscoverPage() {
  const { user, loading } = useAuth();
  
  // Set page title
  usePageTitle('Discover');
  const [publicUniverses, setPublicUniverses] = useState<Universe[]>([]);
  const [universesLoading, setUniversesLoading] = useState(true);
  const [universeOwners, setUniverseOwners] = useState<Record<string, User>>({});
  
  // Fuzzy search hook
  const { searchQuery, setSearchQuery, filteredResults: filteredUniverses } = useSearch(publicUniverses, {
    keys: ['name', 'description']
  });


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
            actions={user ? [
              { text: "Create First Public Franchise", href: "/universes/create", variant: "primary" }
            ] : []}
          />
        ) : (
          <CardGrid 
            variant="default"
            universes={filteredUniverses}
            universeHref={(universe) => `/universes/${universe.id}?from=discover`}
            showFavourite={user ? true : false}
            showOwner={true}
            ownerNames={Object.fromEntries(
              Object.entries(universeOwners).map(([userId, userData]) => [
                userId, 
                userData?.displayName || userData?.email || 'Unknown User'
              ])
            )}
            showOwnerBadge={true}
            currentUserId={user?.id}
          />
        )}
      </PageContainer>
    </div>
  );
}