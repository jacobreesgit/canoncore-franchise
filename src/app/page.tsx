'use client';

import { useAuth } from '@/lib/contexts/auth-context';

export default function Home() {
  const { user, loading, signIn, signOut } = useAuth();

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
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">CanonCore</h1>
            </div>
            <div className="flex items-center space-x-4">
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
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your Franchise Dashboard
          </h2>
          <p className="text-gray-600 mb-8">
            Start organising your favourite franchises like Marvel, Doctor Who, or Star Wars.
          </p>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">
              Franchise management coming soon...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}