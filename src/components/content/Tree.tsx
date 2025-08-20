'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Content } from '@/lib/types';
import { Button } from '../interactive/Button';
import { FavouriteButton } from '../interactive/FavouriteButton';
import { EmptyState } from '../layout/EmptyState';
import { hasContentInTree } from '@/lib/utils/hierarchy';

/**
 * Tree component for hierarchical content display
 */

export interface TreeProps {
  /** Tree component variant */
  variant?: 'full' | 'focused';
  /** Hierarchy tree structure */
  hierarchyTree: any[];
  /** All content items */
  content: Content[];
  /** Function to generate href for content items */
  contentHref: (content: Content) => string;
  /** Current search query */
  searchQuery?: string;
  /** Filtered content for search results */
  filteredContent?: Content[];
  /** Whether to show unorganized content section */
  showUnorganized?: boolean;
  /** Content ID to highlight for focused variant */
  highlightedContentId?: string;
  /** Optional custom class names */
  className?: string;
}

/**
 * Tree component
 */
export function Tree({
  variant = 'full',
  hierarchyTree,
  content,
  contentHref,
  searchQuery = '',
  filteredContent = [],
  showUnorganized = true,
  highlightedContentId,
  className = ''
}: TreeProps) {
  // Helper function to find path to highlighted content
  const findContentPath = (tree: any[], targetId: string): string[] => {
    for (const node of tree) {
      if (node.contentId === targetId) {
        return [node.contentId];
      }
      
      if (node.children && node.children.length > 0) {
        const childPath = findContentPath(node.children, targetId);
        if (childPath.length > 0) {
          return [node.contentId, ...childPath];
        }
      }
    }
    return [];
  };

  // Get path of content IDs from root to highlighted content
  const highlightedPath = highlightedContentId ? findContentPath(hierarchyTree, highlightedContentId) : [];

  const displayTree = hierarchyTree;

  const containerClasses = [
    'tree',
    variant === 'focused' ? 'tree-focused' : '',
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <div className={containerClasses}>   
      {searchQuery ? (
        /* Show search results in flat list when searching */
        <div className="space-y-1">
          {filteredContent.map((item) => (
            <div key={item.id} className="flex items-center hover:bg-surface-page rounded-lg transition-colors">
              <Link
                href={contentHref(item)}
                className="flex items-center flex-1 p-2 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-primary truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-tertiary">
                    {item.isViewable ? 'Viewable' : 'Organisational'} · {item.mediaType}
                  </div>
                </div>
              </Link>
              <div className="flex-shrink-0 px-2">
                <FavouriteButton
                  targetId={item.id}
                  targetType="content"
                  size="small"
                  className="opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}
        </div>
      ) : displayTree.length > 0 ? (
        <div className="space-y-2">
          {displayTree.map((node, index) => (
            <TreeNode 
              key={`root-${node.contentId}-${index}`} 
              node={node} 
              content={content} 
              contentHref={contentHref}
              depth={0}
              highlightedContentId={highlightedContentId}
              highlightedPath={highlightedPath}
              variant={variant}
            />
          ))}
          
          {/* Show unorganized content (no parent relationships) */}
          {showUnorganized && content.filter(item => {
            const hasParent = hierarchyTree.some(node => hasContentInTree(node, item.id));
            return !hasParent;
          }).length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-secondary mb-2">Unorganized Content</h3>
              <div className="space-y-1">
                {content.filter(item => {
                  const hasParent = hierarchyTree.some(node => hasContentInTree(node, item.id));
                  return !hasParent;
                }).map((item) => (
                  <div key={item.id} className="flex items-center p-2 hover:bg-surface-page rounded-lg transition-colors">
                    <Link
                      href={contentHref(item)}
                      className="flex items-center flex-1 cursor-pointer"
                    >
                      <span className="font-medium text-primary">{item.name}</span>
                      {item.isViewable ? (
                        <span className={`ml-auto text-xs ${(item.progress || 0) > 0 ? 'text-[var(--color-status-progress-viewable)]' : 'text-tertiary'}`}>
                          {Math.round(item.progress || 0)}% watched
                        </span>
                      ) : (
                        <span className={`ml-auto text-xs ${(item.calculatedProgress || 0) > 0 ? 'text-[var(--color-status-progress-organisational)]' : 'text-tertiary'}`}>
                          {Math.round(item.calculatedProgress || 0)}% complete
                        </span>
                      )}
                    </Link>
                    <div className="flex-shrink-0 px-2">
                      <FavouriteButton
                        targetId={item.id}
                        targetType="content"
                        size="small"
                        className="opacity-60 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : content.length > 0 ? (
        /* Show all content as unorganized when no hierarchies exist */
        <div className="space-y-1">
          {content.map((item) => (
            <div key={item.id} className="flex items-center p-2 hover:bg-surface-page rounded-lg transition-colors">
              <Link
                href={contentHref(item)}
                className="flex items-center flex-1 cursor-pointer"
              >
                <span className="font-medium text-primary">{item.name}</span>
                {item.isViewable ? (
                  <span className={`ml-auto text-xs ${(item.progress || 0) > 0 ? 'text-[var(--color-status-progress-viewable)]' : 'text-tertiary'}`}>
                    {Math.round(item.progress || 0)}% watched
                  </span>
                ) : (
                  <span className={`ml-auto text-xs ${(item.calculatedProgress || 0) > 0 ? 'text-[var(--color-status-progress-organisational)]' : 'text-tertiary'}`}>
                    {Math.round(item.calculatedProgress || 0)}% complete
                  </span>
                )}
              </Link>
              <div className="flex-shrink-0 px-2">
                <FavouriteButton
                  targetId={item.id}
                  targetType="content"
                  size="small"
                  className="opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          variant="hierarchical"
          title="No hierarchical relationships defined yet. Create relationships by setting parent content when adding new items."
          description=""
        />
      )}
    </div>
  );
}

/**
 * Individual tree item component - presentational with expand button
 */
interface TreeItemProps {
  /** The content item to display */
  content: Content;
  /** Function to generate href for the content */
  contentHref: (content: Content) => string;
  /** Whether this item is currently highlighted (main focus) */
  isHighlighted?: boolean;
  /** Whether this item is in the path to highlighted content */
  isInPath?: boolean;
  /** Whether this item has children that can be expanded */
  hasChildren?: boolean;
  /** Whether the children are currently expanded */
  isExpanded?: boolean;
  /** Handler for expand/collapse */
  onToggleExpand?: () => void;
  /** Indentation depth for hierarchy display */
  depth?: number;
  /** Optional custom class names */
  className?: string;
}

/**
 * TreeItem component - displays a single content item with expand button
 */
function TreeItem({
  content,
  contentHref,
  isHighlighted = false,
  isInPath = false,
  hasChildren = false,
  isExpanded = false,
  onToggleExpand,
  depth = 0,
  className = ''
}: TreeItemProps) {
  // Responsive indentation: none on mobile, larger on desktop
  const indentation = depth * 32; // Increased from 24px to 32px
  const mobileIndentation = 0; // No indentation on mobile to save horizontal space

  return (
    <div 
      className="tree-item"
      style={{ 
        '--mobile-indent': `${mobileIndentation}px`,
        '--desktop-indent': `${indentation}px`,
        marginLeft: `${indentation}px`
      } as React.CSSProperties & { '--mobile-indent': string; '--desktop-indent': string }}
    >
      <div className={`flex items-center rounded-lg ${
        isHighlighted 
          ? 'bg-[var(--color-blue-50)] border-2 border-[var(--color-blue-100)] shadow-sm' 
          : isInPath
          ? 'bg-[var(--color-blue-25)]'
          : 'hover:bg-surface-page transition-colors'
      } ${className}`}>
        {/* Expand/collapse button */}
        {hasChildren ? (
          <Button
            variant="clear"
            onClick={onToggleExpand}
            className="p-1 mr-1 min-w-0 cursor-pointer"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        ) : (
          <div className="w-6" />
        )}
        
        {/* Content link */}
        <Link
          href={contentHref(content)}
          className={`flex flex-col sm:flex-row sm:items-center flex-1 p-2 cursor-pointer ${
            isHighlighted ? '' : 'rounded-lg'
          }`}
        >
          <div className="flex items-center sm:flex-1 min-w-0">
            <span className="font-medium text-primary truncate">{content.name}</span>
          </div>
          <div className="mt-1 sm:mt-0 sm:ml-auto flex-shrink-0">
            {content.isViewable ? (
              <span className={`text-xs ${(content.progress || 0) > 0 ? 'text-[var(--color-status-progress-viewable)]' : 'text-tertiary'}`}>
                {Math.round(content.progress || 0)}% watched
              </span>
            ) : (
              <span className={`text-xs ${(content.calculatedProgress || 0) > 0 ? 'text-[var(--color-status-progress-organisational)]' : 'text-tertiary'}`}>
                {Math.round(content.calculatedProgress || 0)}% complete
              </span>
            )}
          </div>
        </Link>
        
        {/* Favourite button */}
        <div className="flex-shrink-0 px-2">
          <FavouriteButton
            targetId={content.id}
            targetType="content"
            size="small"
            className="opacity-60 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Individual tree node component (uses TreeItem)
 */
interface TreeNodeProps {
  node: any;
  content: Content[];
  contentHref: (content: Content) => string;
  depth: number;
  highlightedContentId?: string;
  highlightedPath?: string[];
  variant?: 'full' | 'focused';
}

function TreeNode({ node, content, contentHref, depth, highlightedContentId, highlightedPath = [], variant }: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  
  // Determine if this node is in the highlighted path
  const isInHighlightedPath = highlightedPath.includes(node.contentId);
  const isHighlighted = highlightedContentId === node.contentId;
  
  // Smart expansion logic for focused variant
  const getInitialExpansionState = useCallback(() => {
    if (variant === 'focused' && highlightedContentId) {
      // Auto-expand if this node is in the path to highlighted content
      // or if this is the highlighted content with children
      return isInHighlightedPath || (isHighlighted && hasChildren);
    }
    // Default expansion for full variant
    return true;
  }, [variant, highlightedContentId, isInHighlightedPath, isHighlighted, hasChildren]);
  
  // Use smart initial state
  const [isExpanded, setIsExpanded] = useState(getInitialExpansionState);
  
  // Update expansion state when highlighted content changes
  useEffect(() => {
    if (variant === 'focused') {
      setIsExpanded(getInitialExpansionState());
    }
  }, [highlightedContentId, variant, isInHighlightedPath, isHighlighted, hasChildren, getInitialExpansionState]);
  
  const nodeContent = content.find(c => c.id === node.contentId);
  
  if (!nodeContent) {
    return null;
  }
  
  // Determine visual state for the tree item
  const isHighlightedItem = isHighlighted;
  
  return (
    <div>
      <TreeItem
        content={nodeContent}
        contentHref={contentHref}
        isHighlighted={isHighlightedItem}
        isInPath={isInHighlightedPath}
        hasChildren={hasChildren}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        depth={depth}
      />
      
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((childNode: any, index: number) => (
            <TreeNode 
              key={`${depth}-${childNode.contentId}-${index}`} 
              node={childNode} 
              content={content} 
              contentHref={contentHref}
              depth={depth + 1}
              highlightedContentId={highlightedContentId}
              highlightedPath={highlightedPath}
              variant={variant}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Tree;