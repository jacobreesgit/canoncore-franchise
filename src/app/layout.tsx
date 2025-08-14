import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/contexts/auth-context';
import React from 'react';
import ReactDOM from 'react-dom';

// Initialize axe-core for development accessibility checking
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
  
  // Run custom contrast validation and tests
  import('@/lib/utils/accessibility').then((a11y) => {
    // Delay execution to ensure DOM is ready
    setTimeout(() => {
      a11y.logContrastIssues();
    }, 2000);
  });
  
  // Run accessibility tests
  import('@/lib/utils/accessibility.test');
}

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
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}