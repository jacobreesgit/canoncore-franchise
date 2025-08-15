'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { contentService, universeService, relationshipService } from '@/lib/services';
import { CreateContentData, Universe, Content } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FormActions, Navigation, PageHeader, LoadingSpinner, ErrorMessage, FormLabel, FormInput, FormTextarea, FormSelect, PageContainer, ButtonLink } from '@/components';

const viewableMediaTypes: { value: Content['mediaType']; label: string; description: string }[] = [
  { 
    value: 'video', 
    label: 'Movies & Episodes', 
    description: 'Films, TV episodes, web series'
  },
  { 
    value: 'audio', 
    label: 'Audio Content', 
    description: 'Podcasts, audiobooks, audio dramas'
  },
  { 
    value: 'text', 
    label: 'Books & Comics', 
    description: 'Books, comics, articles, graphic novels'
  },
];

export default function AddViewableContentPage() {
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
    isViewable: true, // Always true for this flow
    mediaType: 'video',
  });

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

          // Load existing content for parent selection (only organisational content)
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
    return <LoadingSpinner variant="fullscreen" message="Loading..." />;
  }

  if (!user) {
    router.push('/');
    return null;
  }

  if (error || !universe) {
    return (
      <div className="min-h-screen bg-surface-page">
        <Navigation 
          variant="detail"
          currentPage="dashboard"
          showNavigationMenu={true}
        />

        <PageContainer variant="wide">
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-lg font-medium text-red-600 mb-2">
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

      // Reset form after successful creation
      setFormData({
        name: '',
        description: '',
        isViewable: true,
        mediaType: 'video',
      });
      setSelectedParentId('');
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const organisationalParents = existingContent.filter(content => !content.isViewable);

  return (
    <div className="min-h-screen bg-surface-page">
      <Navigation 
        variant="detail"
        currentPage="dashboard"
        showNavigationMenu={true}
      />

      <PageContainer variant="narrow">
        <PageHeader
          variant="form"
          title={`Add Content Item to ${universe.name}`}
          description="Add movies, TV episodes, books, or other watchable content from this franchise that you can track progress on."
        />

        <div className="bg-white rounded-lg shadow p-6">

          <ErrorMessage variant="form" message={error} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <FormLabel htmlFor="name">
                Content Title *
              </FormLabel>
              <FormInput
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder={
                  formData.mediaType === 'video' ? 'e.g. Iron Man, The Eleventh Hour, A New Hope' :
                  formData.mediaType === 'audio' ? 'e.g. The Lost Stories, Marvel Podcast Episode 1' :
                  formData.mediaType === 'text' ? 'e.g. The Hobbit, Amazing Spider-Man #1' :
                  'e.g. Content title'
                }
              />
            </div>

            <div>
              <FormLabel htmlFor="description">
                Description
              </FormLabel>
              <FormTextarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what happens in this episode/movie, key plot points, characters introduced..."
              />
            </div>

            <div>
              <FormLabel htmlFor="mediaType">
                Content Type *
              </FormLabel>
              <FormSelect
                id="mediaType"
                name="mediaType"
                value={formData.mediaType}
                onChange={handleInputChange}
              >
                {viewableMediaTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FormSelect>
            </div>

            {organisationalParents.length > 0 && (
              <div>
                <FormLabel htmlFor="parentId">
                  Part of Series/Collection (Optional)
                </FormLabel>
                <FormSelect
                  id="parentId"
                  name="parentId"
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                >
                  <option value="">Standalone content</option>
                  {organisationalParents.map((content) => (
                    <option key={content.id} value={content.id}>
                      {content.name} ({content.mediaType})
                    </option>
                  ))}
                </FormSelect>
                <p className="mt-1 text-sm text-gray-500">
                  Choose if this content belongs to a series, phase, or collection you&apos;ve already created.
                </p>
              </div>
            )}

            <FormActions
              variant="add"
              cancelHref={`/universes/${universeId}`}
              isSubmitting={isSubmitting}
            />
          </form>

          {/* Quick action to organise content instead */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Need to organise content instead?
              </p>
              <ButtonLink
                variant="secondary"
                href={`/universes/${universeId}/content/organise`}
              >
                Add Organisation Group →
              </ButtonLink>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}