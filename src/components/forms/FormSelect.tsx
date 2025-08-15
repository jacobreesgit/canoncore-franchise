import React from 'react';

/**
 * FormSelect component with consistent styling and behavior matching FormInput and FormTextarea
 */

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Select variant */
  variant?: 'default' | 'error';
  /** Optional custom class names */
  className?: string;
  /** Child option elements */
  children: React.ReactNode;
}

/**
 * Base select styles using design system tokens - matches FormInput and FormTextarea exactly
 */
const baseStyles = `
  w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white
`;

/**
 * Variant styles using design system tokens
 * These map to our border tokens: border-gray-300 = --color-border-input, etc.
 */
const variantStyles = {
  default: `
    border-gray-300
  `,
  error: `
    border-red-300 focus:ring-red-500 focus:border-red-500
  `
};

/**
 * FormSelect component
 */
export function FormSelect({
  variant = 'default',
  className = '',
  children,
  ...props
}: FormSelectProps) {
  const selectClasses = [
    'form-select',
    baseStyles,
    variantStyles[variant],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <select
      className={selectClasses}
      {...props}
    >
      {children}
    </select>
  );
}

