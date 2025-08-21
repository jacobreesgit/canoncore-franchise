import { Content } from '@/lib/types';

/**
 * Hierarchy utilities for content organization
 * Shared between Tree and CardGrid components
 */

export interface HierarchyNode {
  contentId: string;
  children?: HierarchyNode[];
}

export interface HierarchyLevel {
  id: string | null;
  name: string;
  parentId?: string | null;
}

export interface BreadcrumbData {
  label: string;
  levelId: string | null;
  onClick?: () => void;
  isCurrentPage?: boolean;
}

/**
 * Check if content exists anywhere in the hierarchy tree
 */
export function hasContentInTree(node: HierarchyNode, contentId: string): boolean {
  if (node.contentId === contentId) {
    return true;
  }
  
  if (node.children) {
    return node.children.some(child => hasContentInTree(child, contentId));
  }
  
  return false;
}

/**
 * Check if content has children in the hierarchy
 */
export function hasChildren(hierarchyTree: HierarchyNode[], contentId: string): boolean {
  const findNode = (nodes: HierarchyNode[]): boolean => {
    for (const node of nodes) {
      if (node.contentId === contentId) {
        return node.children ? node.children.length > 0 : false;
      }
      if (node.children) {
        const found = findNode(node.children);
        if (found) return true;
      }
    }
    return false;
  };
  
  return findNode(hierarchyTree);
}

/**
 * Get content items for a specific hierarchy level
 */
export function getContentAtLevel(
  content: Content[], 
  hierarchyTree: HierarchyNode[], 
  levelId: string | null
): Content[] {
  if (levelId === null || levelId === "") {
    // Root level: if no hierarchy exists, show all content
    if (!hierarchyTree || hierarchyTree.length === 0) {
      return content;
    }
    // Otherwise, return content with no parents (but include root nodes of hierarchy)
    return content.filter(item => {
      // Check if this content is a root node in the hierarchy
      const isRootNode = hierarchyTree.some(node => node.contentId === item.id);
      
      // Check if this content appears as a child anywhere in the hierarchy
      const isChild = hierarchyTree.some(node => {
        const findInChildren = (n: HierarchyNode): boolean => {
          if (n.children) {
            return n.children.some(child => 
              child.contentId === item.id || findInChildren(child)
            );
          }
          return false;
        };
        return findInChildren(node);
      });
      
      // Show content that is either a root node or not part of hierarchy at all
      return isRootNode || !isChild;
    });
  }
  
  // Find children of the specified level
  const findLevelChildren = (nodes: HierarchyNode[]): string[] => {
    for (const node of nodes) {
      if (node.contentId === levelId) {
        return node.children ? node.children.map(child => child.contentId) : [];
      }
      if (node.children) {
        const childIds = findLevelChildren(node.children);
        if (childIds.length > 0) return childIds;
      }
    }
    return [];
  };
  
  const childIds = findLevelChildren(hierarchyTree);
  return content.filter(item => childIds.includes(item.id));
}

/**
 * Build breadcrumb path for a specific content item
 */
export function buildContentPath(
  content: Content[],
  hierarchyTree: HierarchyNode[], 
  contentId: string
): BreadcrumbData[] {
  const path: string[] = [];
  
  const findPath = (nodes: HierarchyNode[], targetId: string, currentPath: string[]): boolean => {
    for (const node of nodes) {
      const newPath = [...currentPath, node.contentId];
      
      if (node.contentId === targetId) {
        path.push(...newPath);
        return true;
      }
      
      if (node.children) {
        const found = findPath(node.children, targetId, newPath);
        if (found) return true;
      }
    }
    return false;
  };
  
  findPath(hierarchyTree, contentId, []);
  
  // Convert path to breadcrumb data
  return path.map((id, index) => {
    const contentItem = content.find(c => c.id === id);
    return {
      label: contentItem?.name || 'Unknown',
      levelId: index === path.length - 1 ? null : id, // Last item is current page
      isCurrentPage: index === path.length - 1
    };
  });
}

/**
 * Get the parent ID of a content item
 */
export function getParentId(hierarchyTree: HierarchyNode[], contentId: string): string | null {
  const findParent = (nodes: HierarchyNode[], targetId: string, parentId: string | null = null): string | null => {
    for (const node of nodes) {
      if (node.contentId === targetId) {
        return parentId;
      }
      
      if (node.children) {
        const parent = findParent(node.children, targetId, node.contentId);
        if (parent !== null) return parent;
      }
    }
    return null;
  };
  
  return findParent(hierarchyTree, contentId);
}

/**
 * Build navigation breadcrumbs for current hierarchy level
 */
export function buildLevelBreadcrumbs(
  content: Content[],
  hierarchyTree: HierarchyNode[],
  currentLevelId: string | null,
  universeName: string,
  onNavigate: (levelId: string | null) => void
): BreadcrumbData[] {
  if (currentLevelId === null) {
    return [{ label: universeName, levelId: null, isCurrentPage: true }];
  }
  
  const path = buildContentPath(content, hierarchyTree, currentLevelId);
  const breadcrumbs: BreadcrumbData[] = [
    { 
      label: universeName, 
      levelId: null, 
      onClick: () => onNavigate(null) 
    }
  ];
  
  // Add intermediate levels
  path.forEach((item, index) => {
    if (!item.isCurrentPage) {
      breadcrumbs.push({
        label: item.label,
        levelId: item.levelId,
        onClick: () => onNavigate(item.levelId)
      });
    }
  });
  
  // Add current level
  if (path.length > 0) {
    breadcrumbs.push({
      label: path[path.length - 1].label,
      levelId: currentLevelId,
      isCurrentPage: true
    });
  }
  
  return breadcrumbs;
}

/**
 * Calculate the maximum depth of a hierarchy tree
 */
export function calculateMaxDepth(hierarchyTree: HierarchyNode[]): number {
  if (!hierarchyTree || hierarchyTree.length === 0) {
    return 0;
  }
  
  const getDepth = (nodes: HierarchyNode[], currentDepth: number = 1): number => {
    let maxDepth = currentDepth;
    
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        const childDepth = getDepth(node.children, currentDepth + 1);
        maxDepth = Math.max(maxDepth, childDepth);
      }
    }
    
    return maxDepth;
  };
  
  return getDepth(hierarchyTree);
}

/**
 * Flatten hierarchy tree into a list with parent context
 * Used for flat display mode in deep hierarchies or mobile
 */
export function flattenHierarchy(hierarchyTree: HierarchyNode[], content: Content[]): Array<{
  content: Content;
  parentPath: string[];
  depth: number;
}> {
  const flattened: Array<{ content: Content; parentPath: string[]; depth: number }> = [];
  
  const flatten = (nodes: HierarchyNode[], parentPath: string[] = [], depth: number = 0) => {
    for (const node of nodes) {
      const nodeContent = content.find(c => c.id === node.contentId);
      if (nodeContent) {
        flattened.push({
          content: nodeContent,
          parentPath: [...parentPath],
          depth
        });
        
        if (node.children && node.children.length > 0) {
          flatten(node.children, [...parentPath, nodeContent.name], depth + 1);
        }
      }
    }
  };
  
  flatten(hierarchyTree);
  return flattened;
}