import { Suspense } from 'react';
import { LoadingSpinner } from '@/components';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner variant="fullscreen" message="Loading page..." />}>
      {children}
    </Suspense>
  );
}