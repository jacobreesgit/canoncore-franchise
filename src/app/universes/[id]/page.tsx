'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { universeService, contentService, relationshipService, userService } from '@/lib/services';
import { Universe, Content, User } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FavouriteButton } from '@/components';

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  if (error || !universe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-xl font-bold text-gray-900">
                CanonCore
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-lg font-medium text-red-600 mb-2">
                {error || 'Universe not found'}
              </h3>
              <Link
                href="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const viewableContent = content.filter(c => c.isViewable);
  const organisationalContent = content.filter(c => !c.isViewable);
  const isOwner = universe.userId === user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-gray-900">
                CanonCore
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">{universe.name}</span>
            </div>
            {isOwner && (
              <div className="flex items-center space-x-2">
                <Link
                  href={`/universes/${universe.id}/content/create`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Add Content
                </Link>
                <Link
                  href={`/universes/${universe.id}/edit`}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Edit Universe
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{universe.name}</h1>
              <div className="flex items-center space-x-2">
                <FavouriteButton 
                  targetId={universe.id} 
                  targetType="universe"
                  className="text-gray-600 hover:text-red-500"
                  showText={true}
                />
                <span className={`text-sm px-3 py-1 rounded-full ${
                  universe.isPublic 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {universe.isPublic ? 'Public' : 'Private'}
                </span>
                <span className="text-sm text-gray-500">
                  {isOwner ? 'Your Universe' : `By ${universeOwner?.displayName || 'Unknown User'}`}
                </span>
              </div>
            </div>
            
            {universe.description && (
              <p className="text-gray-600 mb-4">{universe.description}</p>
            )}

            {universe.sourceLink && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M14 2l6 6m0 0l-3-3m3 3l-3 3" />
                  </svg>
                  <span className="text-sm text-blue-800 font-medium">Source Reference</span>
                </div>
                <a 
                  href={universe.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline mt-1 block"
                >
                  {universe.sourceLinkName || universe.sourceLink}
                </a>
              </div>
            )}

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(universe.progress || 0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${universe.progress || 0}%` }}
                />
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Created {new Date(universe.createdAt.toDate()).toLocaleDateString()}
              {universe.updatedAt && (
                <span> • Last updated {new Date(universe.updatedAt.toDate()).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>

        {content.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No content yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start by adding episodes, movies, characters, or other content to this universe
              </p>
              {isOwner && (
                <Link
                  href={`/universes/${universe.id}/content/create`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Add First Content
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Content</h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grid View
                </button>
                <button
                  onClick={() => setViewMode('tree')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'tree' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tree View
                </button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <>
                {viewableContent.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Viewable Content</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {viewableContent.map((item) => (
                    <Link
                      key={item.id}
                      href={`/content/${item.id}`}
                      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span className="capitalize">{item.mediaType}</span>
                          <span>
                            {item.isViewable 
                              ? `${Math.round(item.progress || 0)}% watched`
                              : `${Math.round(item.calculatedProgress || 0)}% complete`
                            }
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${item.isViewable ? 'bg-green-600' : 'bg-blue-600'}`}
                            style={{ 
                              width: `${item.isViewable 
                                ? (item.progress || 0)
                                : (item.calculatedProgress || 0)
                              }%` 
                            }}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {organisationalContent.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Organisational Content</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {organisationalContent.map((item) => (
                    <Link
                      key={item.id}
                      href={`/content/${item.id}`}
                      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span className="capitalize">{item.mediaType}</span>
                          <span>{Math.round(item.calculatedProgress || 0)}% complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${item.calculatedProgress || 0}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                </div>
                )}
              </>
            ) : (
              /* Tree View */
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Content Hierarchy</h2>
                {hierarchyTree.length > 0 ? (
                  <div className="space-y-2">
                    {hierarchyTree.map((node, index) => (
                      <TreeNode key={`root-${node.contentId}-${index}`} node={node} content={content} depth={0} />
                    ))}
                    
                    {/* Show unorganized content (no parent relationships) */}
                    {content.filter(item => {
                      const hasParent = hierarchyTree.some(node => hasContentInTree(node, item.id));
                      return !hasParent;
                    }).length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Unorganized Content</h3>
                        <div className="space-y-1">
                          {content.filter(item => {
                            const hasParent = hierarchyTree.some(node => hasContentInTree(node, item.id));
                            return !hasParent;
                          }).map((item) => (
                            <Link
                              key={item.id}
                              href={`/content/${item.id}`}
                              className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <span className="text-sm text-gray-600 capitalize mr-2">{item.mediaType}</span>
                              <span className="font-medium text-gray-900">{item.name}</span>
                              {item.isViewable ? (
                                <span className={`ml-auto text-xs ${(item.progress || 0) > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                                  {Math.round(item.progress || 0)}% watched
                                </span>
                              ) : (
                                <span className={`ml-auto text-xs ${(item.calculatedProgress || 0) > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
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
                  <p className="text-gray-500">No hierarchical relationships defined yet. Create relationships by setting parent content when adding new items.</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete Universe
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{universe?.name}"? This action cannot be undone and will also delete all associated content.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUniverse}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete Universe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Tree node component for hierarchical content display
function TreeNode({ node, content, depth }: { node: any; content: Content[]; depth: number }) {
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
        className="flex items-center hover:bg-gray-50 rounded-lg transition-colors"
        style={{ paddingLeft: `${indentation}px` }}
      >
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 mr-1 hover:bg-gray-200 rounded transition-colors"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {!hasChildren && <div className="w-6" />}
        
        <Link
          href={`/content/${nodeContent.id}`}
          className="flex items-center flex-1 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-sm text-gray-600 capitalize mr-2">{nodeContent.mediaType}</span>
          <span className="font-medium text-gray-900">{nodeContent.name}</span>
          {nodeContent.isViewable ? (
            <span className={`ml-auto text-xs ${(nodeContent.progress || 0) > 0 ? 'text-green-600' : 'text-gray-500'}`}>
              {Math.round(nodeContent.progress || 0)}% watched
            </span>
          ) : (
            <span className={`ml-auto text-xs ${(nodeContent.calculatedProgress || 0) > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
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