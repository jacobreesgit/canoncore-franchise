import React from 'react';

/**
 * ErrorMessage component with consistent styling and behavior
 */

export interface ErrorMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Error message variant */
  variant?: 'form' | 'page' | 'inline';
  /** Error message text */
  message: string;
  /** Optional custom class names */
  className?: string;
}

/**
 * Base error container styles using design system tokens
 */
const baseStyles = `
  p-4 border rounded-lg
`;

/**
 * Variant styles using design system tokens
 * Using semantic error tokens from the design system
 */
const variantStyles = {
  form: `
    mb-6 bg-red-50 border-red-200
  `,
  page: `
    mb-4 bg-red-50 border-red-200
  `,
  inline: `
    mb-2 bg-red-50 border-red-200
  `
};

/**
 * Text styles using design system tokens
 */
const textStyles = `
  text-danger
`;

/**
 * ErrorMessage component
 */
export function ErrorMessage({
  variant = 'form',
  message,
  className = '',
  ...props
}: ErrorMessageProps) {
  if (!message) return null;

  const containerClasses = [
    'error-message',
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
      role="alert"
      {...props}
    >
      <p className={textStyles}>
        {message}
      </p>
    </div>
  );
}

export default ErrorMessage;