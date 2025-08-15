import { useState, useMemo, useEffect } from 'react';

/**
 * Configuration options for the search hook
 */
export interface UseSearchOptions<T> {
  /** Keys to search in the objects */
  keys: (keyof T | string)[];
  /** Fuse.js options */
  fuseOptions?: any;
  /** Default message when not searching */
  defaultMessage?: string;
}

/**
 * Search hook result
 */
export interface UseSearchResult<T> {
  /** Current search query */
  searchQuery: string;
  /** Function to update search query */
  setSearchQuery: (query: string) => void;
  /** Filtered results based on search query */
  filteredResults: T[];
  /** Search results counter text for PageHeader */
  searchResultsText?: string;
  /** Whether currently searching */
  isSearching: boolean;
}

/**
 * Default Fuse.js options optimized for UI search
 */
const DEFAULT_FUSE_OPTIONS: any = {
  threshold: 0.3, // More lenient matching
  location: 0,
  distance: 100,
  includeScore: false,
  includeMatches: false,
  minMatchCharLength: 1,
  shouldSort: true,
  findAllMatches: false,
  keys: []
};

/**
 * Composable search hook with Fuse.js fuzzy search
 * 
 * @example
 * ```typescript
 * const { searchQuery, setSearchQuery, filteredResults, searchResultsText } = useSearch({
 *   data: universes,
 *   keys: ['name', 'description']
 * });
 * ```
 */
export function useSearch<T>(
  data: T[],
  { keys, fuseOptions = {}, defaultMessage = 'Start typing to search...' }: UseSearchOptions<T>
): UseSearchResult<T> {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Stabilize keys to prevent unnecessary re-renders
  const keysString = JSON.stringify(keys);
  const stableKeys = useMemo(() => keys, [keys]);

  // Dynamically import Fuse.js only when needed
  const [Fuse, setFuse] = useState<any>(null);

  useEffect(() => {
    if (searchQuery.trim() && !Fuse) {
      import('fuse.js').then((module) => {
        setFuse(() => module.default);
      });
    }
  }, [searchQuery, Fuse]);

  // Create Fuse instance with memoization (only when Fuse is loaded)
  const fuse = useMemo(() => {
    if (!Fuse || !data || data.length === 0) return null;
    
    try {
      const options: any = {
        ...DEFAULT_FUSE_OPTIONS,
        ...fuseOptions,
        keys: stableKeys
      };
      return new Fuse(data, options);
    } catch (error) {
      console.warn('Error creating Fuse instance:', error);
      return null;
    }
  }, [Fuse, data, stableKeys, fuseOptions]);

  // Filter results based on search query
  const filteredResults = useMemo(() => {
    // Safety check for data
    if (!data || data.length === 0) {
      return [];
    }
    
    if (!searchQuery.trim()) {
      return data;
    }
    
    if (!fuse) {
      // Fallback to simple string matching while Fuse loads
      try {
        return data.filter(item => {
          if (!item) return false;
          return stableKeys.some(key => {
            const value = (item as any)[key];
            return typeof value === 'string' && 
                   value.toLowerCase().includes(searchQuery.toLowerCase());
          });
        });
      } catch (error) {
        console.warn('Error in fallback search:', error);
        return data;
      }
    }
    
    try {
      const results = fuse.search(searchQuery);
      return results.map((result: any) => result.item);
    } catch (error) {
      console.warn('Error in Fuse search:', error);
      return data;
    }
  }, [fuse, searchQuery, data, stableKeys]);

  // Generate search results text for PageHeader
  const searchResultsText = useMemo(() => {
    if (!searchQuery.trim()) {
      return defaultMessage;
    }
    
    const count = filteredResults.length;
    return `Showing ${count} result${count !== 1 ? 's' : ''} for "${searchQuery}"`;
  }, [searchQuery, filteredResults.length, defaultMessage]);

  const isSearching = searchQuery.trim().length > 0;

  return {
    searchQuery,
    setSearchQuery,
    filteredResults,
    searchResultsText,
    isSearching
  };
}