import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/contexts/auth-context';

export const metadata: Metadata = {
  title: 'CanonCore - Franchise Organization',
  description: 'Organize and track your progress through real fictional franchises like Marvel, Doctor Who, Star Wars, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}