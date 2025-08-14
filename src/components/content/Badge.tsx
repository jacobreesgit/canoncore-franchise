import React from 'react';

/**
 * Badge component with consistent styling and behavior
 */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge variant */
  variant?: 'public' | 'private' | 'owner' | 'viewable' | 'organisational' | 'info';
  /** Badge size */
  size?: 'small' | 'default';
  /** Optional custom class names */
  className?: string;
  /** Badge content */
  children: React.ReactNode;
}

/**
 * Base badge styles using design system tokens
 */
const baseStyles = `
  inline-flex items-center font-medium
`;

/**
 * Variant styles using design system semantic tokens
 * Maps badge variants to semantic color tokens from the design system
 */
const variantStyles = {
  public: `
    bg-green-100 text-green-800
  `,
  private: `
    bg-gray-100 text-gray-600
  `,
  owner: `
    bg-blue-100 text-blue-800
  `,
  viewable: `
    bg-green-100 text-green-800
  `,
  organisational: `
    bg-blue-100 text-blue-800
  `,
  info: `
    bg-gray-100 text-gray-600
  `
};

/**
 * Size styles using design system spacing tokens
 * These map to our spacing tokens: px-2 = --spacing-2, py-1 = spacing token, etc.
 */
const sizeStyles = {
  small: `
    text-xs px-2 py-1
  `,
  default: `
    text-sm px-3 py-1
  `
};

/**
 * Badge component
 */
export function Badge({
  variant = 'info',
  size = 'default',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const badgeClasses = [
    'badge',
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    'rounded-full', // Using border radius token
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <span
      className={badgeClasses}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;