import { Button } from '@/components';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-page flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-card rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-tertiary mb-4">404</h1>
          <h2 className="text-2xl font-bold text-primary mb-2">
            Page Not Found
          </h2>
          <p className="text-secondary">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link href="/" className="block">
            <Button variant="primary" className="w-full">
              Return to Dashboard
            </Button>
          </Link>
          
          <Link href="/discover" className="block">
            <Button variant="secondary" className="w-full">
              Discover Franchises
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}