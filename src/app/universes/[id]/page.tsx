'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { universeService, contentService, relationshipService, userService } from '@/lib/services';
import { Universe, Content, User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { useSearch } from '@/lib/hooks/useSearch';
import Link from 'next/link';
import { FavouriteButton, Navigation, PageHeader, DeleteConfirmationModal, EmptyState, Button, ButtonLink, LoadingSpinner, PageContainer, Badge, ContentSection } from '@/components';

export default function UniversePage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const universeId = params.id as string;

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
  }, [user, universeId]);

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
      <div className="min-h-screen bg-surface-page">
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
    <div className="min-h-screen bg-surface-page">
      <Navigation 
        variant="detail"
        currentPage="dashboard"
        showNavigationMenu={true}
        showContentDropdown={isOwner && !universeLoading && content.length > 0}
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
            </div>
          }
          progressBar={{
            variant: 'organisational',
            value: universe.progress || 0,
            label: 'Overall Progress'
          }}
          extraContent={
            <div>
              {universe.sourceLink && (
                <div className="mb-4 p-3 bg-[var(--color-status-info-background)] border border-blue-200 rounded-lg">
                  <div className="flex flex-wrap items-center gap-2">
                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M14 2l6 6m0 0l-3-3m3 3l-3 3" />
                    </svg>
                    <span className="text-sm text-[var(--color-status-info-text)] font-medium">Source Reference</span>
                  </div>
                  <a 
                    href={universe.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link hover:text-link-hover underline mt-1 block"
                  >
                    {universe.sourceLinkName || universe.sourceLink}
                  </a>
                </div>
              )}


            </div>
          }
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
            showUnorganized={true}
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

// Tree component and helper functions are now extracted to /src/components/content/Tree.tsx and /src/lib/utils/hierarchy.ts