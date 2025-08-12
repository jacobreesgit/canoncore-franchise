import React from 'react';
import Link from 'next/link';
import { Content } from '@/lib/types';
import { ProgressBar, Badge } from './';

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
}

/**
 * Base card styles using design system tokens
 */
const baseStyles = `
  block bg-surface-card card hover:shadow-md transition-shadow
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
 * These map to our spacing tokens: p-4 = --spacing-4
 */
const sizeStyles = {
  default: 'p-4'
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
}: ContentCardProps) {
  // Auto-detect variant from content if not provided
  const contentVariant = variant || (content.isViewable ? 'viewable' : 'organisational');
  
  const cardClasses = [
    'content-card',
    baseStyles,
    variantStyles[contentVariant],
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
        <h3 className="font-medium text-gray-900 mb-2">{content.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="organisational" size="small" className="capitalize">
            {content.mediaType}
          </Badge>
          <span className="text-sm text-gray-600">
            {formatProgressText(content)}
          </span>
        </div>
        <ProgressBar 
          variant={content.isViewable ? 'viewable' : 'organisational'}
          value={getProgressValue(content)}
          showLabel={false}
        />
      </div>
    </Link>
  );
}

export default ContentCard;