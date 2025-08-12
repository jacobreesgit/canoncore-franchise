'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { universeService } from '@/lib/services';
import { Universe } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FormActions, Navigation, PageHeader, LoadingSpinner, ErrorMessage, FormLabel, FormInput, FormTextarea, PageContainer } from '@/components';

export default function EditUniversePage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const universeId = params.id as string;

  const [universe, setUniverse] = useState<Universe | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
    sourceLink: '',
    sourceLinkName: '',
  });
  const [universeLoading, setUniverseLoading] = useState(true);
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
            setError('You do not have permission to edit this universe');
            return;
          }

          setUniverse(universeData);
          setFormData({
            name: universeData.name,
            description: universeData.description,
            isPublic: universeData.isPublic,
            sourceLink: universeData.sourceLink || '',
            sourceLinkName: universeData.sourceLinkName || '',
          });
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-danger text-lg mb-4">{error}</div>
          <Link 
            href="/" 
            className="text-link hover:text-link-hover underline"
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
        throw new Error('Universe name is required');
      }

      await universeService.update(universeId, user.id, formData);
      router.push(`/universes/${universeId}`);
    } catch (error) {
      console.error('Error updating universe:', error);
      setError(error instanceof Error ? error.message : 'Error updating universe');
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

  if (!universe) return null;

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
          title={`Edit Franchise: ${universe.name}`}
          description="Update the details of your franchise. Remember, only catalogue established fictional universes."
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
                className="h-4 w-4 text-[var(--color-interactive-primary)] focus:ring-[var(--color-interactive-primary)] border-input rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-primary">
                Make this franchise public for others to discover
              </label>
            </div>

            <FormActions
              variant="update"
              cancelHref={`/universes/${universeId}`}
              isSubmitting={isSubmitting}
            />
          </form>
        </div>
      </PageContainer>
    </div>
  );
}