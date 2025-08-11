'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { contentService, universeService, relationshipService } from '@/lib/services';
import { CreateContentData, Universe, Content } from '@/lib/types';
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

export default function CreateContentPage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const universeId = params.id as string;

  const [universe, setUniverse] = useState<Universe | null>(null);
  const [universeLoading, setUniverseLoading] = useState(true);
  const [existingContent, setExistingContent] = useState<Content[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [formData, setFormData] = useState<CreateContentData>({
    name: '',
    description: '',
    isViewable: false,
    mediaType: 'character',
  });

  // Auto-update isViewable when mediaType changes
  useEffect(() => {
    const isViewableMediaType = ['video', 'audio', 'text'].includes(formData.mediaType);
    setFormData(prev => ({
      ...prev,
      isViewable: isViewableMediaType
    }));
  }, [formData.mediaType]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && universeId) {
      const fetchUniverse = async () => {
        try {
          const universeData = await universeService.getById(universeId);
          if (!universeData) {
            setError('Universe not found');
            return;
          }

          if (universeData.userId !== user.id) {
            setError('You do not have permission to add content to this universe');
            return;
          }

          setUniverse(universeData);

          // Load existing content for parent selection
          const content = await contentService.getByUniverse(universeId);
          setExistingContent(content);
        } catch (error) {
          console.error('Error fetching universe:', error);
          setError('Error loading universe data');
        } finally {
          setUniverseLoading(false);
        }
      };

      fetchUniverse();
    }
  }, [user, universeId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.name.trim()) {
        throw new Error('Content name is required');
      }

      const newContent = await contentService.create(
        user.id,
        universeId,
        formData
      );

      // Create hierarchical relationship if parent is selected
      if (selectedParentId) {
        await relationshipService.createRelationship(
          user.id,
          universeId,
          selectedParentId,
          newContent.id
        );
      }

      router.push(`/content/${newContent.id}`);
    } catch (error) {
      console.error('Error creating content:', error);
      setError(error instanceof Error ? error.message : 'Error creating content');
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
              <Link href={`/universes/${universeId}`} className="text-blue-600 hover:text-blue-800">
                {universe.name}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Add Content</span>
            </div>
            <Link
              href={`/universes/${universeId}`}
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
              Add Content to {universe.name}
            </h1>
            <p className="text-gray-600">
              Add episodes, movies, characters, locations, or other content from this existing franchise.
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
                placeholder={
                  formData.mediaType === 'character' ? 'e.g. Tony Stark, The Doctor' :
                  formData.mediaType === 'location' ? 'e.g. Stark Tower, TARDIS' :
                  formData.mediaType === 'video' ? 'e.g. Iron Man, The Eleventh Hour' :
                  'e.g. Content name'
                }
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
                href={`/universes/${universeId}`}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Adding...' : 'Add Content'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}