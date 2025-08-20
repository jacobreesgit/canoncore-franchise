'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { universeService } from '@/lib/services';
import { Universe } from '@/lib/types';
import { useEffect, useState } from 'react';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { useSearch } from '@/lib/hooks/useSearch';
import { Navigation, PageHeader, EmptyState, UniverseCard, Button, LoadingSpinner, PageContainer, CardGrid } from '@/components';

export default function Home() {
  const { user, loading, signIn, signOut } = useAuth();
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [universesLoading, setUniversesLoading] = useState(true);
  
  // Fuzzy search hook
  const { searchQuery, setSearchQuery, filteredResults: filteredUniverses } = useSearch(universes, {
    keys: ['name', 'description']
  });

  // Set page title
  usePageTitle('Dashboard');

  useEffect(() => {
    if (user) {
      const fetchUniverses = async () => {
        try {
          const userUniverses = await universeService.getUserUniversesWithProgress(user.id);
          setUniverses(userUniverses);
        } catch (error) {
          console.error('Error fetching universes:', error);
        } finally {
          setUniversesLoading(false);
        }
      };
      fetchUniverses();
    }
  }, [user]);

  if (loading) {
    return <LoadingSpinner variant="fullscreen" message="Loading..." />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center bg-surface-page min-h-screen">
        <div className="max-w-md w-full bg-surface-card rounded-lg shadow-md p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">
              CanonCore
            </h1>
            <p className="text-secondary mb-8">
              Organise and track your progress through real fictional franchises like Marvel, Doctor Who, Star Wars, and more.
            </p>
            <Button
              onClick={signIn}
              variant="primary"
              size="large"
              className="w-full"
            >
              Sign in with Google
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-page">
      <Navigation 
        variant="detail"
        currentPage="dashboard"
        showNavigationMenu={true}
        actions={[
          { type: 'primary', label: '+ Franchise', href: '/universes/create' }
        ]}
      />

      <PageContainer variant="wide">
        <PageHeader
          variant="centered"
          title="Your Franchises"
          description="Manage and track your progress through your favourite fictional universes"
          searchBar={universes.length > 0 ? {
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: 'Search your franchises...',
            variant: 'default'
          } : undefined}
        />

        {universesLoading ? (
          <LoadingSpinner variant="inline" message="Loading your franchises..." />
        ) : filteredUniverses.length === 0 ? (
          <EmptyState
            variant="default"
            title={searchQuery ? 'No matching franchises found' : 'No franchises yet'}
            description={searchQuery 
              ? 'Try adjusting your search terms'
              : 'Start by adding your first franchise like Marvel, Doctor Who, or Star Wars'
            }
          />
        ) : (
          <>
            <CardGrid 
              variant="default" 
              universes={filteredUniverses}
              showFavourite={true}
              showOwner={false}
              showOwnerBadge={true}
              currentUserId={user.id}
              universeHref={(universe) => `/universes/${universe.id}?from=dashboard`}
            />
          </>
        )}
      </PageContainer>
    </div>
  );
}