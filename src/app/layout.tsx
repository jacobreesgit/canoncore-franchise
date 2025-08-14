import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/contexts/auth-context';
// React imports only needed for development axe-core - moved to dynamic import

// Initialize axe-core for development accessibility checking
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  Promise.all([
    import('@axe-core/react'),
    import('react'),
    import('react-dom')
  ]).then(([axe, React, ReactDOM]) => {
    axe.default(React.default, ReactDOM.default, 1000);
  });
  
  // Run custom contrast validation and tests
  import('@/lib/utils/accessibility').then((a11y) => {
    // Delay execution to ensure DOM is ready
    setTimeout(() => {
      a11y.logContrastIssues();
    }, 2000);
  });
  
  // Note: Accessibility tests are run separately via npm scripts, not imported here
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