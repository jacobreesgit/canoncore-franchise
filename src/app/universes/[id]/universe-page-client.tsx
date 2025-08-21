'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { universeService, contentService, relationshipService, userService } from '@/lib/services';
import { Universe, Content, User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePageTitle, useUniverseProgress } from '@/lib/hooks';
import { useSearch } from '@/lib/hooks/useSearch';
import Link from 'next/link';
import { FavouriteButton, Navigation, PageHeader, DeleteConfirmationModal, EmptyState, Button, ButtonLink, LoadingSpinner, PageContainer, Badge, ContentSection } from '@/components';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function UniversePageClient({ params }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const universeId = params.id;

  const [universe, setUniverse] = useState<Universe | null>(null);
  const [universeOwner, setUniverseOwner] = useState<User | null>(null);
  const [content, setContent] = useState<Content[]>([]);
  const [universeLoading, setUniverseLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('tree');
  const [hierarchyTree, setHierarchyTree] = useState<any[]>([]);
  
  // Fuzzy search hook for content
  const { searchQuery, setSearchQuery, filteredResults: filteredContent } = useSearch(content, {
    keys: ['name', 'description', 'mediaType']
  });

  // Use universe progress hook for real-time updates
  const { universeProgress, setUniverseProgress } = useUniverseProgress(universeId, universe?.progress || 0, user?.id || '');

  // Set dynamic page title
  usePageTitle(universe?.name || 'Universe', universe);

  useEffect(() => {
    if (user && universeId) {
      const fetchUniverseData = async () => {
        try {
          setUniverseLoading(true);
          
          const universeData = await universeService.getByIdWithUserProgress(universeId, user.id);
          if (!universeData) {
            setError('Universe not found');
            return;
          }

          if (!universeData.isPublic && universeData.userId !== user.id) {
            setError('You do not have permission to view this universe');
            return;
          }

          setUniverse(universeData);

          // Update universe progress hook with loaded data
          if (universeData.progress !== undefined) {
            setUniverseProgress(universeData.progress);
          }

          // Fetch universe owner information if not the current user
          if (universeData.userId !== user.id) {
            const ownerData = await userService.getById(universeData.userId);
            setUniverseOwner(ownerData);
          }

          const universeContent = await contentService.getByUniverseWithUserProgress(universeId, user.id);
          setContent(universeContent);

          // Load hierarchy tree for tree view
          const hierarchy = await relationshipService.buildHierarchyTree(universeId);
          setHierarchyTree(hierarchy);
        } catch (error) {
          console.error('Error fetching universe:', error);
          setError('Error loading universe data');
        } finally {
          setUniverseLoading(false);
        }
      };

      fetchUniverseData();
    }
  }, [user, universeId, setUniverseProgress]);

  const handleDeleteUniverse = async () => {
    if (!universe || !user) return;
    
    setIsDeleting(true);
    try {
      await universeService.delete(universe.id, user.id);
      router.push('/');
    } catch (error) {
      console.error('Error deleting universe:', error);
      setError('Failed to delete universe');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading || universeLoading) {
    return <LoadingSpinner variant="fullscreen" message="Loading..." />;
  }

  if (!user) {
    router.push('/');
    return null;
  }

  if (error || !universe) {
    return (
      <div className="bg-surface-page">
        <Navigation variant="detail" />

        <PageContainer variant="wide">
          <div className="text-center py-12">
            <div className="bg-surface-card rounded-lg shadow p-8">
              <h3 className="text-lg font-medium text-danger mb-2">
                {error || 'Universe not found'}
              </h3>
              <ButtonLink
                variant="primary"
                href="/"
              >
                Back to Dashboard
              </ButtonLink>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  const isOwner = universe.userId === user.id;

  return (
    <div className="bg-surface-page">
      <Navigation 
        variant="detail"
        currentPage="dashboard"
        showNavigationMenu={true}
        showContentDropdown={isOwner && !universeLoading}
        universeId={universe.id}
        universeName={universe.name}
        actions={isOwner ? [
          { type: 'secondary', label: 'Edit', href: `/universes/${universe.id}/edit` },
          { type: 'danger', label: 'Delete', onClick: () => setShowDeleteConfirm(true) }
        ] : []}
      />

      <PageContainer variant="wide">
        <PageHeader
          variant="detail"
          title={universe.name}
          description={universe.description}
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: universe.name, isCurrentPage: true }
          ]}
          favourite={{
            targetId: universe.id,
            targetType: 'universe'
          }}
          metadata={
            <div className="flex flex-wrap items-center gap-2">
              <Badge 
                variant={universe.isPublic ? 'public' : 'private'}
                size="default"
              >
                {universe.isPublic ? 'Public' : 'Private'}
              </Badge>
              {isOwner ? (
                <Badge variant="owner" size="default">
                  Your Universe
                </Badge>
              ) : (
                <span className="text-sm text-tertiary">
                  By {universeOwner?.displayName || 'Unknown User'}
                </span>
              )}
              {universe.sourceLink && (
                <a 
                  href={universe.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Badge variant="info" size="default" className="!text-blue-700 hover:!text-blue-900">
                    Source: {universe.sourceLinkName || 'Reference'}
                  </Badge>
                </a>
              )}
            </div>
          }
          progressBar={{
            variant: 'organisational',
            value: universeProgress,
            label: 'Overall Progress'
          }}
          searchBar={content.length > 0 ? {
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: 'Search episodes, characters, locations...',
            variant: 'default'
          } : undefined}
        />

        {content.length === 0 ? (
          <EmptyState
            variant="default"
            title="No content yet"
            description="Start by adding individual content items, or create organisational groups like series and characters"
          />
        ) : filteredContent.length === 0 ? (
          <EmptyState
            variant="default"
            title="No matching content found"
            description="Try adjusting your search terms"
          />
        ) : (
          <ContentSection
            title="Content"
            content={content}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            contentHref={(item) => `/content/${item.id}?from=universe&universeId=${universe.id}&universeName=${encodeURIComponent(universe.name)}`}
            showFavourite={true}
            currentUserId={user?.id}
            hierarchyTree={hierarchyTree}
            searchQuery={searchQuery}
            filteredContent={filteredContent}
          />
        )}
      </PageContainer>

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Universe"
        itemName={universe?.name || ''}
        warningMessage="This will also delete all associated content"
        isDeleting={isDeleting}
        deleteButtonText="Delete Universe"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteUniverse}
      />
    </div>
  );
}