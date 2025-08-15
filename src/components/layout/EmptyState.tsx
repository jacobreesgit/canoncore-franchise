import React from 'react';
import { ButtonLink } from '../interactive/Button';

/**
 * EmptyState component with consistent styling and behavior
 */

export interface EmptyStateAction {
  /** Button text */
  text: string;
  /** Button href */
  href: string;
  /** Button variant */
  variant?: 'primary' | 'secondary';
}

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
  /** Call-to-action buttons (optional) */
  actions?: EmptyStateAction[];
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
 * Get description classes based on variant and whether actions will be shown
 */
const getDescriptionClasses = (variant: EmptyStateProps['variant'], shouldShowActions: boolean) => {
  if (variant === 'hierarchical') {
    return 'text-secondary';
  }
  return shouldShowActions ? 'text-secondary mb-6' : 'text-secondary';
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
  actions = [],
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

  const shouldShowActions = actions.length > 0;

  const containerClasses = getContainerClasses(variant);
  const titleClasses = getTitleClasses(variant);
  const descriptionClasses = getDescriptionClasses(variant, shouldShowActions);

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
        {shouldShowActions && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {actions.map((action, index) => (
              <ButtonLink
                key={index}
                variant={action.variant || 'primary'}
                href={action.href}
              >
                {action.text}
              </ButtonLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmptyState;