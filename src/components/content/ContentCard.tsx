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
  href: string;
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
  showFavourite = false,
  showOwner = false,
  ownerName,
  showOwnerBadge = false,
  currentUserId,
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

  return (
    <Link
      href={href}
      className={cardClasses}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 mr-2">
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
            <Badge variant="organisational" size="small" className="capitalize">
              {content.mediaType}
            </Badge>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
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
    </Link>
  );
}

export default ContentCard;