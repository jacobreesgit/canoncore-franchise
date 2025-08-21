'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { userService } from '@/lib/services';
import { Universe, User } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { useSearch } from '@/lib/hooks/useSearch';
import { Navigation, PageHeader, EmptyState, LoadingSpinner, PageContainer, CardGrid } from '@/components';

type Props = {
  initialUniverses: Universe[];
};

export default function DiscoverPageClient({ initialUniverses }: Props) {
  const { user, loading } = useAuth();
  
  // Set page title
  usePageTitle('Discover');
  const [publicUniverses, setPublicUniverses] = useState<Universe[]>(initialUniverses);
  const [universesLoading, setUniversesLoading] = useState(false);
  const [universeOwners, setUniverseOwners] = useState<Record<string, User>>({});
  
  // Fuzzy search hook
  const { searchQuery, setSearchQuery, filteredResults: filteredUniverses } = useSearch(publicUniverses, {
    keys: ['name', 'description']
  });


  useEffect(() => {
    // Fetch universe owners after initial render
    const fetchUniverseOwners = async () => {
      if (publicUniverses.length === 0) return;
      
      try {
        const uniqueUserIds = Array.from(new Set(publicUniverses.map(u => u.userId)));
        const owners = await Promise.all(
          uniqueUserIds.map(async (userId) => {
            try {
              const owner = await userService.getById(userId);
              return { userId, owner };
            } catch (error) {
              console.error(`Error fetching user ${userId}:`, error);
              return { userId, owner: null };
            }
          })
        );

        const ownersMap = owners.reduce((acc, { userId, owner }) => {
          if (owner) acc[userId] = owner;
          return acc;
        }, {} as Record<string, User>);

        setUniverseOwners(ownersMap);
      } catch (error) {
        console.error('Error fetching universe owners:', error);
      }
    };

    fetchUniverseOwners();
  }, [publicUniverses]);

  if (loading) {
    return <LoadingSpinner variant="fullscreen" message="Loading..." />;
  }

  return (
    <div className="bg-surface-page">
      <Navigation 
        variant="detail"
        currentPage="discover"
        showNavigationMenu={true}
      />

      <PageContainer variant="wide">
        <PageHeader
          variant="centered"
          title="Discover Franchises"
          description="Explore public franchise universes created by the community"
          searchBar={publicUniverses.length > 0 ? {
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: 'Search public franchises...',
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
              : 'Public franchises will appear here when users make them available to the community'
            }
          />
        ) : (
          <CardGrid 
            variant="default" 
            universes={filteredUniverses}
            showFavourite={!!user}
            showOwner={true}
            showOwnerBadge={false}
            currentUserId={user?.id}
            universeHref={(universe) => `/universes/${universe.id}?from=discover`}
            ownerNames={Object.fromEntries(
              Object.entries(universeOwners).map(([userId, user]) => [
                userId,
                user.displayName || user.email || 'Unknown User'
              ])
            )}
          />
        )}
      </PageContainer>
    </div>
  );
}