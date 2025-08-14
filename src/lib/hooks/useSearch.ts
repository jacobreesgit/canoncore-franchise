import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

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

  // Create Fuse instance with memoization
  const fuse = useMemo(() => {
    const options: any = {
      ...DEFAULT_FUSE_OPTIONS,
      ...fuseOptions,
      keys: keys
    };
    return new Fuse(data, options);
  }, [data, keys, fuseOptions]);

  // Filter results based on search query
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }
    
    const results = fuse.search(searchQuery);
    return results.map(result => result.item);
  }, [fuse, searchQuery, data]);

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