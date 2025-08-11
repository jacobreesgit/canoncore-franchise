'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { userService, universeService } from '@/lib/services';
import { User, Universe, Favorite } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';

export default function ProfilePage() {
  const { user: currentUser, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userUniverses, setUserUniverses] = useState<Universe[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteUniverses, setFavoriteUniverses] = useState<Universe[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'universes' | 'favorites'>('universes');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setProfileLoading(true);
        setError(null);
        
        
        const userData = await userService.getById(userId);
        
        if (!userData) {
          setError('User not found');
          return;
        }

        setProfileUser(userData);

        // Get user's public universes
        const universes = await universeService.getUserUniverses(userId);
        const publicUniverses = universes.filter(u => u.isPublic);
        setUserUniverses(publicUniverses);

        // Get user's favorites if viewing own profile
        // TODO: Implement favorites system in Phase 3d
        if (currentUser && currentUser.id === userId) {
          // Temporarily disabled until Phase 3d implementation
          // const userFavorites = await userService.getFavourites(userId);
          // setFavorites(userFavorites);
          setFavorites([]);
          setFavoriteUniverses([]);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Error loading profile data');
      } finally {
        setProfileLoading(false);
      }
    };

    // Only fetch when we have userId, auth is not loading, and user is authenticated
    if (userId && !loading && currentUser) {
      // Add a small delay to ensure Firebase auth is fully initialized
      const timer = setTimeout(() => {
        fetchProfileData();
      }, 100);
      
      return () => clearTimeout(timer);
    } else if (userId && !loading && !currentUser) {
      // User is not authenticated, redirect to home
      setError('Authentication required');
      setProfileLoading(false);
    }
  }, [userId, currentUser, loading]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    router.push('/');
    return null;
  }

  if (error || !profileUser) {
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
                {error || 'User not found'}
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

  const isOwnProfile = currentUser.id === userId;
  const totalUniverses = userUniverses.length;
  const totalFavorites = favorites.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-gray-900">
                CanonCore
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/discover"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Discover
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isOwnProfile && (
                <Link
                  href={`/profile/${userId}/edit`}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Edit Profile
                </Link>
              )}
              <span className="text-gray-700">
                {currentUser.displayName || currentUser.email}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profileUser.displayName || 'Anonymous User'}
              </h1>
              <p className="text-gray-600">
                {isOwnProfile ? 'Your Profile' : 'User Profile'}
              </p>
              {isOwnProfile && profileUser.email && (
                <p className="text-sm text-gray-500 mt-1">
                  {profileUser.email}
                </p>
              )}
              <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium text-gray-900">{totalUniverses}</span>
                  <span className="ml-1">Public Franchise{totalUniverses !== 1 ? 's' : ''}</span>
                </div>
                {isOwnProfile && (
                  <div>
                    <span className="font-medium text-gray-900">{totalFavorites}</span>
                    <span className="ml-1">Favorite{totalFavorites !== 1 ? 's' : ''}</span>
                  </div>
                )}
                <div>
                  <span>Joined {new Date(profileUser.createdAt.toDate()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('universes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'universes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Public Franchises ({totalUniverses})
              </button>
              {isOwnProfile && (
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'favorites'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Favorites ({totalFavorites})
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'universes' && (
          <div>
            {userUniverses.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow p-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No public franchises
                  </h3>
                  <p className="text-gray-600">
                    {isOwnProfile 
                      ? "You haven't created any public franchises yet"
                      : "This user hasn't shared any public franchises yet"
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userUniverses.map((universe) => (
                  <Link
                    key={universe.id}
                    href={`/universes/${universe.id}`}
                    className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {universe.name}
                        </h3>
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                          Public
                        </span>
                      </div>
                      {universe.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {universe.description}
                        </p>
                      )}
                      {typeof universe.progress === 'number' && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(universe.progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${universe.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Created {new Date(universe.createdAt.toDate()).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && isOwnProfile && (
          <div>
            {favoriteUniverses.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow p-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No favorites yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start exploring franchises to add them to your favorites
                  </p>
                  <Link
                    href="/discover"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Discover Franchises
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteUniverses.map((universe) => (
                  <Link
                    key={universe.id}
                    href={`/universes/${universe.id}`}
                    className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {universe.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            ♥ Favorite
                          </span>
                          {universe.isPublic && (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                              Public
                            </span>
                          )}
                        </div>
                      </div>
                      {universe.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {universe.description}
                        </p>
                      )}
                      <div className="text-xs text-gray-500">
                        By {universe.userId === currentUser.id ? 'You' : 'Community'}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}