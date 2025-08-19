import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/contexts/auth-context';
import { Footer } from '@/components';

export const metadata: Metadata = {
  title: 'CanonCore - Franchise Organisation',
  description: 'Organise and track your progress through real fictional franchises like Marvel, Doctor Who, Star Wars, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}