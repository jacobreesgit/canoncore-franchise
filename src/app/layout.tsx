import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/contexts/auth-context';
import { Footer } from '@/components';

export const metadata: Metadata = {
  title: 'CanonCore - Franchise Organisation',
  description: 'Organise and track your progress through real fictional franchises like Marvel, Doctor Who, Star Wars, and more.',
  keywords: ['franchise', 'tracking', 'marvel', 'doctor who', 'star wars', 'progress', 'organisation'],
  authors: [{ name: 'CanonCore' }],
  creator: 'CanonCore',
  publisher: 'CanonCore',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://canoncore.app'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: '/',
    title: 'CanonCore - Franchise Organisation',
    description: 'Organise and track your progress through real fictional franchises like Marvel, Doctor Who, Star Wars, and more.',
    siteName: 'CanonCore',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CanonCore - Franchise Organisation',
    description: 'Organise and track your progress through real fictional franchises like Marvel, Doctor Who, Star Wars, and more.',
    creator: '@canoncore',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
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
          <main className="flex-1 bg-surface-page">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}