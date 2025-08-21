'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { contentService, universeService, relationshipService } from '@/lib/services';
import { CreateContentData, Universe, Content } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormActions, Navigation, PageHeader, LoadingSpinner, ErrorMessage, FormLabel, FormInput, FormTextarea, FormSelect, PageContainer, ButtonLink } from '@/components';
import { calculateMaxDepth, buildContentPath } from '@/lib/utils/hierarchy';

const organisationalMediaTypes: { value: Content['mediaType']; label: string; description: string }[] = [
  { 
    value: 'collection', 
    label: 'Series & Collections', 
    description: 'Group related content together'
  },
  { 
    value: 'character', 
    label: 'Characters', 
    description: 'People, aliens, creatures, heroes, villains'
  },
  { 
    value: 'location', 
    label: 'Locations', 
    description: 'Places, planets, buildings, ships'
  },
  { 
    value: 'item', 
    label: 'Items & Technology', 
    description: 'Objects, weapons, technology, artifacts'
  },
  { 
    value: 'event', 
    label: 'Events', 
    description: 'Historical events, battles, key moments'
  },
];

export default function OrganiseContentPage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const universeId = params.id as string;
  const parentContentId = searchParams.get('parent');

  const [universe, setUniverse] = useState<Universe | null>(null);
  const [universeLoading, setUniverseLoading] = useState(true);
  const [existingContent, setExistingContent] = useState<Content[]>([]);
  const [hierarchyTree, setHierarchyTree] = useState<any[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string>('');
  const [suggestedParent, setSuggestedParent] = useState<Content | null>(null);
  const [formData, setFormData] = useState<CreateContentData>({
    name: '',
    description: '',
    isViewable: false, // Always false for this flow
    mediaType: 'collection',
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

          // Load hierarchy tree for depth validation
          const hierarchy = await relationshipService.buildHierarchyTree(universeId);
          setHierarchyTree(hierarchy);

          // Validate and set suggested parent from URL parameter
          if (parentContentId) {
            const suggestedParentContent = content.find(c => c.id === parentContentId);
            // Validate: parent must exist, be organisational (not viewable), same universe
            if (suggestedParentContent && 
                !suggestedParentContent.isViewable && 
                suggestedParentContent.universeId === universeId) {
              setSuggestedParent(suggestedParentContent);
              setSelectedParentId(parentContentId);
            }
          }
        } catch (error) {
          console.error('Error fetching universe:', error);
          setError('Error loading universe data');
        } finally {
          setUniverseLoading(false);
        }
      };

      fetchUniverse();
    }
  }, [user, universeId, parentContentId]);

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

      // Validate parent selection if provided
      if (selectedParentId) {
        const selectedParent = existingContent.find(c => c.id === selectedParentId);
        if (!selectedParent) {
          throw new Error('Selected parent content not found');
        }
        if (selectedParent.isViewable) {
          throw new Error('Parent content must be organisational (not viewable)');
        }
        if (selectedParent.universeId !== universeId) {
          throw new Error('Parent content must be in the same universe');
        }
      }

      // No depth restrictions - unlimited hierarchy depth

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

      // Navigate to newly created content page
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const organisationalParents = existingContent.filter(content => !content.isViewable);

  return (
    <div className="bg-surface-page">
      <Navigation 
        variant="detail"
        currentPage="dashboard"
        showNavigationMenu={true}
      />

      <PageContainer variant="narrow">
        <PageHeader
          variant="form"
          title={`Add Organisation Group to ${universe.name}`}
          description="Create series, characters, locations, and other organisational groups to help structure your franchise."
        />

        <div className="bg-white rounded-lg shadow p-6">

          <ErrorMessage variant="form" message={error} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <FormLabel htmlFor="name">
                Name *
              </FormLabel>
              <FormInput
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder={
                  formData.mediaType === 'character' ? 'e.g. Tony Stark, The Doctor, Luke Skywalker' :
                  formData.mediaType === 'location' ? 'e.g. Stark Tower, TARDIS, Death Star' :
                  formData.mediaType === 'collection' ? 'e.g. Phase One, Season 1, The Original Trilogy' :
                  formData.mediaType === 'item' ? 'e.g. Arc Reactor, Sonic Screwdriver, Lightsaber' :
                  formData.mediaType === 'event' ? 'e.g. Battle of New York, Time War, Order 66' :
                  'e.g. Content name'
                }
              />
            </div>

            <div>
              <FormLabel htmlFor="mediaType">
                Organisation Type *
              </FormLabel>
              <FormSelect
                id="mediaType"
                name="mediaType"
                value={formData.mediaType}
                onChange={handleInputChange}
              >
                {organisationalMediaTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FormSelect>
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
                placeholder={
                  formData.mediaType === 'character' ? 'Describe this character, their role, key traits, relationships...' :
                  formData.mediaType === 'location' ? 'Describe this location, its significance, what happens there...' :
                  formData.mediaType === 'collection' ? 'Describe what this collection contains, the overarching theme...' :
                  formData.mediaType === 'item' ? 'Describe this item, its powers, significance, who uses it...' :
                  formData.mediaType === 'event' ? 'Describe this event, when it happened, its impact...' :
                  'Describe this content and its role in the franchise...'
                }
              />
            </div>

            {organisationalParents.length > 0 && (
              <div>
                <FormLabel htmlFor="parentId">
                  Parent Content (Optional)
                  {suggestedParent && (
                    <span className="ml-2 text-sm font-normal text-blue-600">
                      • Suggested from context
                    </span>
                  )}
                </FormLabel>
                <FormSelect
                  id="parentId"
                  name="parentId"
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                >
                  <option value="">Top-level organisation</option>
                  {organisationalParents.map((content) => (
                    <option key={content.id} value={content.id}>
                      {content.name} ({content.mediaType})
                      {content.id === suggestedParent?.id ? '' : ''}
                    </option>
                  ))}
                </FormSelect>
                <p className="mt-1 text-sm text-gray-500">
                  {suggestedParent ? (
                    <>
                      <strong>&quot;{suggestedParent.name}&quot;</strong> is pre-selected based on your navigation context. You can change this if needed.
                    </>
                  ) : (
                    'Choose a parent organisational item to organise this content.'
                  )}
                </p>
              </div>
            )}

            <FormActions
              variant="add"
              cancelHref={`/universes/${universeId}`}
              isSubmitting={isSubmitting}
            />
          </form>

          {/* Quick action to add viewable content instead */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Ready to add watchable content?
              </p>
              <ButtonLink
                variant="secondary"
                href={`/universes/${universeId}/content/add-viewable`}
              >
                Add Content Item →
              </ButtonLink>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}