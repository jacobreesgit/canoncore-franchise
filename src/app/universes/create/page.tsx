'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { universeService } from '@/lib/services';
import { CreateUniverseData } from '@/lib/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { FormActions, Navigation, PageHeader, LoadingSpinner, ErrorMessage, FormLabel, FormInput, FormTextarea, PageContainer } from '@/components';

export default function CreateUniversePage() {
  const { user, loading } = useAuth();
  
  // Set page title
  usePageTitle('Create Universe');
  const router = useRouter();

  const [formData, setFormData] = useState<CreateUniverseData>({
    name: '',
    description: '',
    isPublic: true,
    sourceLink: '',
    sourceLinkName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return <LoadingSpinner variant="fullscreen" message="Loading..." />;
  }

  if (!user) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.name.trim()) {
        throw new Error('Universe name is required');
      }

      const newUniverse = await universeService.create(user.id, formData);
      // Navigate to the newly created universe
      router.push(`/universes/${newUniverse.id}`);
    } catch (error) {
      console.error('Error creating universe:', error);
      setError(error instanceof Error ? error.message : 'Error creating universe');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

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
          title="Create New Franchise"
          description="Add a real existing franchise like Marvel, Doctor Who, Star Wars, etc. Remember, only catalogue established fictional universes."
        />

        <div className="bg-surface-card rounded-lg shadow p-6">

          <ErrorMessage variant="form" message={error} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <FormLabel htmlFor="name">
                Franchise Name *
              </FormLabel>
              <FormInput
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Marvel Cinematic Universe, Doctor Who, Star Wars"
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
                placeholder="Describe this franchise universe and what content you plan to catalogue..."
              />
            </div>

            <div>
              <FormLabel htmlFor="sourceLink">
                Source Link (Optional)
              </FormLabel>
              <FormInput
                type="url"
                id="sourceLink"
                name="sourceLink"
                value={formData.sourceLink}
                onChange={handleInputChange}
                placeholder="https://example.com/franchise-info"
              />
            </div>

            <div>
              <FormLabel htmlFor="sourceLinkName">
                Source Name (Optional)
              </FormLabel>
              <FormInput
                type="text"
                id="sourceLinkName"
                name="sourceLinkName"
                value={formData.sourceLinkName}
                onChange={handleInputChange}
                placeholder="e.g. Official Website, Wiki, IMDb"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="h-4 w-4 text-[var(--color-interactive-primary)] focus:ring-[var(--color-interactive-primary)] border-input rounded cursor-pointer"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-primary cursor-pointer">
                Make this franchise public for others to discover
              </label>
            </div>

            <FormActions
              variant="create"
              cancelHref="/"
              isSubmitting={isSubmitting}
            />
          </form>
        </div>
      </PageContainer>
    </div>
  );
}