import React from 'react';
import { ButtonLink } from './Button';

/**
 * EmptyState component with consistent styling and behavior
 */

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Component variant */
  variant?: 'default' | 'hierarchical';
  /** Component size */
  size?: 'default';
  /** Optional custom class names */
  className?: string;
  /** Empty state title */
  title: string;
  /** Empty state description */
  description: string;
  /** Call-to-action button text (optional) */
  actionText?: string;
  /** Call-to-action button href (optional) */
  actionHref?: string;
  /** Whether to show the CTA button (defaults to true if actionText and actionHref provided) */
  showAction?: boolean;
}

/**
 * Base empty state styles using design system tokens
 */
const baseStyles = `
  text-center
`;

/**
 * Variant styles using design system tokens
 * These map to our spacing tokens: py-12 = --spacing-12, etc.
 */
const variantStyles = {
  default: `
    // Default empty state for general use
  `,
  hierarchical: `
    // Empty state for hierarchical content (simpler styling)
  `
};

/**
 * Size styles using design system spacing tokens
 * These map to our spacing tokens: py-12 = --spacing-12
 */
const sizeStyles = {
  default: ''
};

/**
 * Get container classes based on variant
 */
const getContainerClasses = (variant: EmptyStateProps['variant']) => {
  if (variant === 'hierarchical') {
    return '';
  }
  return 'bg-surface-card card';
};

/**
 * Get title classes based on variant
 */
const getTitleClasses = (variant: EmptyStateProps['variant']) => {
  if (variant === 'hierarchical') {
    return 'text-lg font-medium text-secondary';
  }
  return 'text-lg font-medium text-primary mb-2';
};

/**
 * Get description classes based on variant and whether action will be shown
 */
const getDescriptionClasses = (variant: EmptyStateProps['variant'], shouldShowAction: boolean) => {
  if (variant === 'hierarchical') {
    return 'text-secondary';
  }
  return shouldShowAction ? 'text-secondary mb-6' : 'text-secondary';
};

/**
 * EmptyState component
 */
export function EmptyState({
  variant = 'default',
  size = 'default',
  className = '',
  title,
  description,
  actionText,
  actionHref,
  showAction = true,
  ...props
}: EmptyStateProps) {
  const emptyStateClasses = [
    'empty-state',
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const shouldShowAction = showAction && actionText && actionHref;

  const containerClasses = getContainerClasses(variant);
  const titleClasses = getTitleClasses(variant);
  const descriptionClasses = getDescriptionClasses(variant, !!shouldShowAction);

  // Hierarchical variant has simpler structure
  if (variant === 'hierarchical') {
    return (
      <div className={emptyStateClasses} {...props}>
        <p className={titleClasses}>
          {title}
        </p>
      </div>
    );
  }

  // Default and search variants have full structure
  return (
    <div className={emptyStateClasses} {...props}>
      <div className={containerClasses}>
        <h3 className={titleClasses}>
          {title}
        </h3>
        <p className={descriptionClasses}>
          {description}
        </p>
        {shouldShowAction && (
          <ButtonLink
            variant="primary"
            href={actionHref}
          >
            {actionText}
          </ButtonLink>
        )}
      </div>
    </div>
  );
}

export default EmptyState;