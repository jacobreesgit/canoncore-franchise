import React from 'react';
import Link from 'next/link';
import { Content } from '@/lib/types';
import { FavouriteButton } from '../interactive/FavouriteButton';
import { ProgressBar } from './ProgressBar';
import { Badge } from './Badge';

/**
 * ContentCard component with consistent styling and behavior
 */

export interface ContentCardProps {
  /** Component variant */
  variant?: 'viewable' | 'organisational';
  /** Component size */
  size?: 'default';
  /** Optional custom class names */
  className?: string;
  /** Content data to display */
  content: Content;
  /** Link destination */
  href?: string;
  /** Click handler for non-link interactions */
  onClick?: () => void;
  /** Show favourite button */
  showFavourite?: boolean;
  /** Show owner information */
  showOwner?: boolean;
  /** Owner display name (required if showOwner is true) */
  ownerName?: string;
  /** Show owner badge (Your Content) */
  showOwnerBadge?: boolean;
  /** Current user ID for owner detection */
  currentUserId?: string;
  /** Whether this item has children in hierarchy */
  hierarchical?: boolean;
}

/**
 * Base card styles using design system tokens
 */
const baseStyles = `
  block bg-surface-card bg-surface-card-hover card hover:shadow-md transition-shadow cursor-pointer
`;

/**
 * Variant styles using design system tokens
 * These map to our spacing tokens: p-4 = --spacing-4, etc.
 */
const variantStyles = {
  viewable: `
    // Viewable content specific styling
  `,
  organisational: `
    // Organisational content specific styling
  `
};

/**
 * Size styles using design system spacing tokens
 * These map to our spacing tokens: p-6 = --spacing-6 (matching UniverseCard)
 */
const sizeStyles = {
  default: 'p-6'
};

/**
 * Helper function to format progress text
 */
const formatProgressText = (content: Content): string => {
  const progress = content.isViewable 
    ? Math.round(content.progress || 0)
    : Math.round(content.calculatedProgress || 0);
  
  const suffix = content.isViewable ? 'watched' : 'complete';
  return `${progress}% ${suffix}`;
};

/**
 * Helper function to get progress value
 */
const getProgressValue = (content: Content): number => {
  return content.isViewable 
    ? (content.progress || 0)
    : (content.calculatedProgress || 0);
};

/**
 * ContentCard component
 */
export function ContentCard({
  variant,
  size = 'default',
  className = '',
  content,
  href,
  onClick,
  showFavourite = false,
  showOwner = false,
  ownerName,
  showOwnerBadge = false,
  currentUserId,
  hierarchical = false,
}: ContentCardProps) {
  // Auto-detect variant from content if not provided
  const contentVariant = variant || (content.isViewable ? 'viewable' : 'organisational');
  
  const cardClasses = [
    'content-card',
    baseStyles,
    variantStyles[contentVariant],
    sizeStyles[size],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const cardContent = (
    <div>
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <h3 className="text-lg font-medium text-primary truncate">
                {content.name}
              </h3>
              {showFavourite && (
                <FavouriteButton 
                  targetId={content.id} 
                  targetType="content"
                  className="text-tertiary hover:text-red-500 flex-shrink-0"
                />
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-wrap gap-1">
            <Badge variant="organisational" size="small" className="capitalize">
              {content.mediaType}
            </Badge>
            {showOwnerBadge && currentUserId === content.userId && (
              <Badge variant="owner" size="small">
                Your Content
              </Badge>
            )}
            {showOwner && ownerName && currentUserId !== content.userId && (
              <Badge variant="info" size="small">
                by {ownerName}
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        {content.description && (
          <p className="text-secondary text-sm mb-4 line-clamp-3">
            {content.description}
          </p>
        )}

        {/* Progress */}
        <div>
          <ProgressBar 
            variant={content.isViewable ? 'viewable' : 'organisational'}
            value={getProgressValue(content)}
            showLabel={true}
            label={formatProgressText(content)}
          />
        </div>

    </div>
  );

  // Use div with click handler when favourites are shown (to avoid nested buttons)
  // Use button for onClick only when no interactive elements are present
  if (onClick) {
    if (showFavourite) {
      return (
        <div
          onClick={onClick}
          className={`${cardClasses} cursor-pointer`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          }}
        >
          {cardContent}
        </div>
      );
    } else {
      return (
        <button
          onClick={onClick}
          className={`${cardClasses} w-full text-left`}
        >
          {cardContent}
        </button>
      );
    }
  }

  if (href) {
    return (
      <Link
        href={href}
        className={cardClasses}
      >
        {cardContent}
      </Link>
    );
  }

  // Fallback div if neither href nor onClick
  return (
    <div className={cardClasses}>
      {cardContent}
    </div>
  );
}

export default ContentCard;