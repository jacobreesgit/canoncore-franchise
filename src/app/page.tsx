'use client';

import { useAuth } from '@/lib/contexts/auth-context';
import { universeService } from '@/lib/services';
import { Universe } from '@/lib/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FavouriteButton } from '@/components';

export default function Home() {
  const { user, loading, signIn, signOut } = useAuth();
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [universesLoading, setUniversesLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchUniverses = async () => {
        try {
          const userUniverses = await universeService.getUserUniversesWithProgress(user.id);
          setUniverses(userUniverses);
        } catch (error) {
          console.error('Error fetching universes:', error);
        } finally {
          setUniversesLoading(false);
        }
      };
      fetchUniverses();
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              CanonCore
            </h1>
            <p className="text-gray-600 mb-8">
              Organise and track your progress through real fictional franchises like Marvel, Doctor Who, Star Wars, and more.
            </p>
            <button
              onClick={signIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">CanonCore</h1>
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/"
                  className="text-blue-600 font-medium"
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
              <Link
                href={`/profile/${user.id}`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Profile
              </Link>
              <span className="text-gray-700">
                Welcome, {user.displayName || user.email}
              </span>
              <button
                onClick={signOut}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Your Franchises
              </h2>
              <p className="text-gray-600 mt-1">
                Manage and track your progress through your favourite fictional universes
              </p>
            </div>
            <Link
              href="/universes/create"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Add Franchise
            </Link>
          </div>
        </div>

        {universesLoading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-500">Loading your franchises...</div>
          </div>
        ) : universes.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No franchises yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start by adding your first franchise like Marvel, Doctor Who, or Star Wars
              </p>
              <Link
                href="/universes/create"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Add Your First Franchise
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universes.map((universe) => (
              <Link
                key={universe.id}
                href={`/universes/${universe.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900 truncate mr-2">
                      {universe.name}
                    </h3>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <FavouriteButton 
                        targetId={universe.id} 
                        targetType="universe"
                        className="text-gray-400 hover:text-red-500"
                      />
                      {!universe.isPublic && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                  {universe.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {universe.description}
                    </p>
                  )}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(universe.progress || 0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${universe.progress || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Created {new Date(universe.createdAt.toDate()).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}