import React from 'react';

/**
 * PageContainer component with consistent styling and behavior
 */

export interface PageContainerProps extends React.HTMLAttributes<HTMLElement> {
  /** Container variant */
  variant?: 'wide' | 'narrow';
  /** Optional custom class names */
  className?: string;
  /** Container content */
  children: React.ReactNode;
}

/**
 * Base container styles using design system tokens
 */
const baseStyles = `
  mx-auto py-6 px-4 sm:px-6 lg:px-8
`;

/**
 * Variant styles using design system tokens
 * These map to our container tokens: max-w-7xl = --container-max-width-page, etc.
 */
const variantStyles = {
  wide: `
    max-w-7xl
  `,
  narrow: `
    max-w-2xl
  `
};

/**
 * PageContainer component
 */
export function PageContainer({
  variant = 'wide',
  className = '',
  children,
  ...props
}: PageContainerProps) {
  const containerClasses = [
    'page-container',
    baseStyles,
    variantStyles[variant],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <div
      className={containerClasses}
      {...props}
    >
      {children}
    </div>
  );
}

export default PageContainer;