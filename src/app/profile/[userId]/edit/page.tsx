'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditProfilePage() {
  const { user, loading, updateDisplayName } = useAuth();
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-xl font-bold text-gray-900">
                CanonCore
              </Link>
              <span className="text-gray-400">/</span>
              <Link href={`/profile/${userId}`} className="text-blue-600 hover:text-blue-800">
                Profile
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Edit</span>
            </div>
            <Link
              href={`/profile/${userId}`}
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
              Edit Profile
            </h1>
            <p className="text-gray-600">
              Update your profile information.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                Display Name *
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                required
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="Enter your display name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                This is how your name will appear to other users.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link
                href={`/profile/${userId}`}
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