'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { contentService, universeService, relationshipService } from '@/lib/services';
import { Content, Universe } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import Link from 'next/link';
import { FavouriteButton, Navigation, PageHeader, DeleteConfirmationModal, ProgressBar, Button, ButtonLink, LoadingSpinner, PageContainer, Badge, ContentSection } from '@/components';

export default function ContentPage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const [content, setContent] = useState<Content | null>(null);
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [allContent, setAllContent] = useState<Content[]>([]);
  const [hierarchyTree, setHierarchyTree] = useState<any[]>([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Set dynamic page title
  usePageTitle(content?.name || 'Content', content);

  useEffect(() => {
    if (user && contentId) {
      const fetchContentData = async () => {
        try {
          setContentLoading(true);
          
          const contentData = await contentService.getByIdWithUserProgress(contentId, user.id);
          if (!contentData) {
            setError('Content not found');
            return;
          }

          setContent(contentData);

          const universeData = await universeService.getById(contentData.universeId);
          if (!universeData) {
            setError('Universe not found');
            return;
          }

          if (!universeData.isPublic && universeData.userId !== user.id) {
            setError('You do not have permission to view this content');
            return;
          }

          setUniverse(universeData);

          // Fetch all content and hierarchy for contextual tree
          const universeContent = await contentService.getByUniverseWithUserProgress(contentData.universeId, user.id);
          setAllContent(universeContent);

          const hierarchy = await relationshipService.buildHierarchyTree(contentData.universeId);
          setHierarchyTree(hierarchy);
        } catch (error) {
          console.error('Error fetching content:', error);
          setError('Error loading content data');
        } finally {
          setContentLoading(false);
        }
      };

      fetchContentData();
    }
  }, [user, contentId]);

  const handleProgressUpdate = async (newProgress: number) => {
    if (!content || !content.isViewable || !user) return;
    
    try {
      await contentService.updateUserProgress(contentId, user.id, newProgress);
      setContent({ ...content, progress: newProgress });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleDeleteContent = async () => {
    if (!content || !user) return;
    
    setIsDeleting(true);
    try {
      await contentService.delete(content.id, user.id);
      router.push(`/universes/${content.universeId}`);
    } catch (error) {
      console.error('Error deleting content:', error);
      setError('Failed to delete content');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading || contentLoading) {
    return <LoadingSpinner variant="fullscreen" message="Loading..." />;
  }

  if (!user) {
    router.push('/');
    return null;
  }

  if (error || !content || !universe) {
    return (
      <div className="min-h-screen bg-surface-page">
        <Navigation variant="detail" />

        <PageContainer variant="wide">
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-lg font-medium text-red-600 mb-2">
                {error || 'Content not found'}
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
  const progressPercent = content.progress || 0;

  return (
    <div className="min-h-screen bg-surface-page">
      <Navigation 
        variant="detail"
        currentPage="dashboard"
        showNavigationMenu={true}
        showContentDropdown={isOwner && !content.isViewable}
        universeId={content.universeId}
        universeName={universe?.name}
        parentContentId={content.id}
        actions={isOwner ? [
          { type: 'secondary', label: 'Edit', href: `/universes/${content.universeId}/content/${content.id}/edit` },
          { type: 'danger', label: 'Delete', onClick: () => setShowDeleteConfirm(true) }
        ] : []}
      />

      <PageContainer variant="wide">
        <PageHeader
          variant="detail"
          title={content.name}
          description={content.description}
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: universe.name, href: `/universes/${universe.id}` },
            { label: content.name, isCurrentPage: true }
          ]}
          favourite={{
            targetId: content.id,
            targetType: 'content'
          }}
          metadata={
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="organisational" size="default" className="capitalize">
                {content.mediaType}
              </Badge>
              <Badge variant="info" size="default">
                {content.isViewable ? 'Viewable Content' : 'Organisational Content'}
              </Badge>
              {!universe.isPublic && (
                <Badge variant="private" size="default">
                  Private Universe
                </Badge>
              )}
            </div>
          }
          progressBar={{
            variant: content.isViewable ? 'viewable' : 'organisational',
            value: content.isViewable ? (content.progress || 0) : (content.calculatedProgress || 0),
            label: content.isViewable ? 'Progress' : 'Overall Progress'
          }}
          extraContent={
            <div>
              {content.isViewable && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Update Progress</h3>
                  <div className="flex gap-3">
                    <Button
                      variant={progressPercent === 0 ? "secondary" : "secondary"}
                      onClick={() => handleProgressUpdate(0)}
                      className={progressPercent === 0 ? 'bg-gray-300 text-gray-800' : ''}
                    >
                      Not Started
                    </Button>
                    <Button
                      variant={progressPercent === 100 ? "primary" : "secondary"}
                      onClick={() => handleProgressUpdate(100)}
                      className={progressPercent === 100 ? 'bg-green-300 text-green-800' : 'bg-green-200 hover:bg-green-300 text-green-800 cursor-pointer'}
                    >
                      Completed
                    </Button>
                  </div>
                </div>
              )}

            </div>
          }
        />

        {hierarchyTree.length > 0 && (
          <div>
            <ContentSection
              title="Universe Context"
              content={allContent}
              viewMode="tree"
              onViewModeChange={() => {}} // Content pages always show tree view
              contentHref={(item) => `/content/${item.id}?from=universe&universeId=${universe.id}&universeName=${encodeURIComponent(universe.name)}`}
              showFavourite={true}
              currentUserId={user?.id}
              hierarchyTree={hierarchyTree}
              highlightedContentId={content.id}
              showUnorganized={false}
              hideViewToggle={true}
              className="content-context-section"
              actions={
                <Link
                  href={`/universes/${universe.id}?from=content&contentId=${content.id}&contentName=${encodeURIComponent(content.name)}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  View Full Universe
                </Link>
              }
            />
          </div>
        )}
      </PageContainer>

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        title="Delete Content"
        itemName={content?.name || ''}
        isDeleting={isDeleting}
        deleteButtonText="Delete Content"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteContent}
      />
    </div>
  );
}