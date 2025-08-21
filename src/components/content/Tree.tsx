'use client';

import React, { useState, useEffect } from 'react';
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
  highlightedContentId,
  className = ''
}: TreeProps) {
  // Track expansion state across all nodes
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Helper function to find path to highlighted content
  const findContentPath = React.useCallback((tree: any[], targetId: string): string[] => {
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
  }, []);

  // Initialize expanded nodes based on variant and highlighted path
  useEffect(() => {
    const initializeExpandedNodes = () => {
      const initialExpanded = new Set<string>();
      
      // Helper function to get initial expansion state for a node
      const getInitialExpansionForNode = (node: any, highlightedPath: string[]) => {
        const hasChildren = node.children && node.children.length > 0;
        const isInHighlightedPath = highlightedPath.includes(node.contentId);
        const isHighlighted = highlightedContentId === node.contentId;
        
        if (variant === 'focused' && highlightedContentId) {
          return isInHighlightedPath || (isHighlighted && hasChildren);
        }
        return true; // Default expansion for full variant
      };
      
      // Recursively traverse tree and set initial expansion states
      const traverseTree = (nodes: any[], currentHighlightedPath: string[]) => {
        nodes.forEach(node => {
          if (getInitialExpansionForNode(node, currentHighlightedPath)) {
            initialExpanded.add(node.contentId);
          }
          if (node.children && node.children.length > 0) {
            traverseTree(node.children, currentHighlightedPath);
          }
        });
      };
      
      const highlightedPath = highlightedContentId ? findContentPath(hierarchyTree, highlightedContentId) : [];
      traverseTree(hierarchyTree, highlightedPath);
      
      setExpandedNodes(initialExpanded);
    };
    
    initializeExpandedNodes();
  }, [hierarchyTree, highlightedContentId, variant, findContentPath]);

  // Function to toggle expansion state
  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // Get path of content IDs from root to highlighted content
  const highlightedPath = highlightedContentId ? findContentPath(hierarchyTree, highlightedContentId) : [];

  // No special display logic - always use normal tree view with horizontal scrolling
  // Add unorganized content as root-level nodes in the tree
  const unorganizedContent = content.filter(item => {
    const hasParent = hierarchyTree.some(node => hasContentInTree(node, item.id));
    return !hasParent;
  });

  // Create pseudo tree nodes for unorganized content
  const unorganizedNodes = unorganizedContent.map(item => ({
    contentId: item.id,
    children: []
  }));

  // Filter out any nodes that don't have corresponding content
  const validateNode = (node: any): boolean => {
    return content.some(item => item.id === node.contentId);
  };

  const filterValidNodes = (nodes: any[]): any[] => {
    return nodes.filter(node => {
      if (!validateNode(node)) return false;
      if (node.children && node.children.length > 0) {
        node.children = filterValidNodes(node.children);
      }
      return true;
    });
  };

  const validHierarchyTree = filterValidNodes(hierarchyTree);
  const validUnorganizedNodes = unorganizedNodes.filter(validateNode);
  
  const displayTree = [...validHierarchyTree, ...validUnorganizedNodes];

  const containerClasses = [
    'tree', // Remove global horizontal scrolling - now handled per item
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
                  <div className="text-sm font-medium text-primary break-words whitespace-normal">
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
                  className="text-tertiary hover:text-red-500 flex-shrink-0"
                />
              </div>
            </div>
          ))}
        </div>
      ) : displayTree.length > 0 ? (
        /* Split layout: Tree on left, Progress on right */
        <div className="flex">
          {/* Left side: Scrollable tree structure */}
          <div className="flex-1 overflow-x-auto min-w-0">
            <div className="min-w-max">
              {displayTree.map((node, index) => (
                <div key={`root-${node.contentId}-${index}`} className={index > 0 ? "mt-2" : ""}>
                  <TreeNode 
                    node={node} 
                    content={content} 
                    contentHref={contentHref}
                    depth={0}
                    highlightedContentId={highlightedContentId}
                    highlightedPath={highlightedPath}
                    variant={variant}
                    showProgressColumn={false}
                    expandedNodes={expandedNodes}
                    onToggleExpansion={toggleNodeExpansion}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side: Fixed progress column */}
          <div className="flex-shrink-0 w-32 ml-4">
            <div>
              {displayTree.map((node, index) => (
                <div key={`progress-${node.contentId}-${index}`} className={index > 0 ? "mt-2" : ""}>
                  <ProgressColumn
                    node={node}
                    content={content}
                    depth={0}
                    isExpanded={expandedNodes.has(node.contentId)}
                    expandedNodes={expandedNodes}
                  />
                </div>
              ))}
            </div>
          </div>
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
  /** Whether to show progress column (false for left tree, true for standalone) */
  showProgressColumn?: boolean;
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
  showProgressColumn = true,
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
      <div className={`flex items-center rounded-lg h-full ${
        isHighlighted 
          ? 'bg-[var(--color-blue-50)] border-2 border-[var(--color-blue-100)] shadow-sm' 
          : isInPath
          ? 'bg-[var(--color-blue-25)]'
          : 'hover:bg-surface-page transition-colors'
      } ${className}`}>
        
        {/* Left side: Expand button + Scrollable content title */}
        <div className="flex items-center flex-1 min-w-0">
          {/* Expand/collapse button */}
          {hasChildren ? (
            <Button
              variant="clear"
              onClick={onToggleExpand}
              className="p-1 mr-1 min-w-0 cursor-pointer flex-shrink-0"
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
            <div className="w-6 flex-shrink-0" />
          )}
          
          {/* Scrollable content title area */}
          <div className="flex-1 overflow-x-auto min-w-0">
            <Link
              href={contentHref(content)}
              className={`flex items-center h-12 px-2 cursor-pointer ${
                isHighlighted ? '' : 'rounded-lg'
              }`}
              style={{ minWidth: 'max-content' }}
            >
              <span className="font-medium text-primary whitespace-nowrap">{content.name}</span>
            </Link>
          </div>
        </div>
        
        {/* Right side: Fixed progress text + Favourite button (only when showProgressColumn is true) */}
        {showProgressColumn && (
          <div className="flex items-center flex-shrink-0 ml-4">
            {/* Fixed progress text */}
            <div className="px-2">
              {content.isViewable ? (
                <span className={`font-medium ${(content.progress || 0) > 0 ? 'text-[var(--color-status-progress-viewable)]' : 'text-tertiary'}`}>
                  {Math.round(content.progress || 0)}% watched
                </span>
              ) : (
                <span className={`font-medium ${(content.calculatedProgress || 0) > 0 ? 'text-[var(--color-status-progress-organisational)]' : 'text-tertiary'}`}>
                  {Math.round(content.calculatedProgress || 0)}% complete
                </span>
              )}
            </div>
            
            {/* Favourite button */}
            <div className="px-2">
              <FavouriteButton
                targetId={content.id}
                targetType="content"
                className="text-tertiary hover:text-red-500 flex-shrink-0"
              />
            </div>
          </div>
        )}
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
  showProgressColumn?: boolean;
  expandedNodes?: Set<string>;
  onToggleExpansion?: (nodeId: string) => void;
}

function TreeNode({ node, content, contentHref, depth, highlightedContentId, highlightedPath = [], variant, showProgressColumn = true, expandedNodes, onToggleExpansion }: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  
  // Determine if this node is in the highlighted path
  const isInHighlightedPath = highlightedPath.includes(node.contentId);
  const isHighlighted = highlightedContentId === node.contentId;
  
  // Use shared expansion state if available, otherwise fall back to local state
  const isExpanded = expandedNodes ? expandedNodes.has(node.contentId) : true;
  
  // Toggle function that uses shared state if available
  const handleToggleExpansion = () => {
    if (onToggleExpansion) {
      onToggleExpansion(node.contentId);
    }
  };
  
  const nodeContent = content.find(c => c.id === node.contentId);
  
  if (!nodeContent) {
    return null;
  }
  
  // Determine visual state for the tree item
  const isHighlightedItem = isHighlighted;
  
  return (
    <div>
      {/* TreeItem for current node */}
      <div className="h-12">
        <TreeItem
          content={nodeContent}
          contentHref={contentHref}
          isHighlighted={isHighlightedItem}
          isInPath={isInHighlightedPath}
          hasChildren={hasChildren}
          isExpanded={isExpanded}
          onToggleExpand={handleToggleExpansion}
          depth={depth}
          showProgressColumn={showProgressColumn}
        />
      </div>
      
      {/* TreeNodes for children (only if expanded and has actual children) */}
      {hasChildren && isExpanded && (
        <div className="mt-2">
          {node.children.map((childNode: any, index: number) => (
            <div key={`${depth}-${childNode.contentId}-${index}`} className={index > 0 ? "mt-2" : ""}>
              <TreeNode 
                node={childNode} 
                content={content} 
                contentHref={contentHref}
                depth={depth + 1}
                highlightedContentId={highlightedContentId}
                highlightedPath={highlightedPath}
                variant={variant}
                showProgressColumn={showProgressColumn}
                expandedNodes={expandedNodes}
                onToggleExpansion={onToggleExpansion}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


/**
 * Progress column component for the right side of split tree
 */
interface ProgressColumnProps {
  node: any;
  content: Content[];
  depth: number;
  isExpanded?: boolean;
  expandedNodes?: Set<string>;
}

function ProgressColumn({ node, content, depth, isExpanded = true, expandedNodes }: ProgressColumnProps) {
  const nodeContent = content.find(c => c.id === node.contentId);
  
  if (!nodeContent) {
    return null;
  }
  
  return (
    <div>
      {/* Progress for current node */}
      <div className="h-12 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          {/* Progress text */}
          <div>
            {nodeContent.isViewable ? (
              <span className={`font-medium ${(nodeContent.progress || 0) > 0 ? 'text-[var(--color-status-progress-viewable)]' : 'text-tertiary'}`}>
                {Math.round(nodeContent.progress || 0)}%
              </span>
            ) : (
              <span className={`font-medium ${(nodeContent.calculatedProgress || 0) > 0 ? 'text-[var(--color-status-progress-organisational)]' : 'text-tertiary'}`}>
                {Math.round(nodeContent.calculatedProgress || 0)}%
              </span>
            )}
          </div>
          
          {/* Favourite button */}
          <div>
            <FavouriteButton
              targetId={nodeContent.id}
              targetType="content"
              className="text-tertiary hover:text-red-500 flex-shrink-0"
            />
          </div>
        </div>
      </div>
      
      {/* Progress for children (only if expanded and has actual children) */}
      {node.children && node.children.length > 0 && isExpanded && (
        <div className="mt-2">
          {node.children.map((childNode: any, index: number) => {
            const childIsExpanded = expandedNodes ? expandedNodes.has(childNode.contentId) : false;
            return (
              <div key={`progress-child-${childNode.contentId}-${index}`} className={index > 0 ? "mt-2" : ""}>
                <ProgressColumn 
                  node={childNode}
                  content={content}
                  depth={depth + 1}
                  isExpanded={childIsExpanded}
                  expandedNodes={expandedNodes}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Tree;