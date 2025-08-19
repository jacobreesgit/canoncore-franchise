import React from 'react';
import { Content } from '@/lib/types';
import { ViewToggle } from '../interactive/ViewToggle';
import { CardGrid } from '../layout/CardGrid';
import { Tree } from './Tree';
import { getContentAtLevel } from '@/lib/utils/hierarchy';

/**
 * Content section component with view toggle and content display
 */

export interface ContentSectionProps {
  /** Section title */
  title?: string;
  /** Content items to display */
  content: Content[];
  /** Current view mode */
  viewMode: 'grid' | 'tree';
  /** Handler for view mode change */
  onViewModeChange: (mode: 'grid' | 'tree') => void;
  /** Function to generate href for content items */
  contentHref: (content: Content) => string;
  /** Whether to show favourite buttons */
  showFavourite?: boolean;
  /** Current user ID for favourite functionality */
  currentUserId?: string;
  /** Hierarchy tree for tree view */
  hierarchyTree?: any[];
  /** Search query for filtering */
  searchQuery?: string;
  /** Filtered content for search results */
  filteredContent?: Content[];
  /** Whether to show unorganized content in tree view */
  showUnorganized?: boolean;
  /** Content ID to highlight for focused tree variant */
  highlightedContentId?: string;
  /** Hide the view toggle (for single-view contexts) */
  hideViewToggle?: boolean;
  /** Optional actions to display below the content */
  actions?: React.ReactNode;
  /** Optional custom class names */
  className?: string;
}

/**
 * ContentSection component
 */
export function ContentSection({
  title = 'Content',
  content,
  viewMode,
  onViewModeChange,
  contentHref,
  showFavourite = false,
  currentUserId,
  hierarchyTree = [],
  searchQuery = '',
  filteredContent = [],
  showUnorganized = true,
  highlightedContentId,
  hideViewToggle = false,
  actions,
  className = ''
}: ContentSectionProps) {
  const containerClasses = [
    'content-section',
    'space-y-4',
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <div className={containerClasses}>
      {/* Header with title and view toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <h2 className="text-xl font-bold text-primary">{title}</h2>
        
        {!hideViewToggle && (
          <ViewToggle.Simple
            currentView={viewMode}
            onViewChange={onViewModeChange}
            gridLabel="Grid View"
            treeLabel="Tree View"
            defaultView="tree"
          />
        )}
      </div>
      
      {/* Content display */}
      <div className="bg-surface-card rounded-lg shadow p-6">
        {viewMode === 'grid' ? (
          <CardGrid
            variant="default"
            content={searchQuery ? filteredContent : getContentAtLevel(content, hierarchyTree, null)}
            contentHref={contentHref}
            showFavourite={showFavourite}
            currentUserId={currentUserId}
          />
        ) : (
          <Tree
            variant={highlightedContentId ? 'focused' : 'full'}
            hierarchyTree={hierarchyTree}
            content={content}
            contentHref={contentHref}
            searchQuery={searchQuery}
            filteredContent={filteredContent}
            showUnorganized={showUnorganized}
            highlightedContentId={highlightedContentId}
          />
        )}
        
        {/* Actions section */}
        {actions && (
          <div className="flex justify-between items-center mt-4">
            <div></div>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentSection;