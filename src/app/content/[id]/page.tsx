'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { contentService, universeService } from '@/lib/services';
import { Content, Universe } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FavouriteButton } from '@/components';

export default function ContentPage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const [content, setContent] = useState<Content | null>(null);
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  if (error || !content || !universe) {
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
                {error || 'Content not found'}
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

  const isOwner = universe.userId === user.id;
  const progressPercent = content.progress || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-xl font-bold text-gray-900">
                CanonCore
              </Link>
              <span className="text-gray-400">/</span>
              <Link href={`/universes/${universe.id}`} className="text-blue-600 hover:text-blue-800">
                {universe.name}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">{content.name}</span>
            </div>
            {isOwner && (
              <div className="flex items-center space-x-2">
                <Link
                  href={`/universes/${content.universeId}/content/${content.id}/edit`}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Edit Content
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

      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full capitalize">
                  {content.mediaType}
                </span>
                <span className="text-sm text-gray-500">
                  {content.isViewable ? 'Viewable Content' : 'Organisational Content'}
                </span>
                {!universe.isPublic && (
                  <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    Private Universe
                  </span>
                )}
              </div>
            </div>
            <FavouriteButton 
              targetId={content.id} 
              targetType="content"
              className="text-gray-600 hover:text-red-500"
              showText={true}
            />
          </div>

          {content.description && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{content.description}</p>
            </div>
          )}

          {content.isViewable && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Viewing Progress</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Status</span>
                  <span>{progressPercent === 100 ? 'Completed' : 'Not Started'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleProgressUpdate(0)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      progressPercent === 0 
                        ? 'bg-gray-300 text-gray-800' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Not Started
                  </button>
                  <button
                    onClick={() => handleProgressUpdate(100)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      progressPercent === 100 
                        ? 'bg-green-300 text-green-800' 
                        : 'bg-green-200 hover:bg-green-300 text-green-800'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 pt-4">
            <div className="flex justify-between">
              <span>
                Created {new Date(content.createdAt.toDate()).toLocaleDateString()}
              </span>
              {content.updatedAt && (
                <span>
                  Last updated {new Date(content.updatedAt.toDate()).toLocaleDateString()}
                </span>
              )}
            </div>
            {content.lastAccessedAt && (
              <div className="mt-1">
                Last accessed {new Date(content.lastAccessedAt.toDate()).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Universe Context</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">{universe.name}</h4>
              {universe.description && (
                <p className="text-sm text-gray-600 mt-1">{universe.description}</p>
              )}
            </div>
            <Link
              href={`/universes/${universe.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              View Universe
            </Link>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete Content
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{content?.name}"? This action cannot be undone.
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
                onClick={handleDeleteContent}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete Content'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}