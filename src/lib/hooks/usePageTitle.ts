import { useEffect } from 'react';

/**
 * Custom hook to set the document title dynamically
 * @param title - The title to set (without "- CanonCore" suffix)
 * @param dependency - Optional dependency to trigger title update
 */
export function usePageTitle(title: string, dependency?: any) {
  useEffect(() => {
    if (title) {
      document.title = `${title} - CanonCore`;
    }
    
    // Clean up - restore default title when component unmounts
    return () => {
      document.title = 'CanonCore - Franchise Organisation';
    };
  }, [title, dependency]);
}