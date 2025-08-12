'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { universeService, contentService, relationshipService, userService } from '@/lib/services';
import { Universe, Content, User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import Link from 'next/link';
import { FavouriteButton, Navigation, PageHeader, DeleteConfirmationModal, EmptyState, Button, ViewToggle, LoadingSpinner, PageContainer, Badge, CardGrid } from '@/components';

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
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');
  const [hierarchyTree, setHierarchyTree] = useState<any[]>([]);

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
              <Link
                href="/"
                className="inline-block bg-[var(--button-primary-background)] hover:bg-[var(--button-primary-background-hover)] text-on-primary font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Back to Dashboard
              </Link>
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
          metadata={
            <div className="flex items-center space-x-2">
              <FavouriteButton 
                targetId={universe.id} 
                targetType="universe"
                className="text-secondary hover:text-red-500"
                showText={true}
              />
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
                  <div className="flex items-center space-x-2">
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
          actions={isOwner ? [
            { type: 'primary', label: 'Add Content', href: `/universes/${universe.id}/content/create` },
            { type: 'secondary', label: 'Edit Universe', href: `/universes/${universe.id}/edit` },
            { type: 'danger', label: 'Delete', onClick: () => setShowDeleteConfirm(true) }
          ] : []}
        />

        {content.length === 0 ? (
          <EmptyState
            variant="default"
            title="No content yet"
            description="Start by adding episodes, movies, characters, or other content to this universe"
            actionText={isOwner ? "Add First Content" : undefined}
            actionHref={isOwner ? `/universes/${universe.id}/content/create` : undefined}
            showAction={isOwner}
          />
        ) : (
          <div className="space-y-8">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Content</h2>
              <ViewToggle
                value={viewMode}
                onChange={(value) => setViewMode(value as 'grid' | 'tree')}
                options={[
                  { value: 'grid', label: 'Grid View' },
                  { value: 'tree', label: 'Tree View' }
                ]}
              />
            </div>

            {viewMode === 'grid' ? (
              <CardGrid 
                variant="default"
                content={content}
                contentHref={(item) => `/content/${item.id}?from=universe&universeId=${universe.id}&universeName=${encodeURIComponent(universe.name)}`}
                sortContent={true}
              />
            ) : (
              /* Tree View */
              <div className="bg-surface-card rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-primary mb-4">Content Hierarchy</h2>
                {hierarchyTree.length > 0 ? (
                  <div className="space-y-2">
                    {hierarchyTree.map((node, index) => (
                      <TreeNode key={`root-${node.contentId}-${index}`} node={node} content={content} universe={universe} depth={0} />
                    ))}
                    
                    {/* Show unorganized content (no parent relationships) */}
                    {content.filter(item => {
                      const hasParent = hierarchyTree.some(node => hasContentInTree(node, item.id));
                      return !hasParent;
                    }).length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-secondary mb-2">Unorganized Content</h3>
                        <div className="space-y-1">
                          {content.filter(item => {
                            const hasParent = hierarchyTree.some(node => hasContentInTree(node, item.id));
                            return !hasParent;
                          }).map((item) => (
                            <Link
                              key={item.id}
                              href={`/content/${item.id}?from=universe&universeId=${universe.id}&universeName=${encodeURIComponent(universe.name)}`}
                              className="flex items-center p-2 hover:bg-surface-page rounded-lg transition-colors"
                            >
                              <span className="text-sm text-secondary capitalize mr-2">{item.mediaType}</span>
                              <span className="font-medium text-primary">{item.name}</span>
                              {item.isViewable ? (
                                <span className={`ml-auto text-xs ${(item.progress || 0) > 0 ? 'text-green-600' : 'text-tertiary'}`}>
                                  {Math.round(item.progress || 0)}% watched
                                </span>
                              ) : (
                                <span className={`ml-auto text-xs ${(item.calculatedProgress || 0) > 0 ? 'text-blue-600' : 'text-tertiary'}`}>
                                  {Math.round(item.calculatedProgress || 0)}% complete
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <EmptyState
                    variant="hierarchical"
                    title="No hierarchical relationships defined yet. Create relationships by setting parent content when adding new items."
                    description=""
                  />
                )}
              </div>
            )}
          </div>
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

// Tree node component for hierarchical content display
function TreeNode({ node, content, universe, depth }: { node: any; content: Content[]; universe: Universe; depth: number }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const nodeContent = content.find(c => c.id === node.contentId);
  
  if (!nodeContent) {
    return null;
  }
  
  const hasChildren = node.children && node.children.length > 0;
  const indentation = depth * 24;
  
  return (
    <div>
      <div 
        className="flex items-center hover:bg-surface-page rounded-lg transition-colors"
        style={{ paddingLeft: `${indentation}px` }}
      >
        {hasChildren && (
          <Button
            variant="secondary"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 mr-1 hover:bg-[var(--color-interactive-secondary)] rounded transition-colors min-w-0"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        )}
        {!hasChildren && <div className="w-6" />}
        
        <Link
          href={`/content/${nodeContent.id}?from=universe&universeId=${universe.id}&universeName=${encodeURIComponent(universe.name)}`}
          className="flex items-center flex-1 p-2 hover:bg-surface-page rounded-lg transition-colors"
        >
          <span className="text-sm text-secondary capitalize mr-2">{nodeContent.mediaType}</span>
          <span className="font-medium text-primary">{nodeContent.name}</span>
          {nodeContent.isViewable ? (
            <span className={`ml-auto text-xs ${(nodeContent.progress || 0) > 0 ? 'text-green-600' : 'text-tertiary'}`}>
              {Math.round(nodeContent.progress || 0)}% watched
            </span>
          ) : (
            <span className={`ml-auto text-xs ${(nodeContent.calculatedProgress || 0) > 0 ? 'text-blue-600' : 'text-tertiary'}`}>
              {Math.round(nodeContent.calculatedProgress || 0)}% complete
            </span>
          )}
        </Link>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((childNode: any, index: number) => (
            <TreeNode 
              key={`${depth}-${childNode.contentId}-${index}`} 
              node={childNode} 
              content={content} 
              universe={universe}
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to check if content exists in tree
function hasContentInTree(node: any, contentId: string): boolean {
  if (node.contentId === contentId) {
    return true;
  }
  
  if (node.children) {
    return node.children.some((child: any) => hasContentInTree(child, contentId));
  }
  
  return false;
}