'use client';

import { useEffect } from 'react';

/**
 * Development-only accessibility checking component
 * Must be client-side only to avoid hydration issues
 */
export function DevAccessibility() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    // Initialize axe-core for accessibility checking
    Promise.all([
      import('@axe-core/react'),
      import('react'),
      import('react-dom')
    ]).then(([axe, React, ReactDOM]) => {
      axe.default(React.default, ReactDOM.default, 1000);
    });
    
    // Run custom contrast validation
    import('@/lib/utils/accessibility').then((a11y) => {
      // Delay execution to ensure DOM is ready
      setTimeout(() => {
        a11y.logContrastIssues();
      }, 2000);
    });
  }, []);

  // This component doesn't render anything
  return null;
}