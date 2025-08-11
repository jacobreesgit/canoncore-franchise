'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { contentService, universeService, relationshipService } from '@/lib/services';
import { Content, Universe } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const mediaTypeOptions: { value: Content['mediaType']; label: string; description: string }[] = [
  { value: 'video', label: 'Video', description: 'Movies, TV episodes, web series' },
  { value: 'audio', label: 'Audio', description: 'Podcasts, audiobooks, audio dramas' },
  { value: 'text', label: 'Text', description: 'Books, comics, articles' },
  { value: 'character', label: 'Character', description: 'People, aliens, creatures' },
  { value: 'location', label: 'Location', description: 'Places, planets, buildings' },
  { value: 'item', label: 'Item', description: 'Objects, weapons, technology' },
  { value: 'event', label: 'Event', description: 'Historical events, battles' },
  { value: 'collection', label: 'Collection', description: 'Series, phases, story arcs' },
];

export default function EditContentPage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const universeId = params.id as string;
  const contentId = params.contentId as string;

  const [content, setContent] = useState<Content | null>(null);
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [existingContent, setExistingContent] = useState<Content[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isViewable: false,
    mediaType: 'character' as Content['mediaType'],
  });
  const [contentLoading, setContentLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-update isViewable when mediaType changes
  useEffect(() => {
    const isViewableMediaType = ['video', 'audio', 'text'].includes(formData.mediaType);
    setFormData(prev => ({
      ...prev,
      isViewable: isViewableMediaType
    }));
  }, [formData.mediaType]);

  useEffect(() => {
    if (user && contentId) {
      const fetchContentAndUniverse = async () => {
        try {
          const contentData = await contentService.getById(contentId);
          if (!contentData) {
            setError('Content not found');
            return;
          }

          if (contentData.userId !== user.id) {
            setError('You do not have permission to edit this content');
            return;
          }

          setContent(contentData);
          setFormData({
            name: contentData.name,
            description: contentData.description,
            isViewable: contentData.isViewable,
            mediaType: contentData.mediaType,
          });

          // Fetch universe data for navigation  
          const universeData = await universeService.getById(universeId);
          if (universeData) {
            setUniverse(universeData);
          }

          // Load existing content for parent selection
          const allContent = await contentService.getByUniverse(universeId);
          setExistingContent(allContent.filter(c => c.id !== contentId)); // Exclude current content

          // Find current parent relationship
          const relationships = await relationshipService.getParents(contentId);
          const parentRelationship = relationships.find((rel: any) => rel.contentId === contentId);
          if (parentRelationship) {
            setSelectedParentId(parentRelationship.parentId);
          }
        } catch (error) {
          console.error('Error fetching content:', error);
          setError('Error loading content data');
        } finally {
          setContentLoading(false);
        }
      };

      fetchContentAndUniverse();
    }
  }, [user, contentId, universeId]);

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

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error || 'Content not found'}</div>
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.name.trim()) {
        throw new Error('Content name is required');
      }

      await contentService.update(contentId, user.id, formData);

      // Handle parent relationship updates if content exists
      if (content) {
        // Get current parent relationship
        const currentRelationships = await relationshipService.getParents(contentId);
        const currentParentRelationship = currentRelationships.find((rel: any) => rel.contentId === contentId);
        const currentParentId = currentParentRelationship?.parentId || '';

        // If parent changed, update relationship
        if (selectedParentId !== currentParentId) {
          // Remove old relationship if exists
          if (currentParentRelationship) {
            await relationshipService.removeRelationship(currentParentRelationship.id, user.id);
          }

          // Create new relationship if parent is selected
          if (selectedParentId) {
            await relationshipService.createRelationship(
              user.id,
              universeId,
              selectedParentId,
              contentId
            );
          }
        }
      }

      router.push(`/content/${contentId}`);
    } catch (error) {
      console.error('Error updating content:', error);
      setError(error instanceof Error ? error.message : 'Error updating content');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const selectedMediaType = mediaTypeOptions.find(option => option.value === formData.mediaType);
  const isViewableContent = ['video', 'audio', 'text'].includes(formData.mediaType);

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
              {universe && (
                <>
                  <Link href={`/universes/${universe.id}`} className="text-blue-600 hover:text-blue-800">
                    {universe.name}
                  </Link>
                  <span className="text-gray-400">/</span>
                </>
              )}
              <Link href={`/content/${contentId}`} className="text-blue-600 hover:text-blue-800">
                {content.name}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Edit</span>
            </div>
            <Link
              href={`/content/${contentId}`}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Edit Content: {content.name}
            </h1>
            <p className="text-gray-600">
              Update the details of this content. Remember, only catalogue established content from real franchises.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Content Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Iron Man, The Eleventh Hour, Tony Stark"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe this content, its role in the franchise, key details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="mediaType" className="block text-sm font-medium text-gray-700 mb-1">
                Content Type *
              </label>
              <select
                id="mediaType"
                name="mediaType"
                value={formData.mediaType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {mediaTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
              {selectedMediaType && (
                <p className="mt-1 text-sm text-gray-500">
                  {isViewableContent ? 
                    'This content can be marked as watched and will contribute to progress tracking.' :
                    'This is organisational content that helps organise the franchise but cannot be marked as watched.'
                  }
                </p>
              )}
            </div>

            <div>
              <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-1">
                Parent Content (Optional)
              </label>
              <select
                id="parentId"
                name="parentId"
                value={selectedParentId}
                onChange={(e) => setSelectedParentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">No parent (top-level content)</option>
                {existingContent
                  .filter(content => !content.isViewable) // Only organisational content can be parents
                  .map((content) => (
                    <option key={content.id} value={content.id}>
                      {content.name} ({content.mediaType})
                    </option>
                  ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Choose a parent organisational item to organise this content.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link
                href={`/content/${contentId}`}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}