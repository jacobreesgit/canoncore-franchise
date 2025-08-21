'use client';

import { useEffect } from 'react';
import { ErrorMessage, Button } from '@/components';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface-page flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-card rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-danger mb-2">
            Something went wrong
          </h1>
          <ErrorMessage 
            variant="inline" 
            message="An unexpected error occurred. Please try again." 
          />
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={reset}
            variant="primary"
            className="w-full"
          >
            Try again
          </Button>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="secondary"
            className="w-full"
          >
            Return to Dashboard
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-sm text-tertiary cursor-pointer">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs text-tertiary bg-surface-page p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}