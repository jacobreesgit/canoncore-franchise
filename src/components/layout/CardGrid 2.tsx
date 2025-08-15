import React from 'react';
import { Content, Universe } from '@/lib/types';
import { ContentCard } from '../content/ContentCard';
import { UniverseCard } from '../content/UniverseCard';

/**
 * CardGrid component following the component creation guide
 */

export interface CardGridProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
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
  /** Whether to sort content by viewable/organisational */
  sortContent?: boolean;
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
  sortContent = false,
  showFavourite = false,
  showOwner = false,
  ownerNames = {},
  showOwnerBadge = false,
  currentUserId,
  ...props
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
      <div className={containerClasses} {...props}>
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

  // If content is provided, render automatically with optional sorting
  if (content && contentHref) {
    // Debug logging
    console.log('CardGrid props:', { showFavourite, currentUserId, sortContent });
    
    if (sortContent) {
      const viewableContent = content.filter(c => c.isViewable);
      const organisationalContent = content.filter(c => !c.isViewable);

      return (
        <div className="space-y-8">
          {viewableContent.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">Viewable Content</h2>
              <div className={containerClasses} {...props}>
                {viewableContent.map((item) => (
                  <ContentCard
                    key={item.id}
                    content={item}
                    href={contentHref(item)}
                    showFavourite={showFavourite}
                    showOwner={showOwner}
                    ownerName={ownerNames[item.userId]}
                    showOwnerBadge={showOwnerBadge}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            </div>
          )}

          {organisationalContent.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">Organisational Content</h2>
              <div className={containerClasses} {...props}>
                {organisationalContent.map((item) => (
                  <ContentCard
                    key={item.id}
                    content={item}
                    href={contentHref(item)}
                    showFavourite={showFavourite}
                    showOwner={showOwner}
                    ownerName={ownerNames[item.userId]}
                    showOwnerBadge={showOwnerBadge}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    } else {
      // Render all content together without sorting
      return (
        <div className={containerClasses} {...props}>
          {content.map((item) => (
            <ContentCard
              key={item.id}
              content={item}
              href={contentHref(item)}
              showFavourite={showFavourite}
              showOwner={showOwner}
              ownerName={ownerNames[item.userId]}
              showOwnerBadge={showOwnerBadge}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      );
    }
  }

  // Fallback: render children if provided
  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
}

export default CardGrid;