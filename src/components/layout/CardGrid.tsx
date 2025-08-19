import React from 'react';
import { Content, Universe } from '@/lib/types';
import { ContentCard } from '../content/ContentCard';
import { UniverseCard } from '../content/UniverseCard';
import { getContentAtLevel, buildLevelBreadcrumbs, hasChildren, BreadcrumbData } from '@/lib/utils/hierarchy';

/**
 * CardGrid component following the component creation guide
 */

export interface CardGridProps {
  /** CardGrid variant */
  variant?: 'default' | 'compact' | 'wide';
  /** Component size */
  size?: 'default';
  /** Optional custom class names */
  className?: string;
  /** Children elements (cards) - for manual card rendering */
  children?: React.ReactNode;
  /** Content items for automatic sorting and rendering */
  content?: Content[];
  /** Universe items for automatic rendering */
  universes?: Universe[];
  /** Base URL for content links */
  contentHref?: (content: Content) => string;
  /** Base URL for universe links */
  universeHref?: (universe: Universe) => string;
  /** Show favourite button on content cards */
  showFavourite?: boolean;
  /** Show owner information on content cards */
  showOwner?: boolean;
  /** Owner display name mapping (content.userId -> ownerName) */
  ownerNames?: Record<string, string>;
  /** Show owner badge (Your Content) */
  showOwnerBadge?: boolean;
  /** Current user ID for owner detection */
  currentUserId?: string;
  /** Hierarchy tree for hierarchical navigation */
  hierarchyTree?: any[];
  /** Current hierarchy level ID */
  currentLevelId?: string | null;
  /** Callback when navigating to a different level */
  onNavigateLevel?: (levelId: string | null) => void;
  /** Universe name for breadcrumbs */
  universeName?: string;
  /** Whether to enable hierarchical mode */
  hierarchical?: boolean;
}

/**
 * Base card grid styles using design system tokens
 */
const baseStyles = `
  grid gap-6
`;

/**
 * Variant styles using design system tokens
 */
const variantStyles = {
  default: `
    grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  `,
  compact: `
    grid-cols-1 md:grid-cols-3 lg:grid-cols-4
  `,
  wide: `
    grid-cols-1 md:grid-cols-2
  `
};

/**
 * Size styles using design system spacing tokens
 */
const sizeStyles = {
  default: ''
};

/**
 * CardGrid component
 */
export function CardGrid({
  variant = 'default',
  size = 'default',
  className = '',
  children,
  content,
  universes,
  contentHref = (item) => `/content/${item.id}`,
  universeHref = (item) => `/universes/${item.id}`,
  showFavourite = false,
  showOwner = false,
  ownerNames = {},
  showOwnerBadge = false,
  currentUserId,
  hierarchyTree = [],
  currentLevelId = null,
  onNavigateLevel,
  universeName = '',
  hierarchical = false,
}: CardGridProps) {
  const containerClasses = [
    'card-grid',
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If universes are provided, render UniverseCards
  if (universes) {
    return (
      <div className={containerClasses}>
        {universes.map((universe) => (
          <UniverseCard
            key={universe.id}
            universe={universe}
            href={universeHref(universe)}
            showFavourite={showFavourite}
            showOwner={showOwner}
            ownerName={ownerNames[universe.userId]}
            showOwnerBadge={showOwnerBadge}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    );
  }

  // Get content for current hierarchy level if hierarchical mode is enabled
  const displayContent = hierarchical && hierarchyTree && content
    ? getContentAtLevel(content, hierarchyTree, currentLevelId)
    : content;

  // Build breadcrumbs for hierarchical navigation
  const breadcrumbs: BreadcrumbData[] = hierarchical && onNavigateLevel && hierarchyTree && content
    ? buildLevelBreadcrumbs(content, hierarchyTree, currentLevelId, universeName, onNavigateLevel)
    : [];

  // If content is provided, render all content together
  if (displayContent && contentHref) {
    return (
      <div className={containerClasses}>
          {displayContent.map((item) => {
            const itemHasChildren = hierarchical && hierarchyTree 
              ? hasChildren(hierarchyTree, item.id)
              : false;
            
            // Always navigate to content pages - let content pages handle context/hierarchy display
            const itemHref = contentHref(item);
            const handleClick = undefined;
            
            return (
              <ContentCard
                key={item.id}
                content={item}
                href={itemHref}
                onClick={handleClick}
                showFavourite={showFavourite}
                showOwner={showOwner}
                ownerName={ownerNames[item.userId]}
                showOwnerBadge={showOwnerBadge}
                currentUserId={currentUserId}
                hierarchical={itemHasChildren}
              />
            );
          })}
      </div>
    );
  }

  // Fallback: render children if provided
  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
}

export default CardGrid;