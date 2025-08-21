'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components';

const TEST_USERS = [
  { email: 'alice@canoncore.test', displayName: 'Alice Test User' },
  { email: 'bob@canoncore.test', displayName: 'Bob Test User' },
  { email: 'charlie@canoncore.test', displayName: 'Charlie Test User' }
];

export function EmulatorSignIn() {
  const { signIn, loading } = useAuth();
  const [signingIn, setSigningIn] = useState<string | null>(null);

  const handleEmulatorSignIn = async (testUser: { email: string; displayName: string }) => {
    setSigningIn(testUser.email);
    try {
      await signIn(testUser);
    } catch (error) {
      console.error('Emulator sign in failed:', error);
    } finally {
      setSigningIn(null);
    }
  };

  // Debug info
  console.log('EmulatorSignIn - USE_EMULATOR:', process.env.NEXT_PUBLIC_USE_EMULATOR);
  
  // Only show in development with emulator mode
  if (process.env.NEXT_PUBLIC_USE_EMULATOR !== 'true') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-4">
        <p className="text-red-700 text-xs">
          Debug: USE_EMULATOR = '{process.env.NEXT_PUBLIC_USE_EMULATOR}' (should be 'true')
        </p>
      </div>
    );
  }

  return (
    <div className="emulator-sign-in">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">🔧 Emulator Mode</h3>
        <p className="text-yellow-700 text-sm mb-3">Choose a test user to sign in with:</p>
        <div className="space-y-2">
          {TEST_USERS.map((user) => (
            <Button
              key={user.email}
              variant="secondary"
              onClick={() => handleEmulatorSignIn(user)}
              disabled={loading || signingIn !== null}
              className="w-full justify-start text-left"
            >
              {signingIn === user.email ? 'Signing in...' : `Sign in as ${user.displayName}`}
            </Button>
          ))}
        </div>
        <p className="text-xs text-yellow-600 mt-2">
          These are test accounts for development only.
        </p>
      </div>
    </div>
  );
}