import React from 'react';

/**
 * LoadingSpinner component with consistent styling and behavior
 */

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Loading spinner variant */
  variant?: 'fullscreen' | 'inline' | 'small';
  /** Loading message */
  message?: string;
  /** Optional custom class names */
  className?: string;
}

/**
 * Base loading container styles using design system tokens
 */
const baseStyles = `
  flex items-center justify-center
`;

/**
 * Variant styles using design system tokens
 * These map to our spacing tokens: py-6 = --spacing-6, etc.
 */
const variantStyles = {
  fullscreen: `
    min-h-screen
  `,
  inline: `
    py-8
  `,
  small: `
    py-4
  `
};

/**
 * Message styles using design system tokens
 */
const messageStyles = {
  fullscreen: `
    text-lg text-gray-600
  `,
  inline: `
    text-base text-gray-600
  `,
  small: `
    text-sm text-gray-500
  `
};

/**
 * LoadingSpinner component
 */
export function LoadingSpinner({
  variant = 'fullscreen',
  message = 'Loading...',
  className = '',
  ...props
}: LoadingSpinnerProps) {
  const containerClasses = [
    'loading-spinner',
    baseStyles,
    variantStyles[variant],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const messageClasses = messageStyles[variant]
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <div
      className={containerClasses}
      {...props}
    >
      <div className={messageClasses}>
        {message}
      </div>
    </div>
  );
}

export default LoadingSpinner;