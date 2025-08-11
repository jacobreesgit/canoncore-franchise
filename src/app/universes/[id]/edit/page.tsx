'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { universeService } from '@/lib/services';
import { Universe } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
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
              <span className="text-gray-600">Edit</span>
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
              Edit Franchise: {universe.name}
            </h1>
            <p className="text-gray-600">
              Update the details of your franchise. Remember, only catalogue established fictional universes.
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
                Franchise Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Marvel Cinematic Universe, Doctor Who, Star Wars"
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
                placeholder="Describe this franchise universe and what content you plan to catalogue..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="sourceLink" className="block text-sm font-medium text-gray-700 mb-1">
                Source Link (Optional)
              </label>
              <input
                type="url"
                id="sourceLink"
                name="sourceLink"
                value={formData.sourceLink}
                onChange={handleInputChange}
                placeholder="https://example.com/franchise-info"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="sourceLinkName" className="block text-sm font-medium text-gray-700 mb-1">
                Source Name (Optional)
              </label>
              <input
                type="text"
                id="sourceLinkName"
                name="sourceLinkName"
                value={formData.sourceLinkName}
                onChange={handleInputChange}
                placeholder="e.g. Official Website, Wiki, IMDb"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                Make this franchise public for others to discover
              </label>
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
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}