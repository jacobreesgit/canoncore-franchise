'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { universeService } from '@/lib/services';
import { Universe } from '@/lib/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DiscoverPage() {
  const { user, loading } = useAuth();
  const [publicUniverses, setPublicUniverses] = useState<Universe[]>([]);
  const [universesLoading, setUniversesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPublicUniverses = async () => {
      try {
        let universes;
        if (user) {
          // Fetch with user progress for authenticated users
          universes = await universeService.getPublicUniversesWithUserProgress(user.id);
        } else {
          // Fetch without progress for non-authenticated users
          universes = await universeService.getPublicUniverses();
        }
        setPublicUniverses(universes);
      } catch (error) {
        console.error('Error fetching public universes:', error);
      } finally {
        setUniversesLoading(false);
      }
    };

    fetchPublicUniverses();
  }, [user]);

  const filteredUniverses = publicUniverses.filter(universe => 
    universe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    universe.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

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
                  className="text-blue-600 font-medium"
                >
                  Discover
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    href={`/profile/${user.id}`}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Profile
                  </Link>
                  <span className="text-gray-700">
                    {user.displayName || user.email}
                  </span>
                </>
              ) : (
                <Link
                  href="/"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Discover Franchises
            </h1>
            <p className="text-gray-600">
              Explore public franchise collections created by the community
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search franchises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {universesLoading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-500">Loading public franchises...</div>
          </div>
        ) : filteredUniverses.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? 'No matching franchises found' : 'No public franchises yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Be the first to create and share a public franchise!'
                }
              </p>
              {user && (
                <Link
                  href="/universes/create"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Create First Public Franchise
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {searchQuery && (
                <span>
                  Showing {filteredUniverses.length} result{filteredUniverses.length !== 1 ? 's' : ''} for "{searchQuery}"
                </span>
              )}
              {!searchQuery && (
                <span>{filteredUniverses.length} public franchise{filteredUniverses.length !== 1 ? 's' : ''}</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUniverses.map((universe) => (
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
          </>
        )}
      </main>
    </div>
  );
}