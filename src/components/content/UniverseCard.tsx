import React from 'react';
import Link from 'next/link';
import { Universe } from '@/lib/types';
import { FavouriteButton } from '../interactive/FavouriteButton';
import { ProgressBar } from './ProgressBar';
import { Badge } from './Badge';

/**
 * UniverseCard component with consistent styling and behavior
 */

export interface UniverseCardProps {
  /** Component variant */
  variant?: 'dashboard' | 'profile' | 'discover';
  /** Component size */
  size?: 'default';
  /** Optional custom class names */
  className?: string;
  /** Universe data to display */
  universe: Universe;
  /** Link destination */
  href: string;
  /** Show favourite button */
  showFavourite?: boolean;
  /** Show owner information */
  showOwner?: boolean;
  /** Owner display name (required if showOwner is true) */
  ownerName?: string;
  /** Show owner badge (Your Universe) */
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
 * These map to our spacing tokens: p-6 = --spacing-6, etc.
 */
const variantStyles = {
  dashboard: `
    // Dashboard specific styling
  `,
  profile: `
    // Profile specific styling
  `,
  discover: `
    // Discover specific styling
  `
};

/**
 * Size styles using design system spacing tokens
 * These map to our spacing tokens: p-6 = --spacing-6
 */
const sizeStyles = {
  default: 'p-6'
};

/**
 * UniverseCard component
 */
export function UniverseCard({
  variant = 'dashboard',
  size = 'default',
  className = '',
  universe,
  href,
  showFavourite = false,
  showOwner = false,
  ownerName,
  showOwnerBadge = false,
  currentUserId,
}: UniverseCardProps) {
  const cardClasses = [
    'universe-card',
    baseStyles,
    variantStyles[variant],
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
              {universe.name}
            </h3>
            {showFavourite && (
              <FavouriteButton 
                targetId={universe.id} 
                targetType="universe"
                className="text-tertiary hover:text-red-500 flex-shrink-0"
              />
            )}
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Badge 
              variant={universe.isPublic ? 'public' : 'private'} 
              size="small"
            >
              {universe.isPublic ? 'Public' : 'Private'}
            </Badge>
            {showOwnerBadge && currentUserId === universe.userId && (
              <Badge variant="owner" size="small">
                Your Universe
              </Badge>
            )}
            {showOwner && ownerName && currentUserId !== universe.userId && (
              <Badge variant="info" size="small">
                by {ownerName}
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        {universe.description && (
          <p className="text-secondary text-sm mb-4 line-clamp-3">
            {universe.description}
          </p>
        )}

        {/* Progress */}
        <div>
          <ProgressBar 
            variant="organisational"
            value={universe.progress || 0}
            showLabel={true}
            label="Progress"
          />
        </div>

      </div>
    </Link>
  );
}

export default UniverseCard;