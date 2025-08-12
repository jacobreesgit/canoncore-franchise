'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePageTitle } from '@/lib/hooks/usePageTitle';
import { FormActions, Navigation, PageHeader, LoadingSpinner, ErrorMessage, FormLabel, FormInput, PageContainer } from '@/components';

export default function EditProfilePage() {
  const { user, loading, updateDisplayName } = useAuth();
  
  // Set page title
  usePageTitle('Edit Profile');
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [formData, setFormData] = useState({
    displayName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
      });
    }
  }, [user]);

  if (loading) {
    return <LoadingSpinner variant="fullscreen" message="Loading..." />;
  }

  if (!user) {
    router.push('/');
    return null;
  }

  // Permission check: only allow editing your own profile
  if (user.id !== userId) {
    router.push(`/profile/${userId}`);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.displayName.trim()) {
        throw new Error('Display name is required');
      }

      await updateDisplayName(formData.displayName.trim());
      router.push(`/profile/${userId}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error.message : 'Error updating profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

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
          title="Edit Profile"
          description="Update your profile information."
        />

        <div className="bg-surface-card rounded-lg shadow p-6">

          <ErrorMessage variant="form" message={error} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <FormLabel htmlFor="displayName">
                Display Name *
              </FormLabel>
              <FormInput
                type="text"
                id="displayName"
                name="displayName"
                required
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="Enter your display name"
              />
              <p className="mt-1 text-sm text-tertiary">
                This is how your name will appear to other users.
              </p>
            </div>

            <FormActions
              variant="update"
              cancelHref={`/profile/${userId}`}
              isSubmitting={isSubmitting}
            />
          </form>
        </div>
      </PageContainer>
    </div>
  );
}