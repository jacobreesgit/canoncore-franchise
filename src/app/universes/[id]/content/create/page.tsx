'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { universeService } from '@/lib/services';
import { Universe } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation, PageHeader, LoadingSpinner, PageContainer, ButtonLink } from '@/components';

export default function ContentCreatePage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const universeId = params.id as string;

  const [universe, setUniverse] = useState<Universe | null>(null);
  const [universeLoading, setUniverseLoading] = useState(true);
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
          title={`Add Content to ${universe.name}`}
          description="Choose what type of content you'd like to add to your franchise."
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: universe.name, href: `/universes/${universe.id}` },
            { label: 'Add Content', isCurrentPage: true }
          ]}
        />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Viewable Content Flow */}
          <Link
            href={`/universes/${universeId}/content/add-viewable`}
            className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-green-200"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8M8 21l4-7 4 7M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Add Content Item
              </h3>
              <p className="text-gray-600 mb-4">
                Add individual content items that you can track progress on
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800 font-medium">
                  ✓ Movies, TV Episodes, Books, Audio
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Perfect for tracking individual content progress
                </p>
              </div>
            </div>
          </Link>

          {/* Organisational Content Flow */}
          <Link
            href={`/universes/${universeId}/content/organise`}
            className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-blue-200"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM5 11v6m6-6v6m8-6v6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Add Organisation Group
              </h3>
              <p className="text-gray-600 mb-4">
                Create organisational groups like series, characters, and collections
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 font-medium">
                  📁 Characters, Locations, Series, Items
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Perfect for structuring and organising content
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Help section */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Not sure which to choose?
          </h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>Content Item:</strong> For content you watch and want to track progress</li>
            <li>• <strong>Organisation Group:</strong> For creating structure, adding characters, or grouping content</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <ButtonLink
            variant="secondary"
            href={`/universes/${universeId}`}
          >
            ← Back to Universe
          </ButtonLink>
        </div>
      </PageContainer>
    </div>
  );
}