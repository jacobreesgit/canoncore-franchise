import React from 'react';

/**
 * FormInput component with consistent styling and behavior
 */

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input variant */
  variant?: 'default' | 'error';
  /** Optional custom class names */
  className?: string;
}

/**
 * Base input styles using design system tokens
 */
const baseStyles = `
  w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
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
 * FormInput component
 */
export function FormInput({
  variant = 'default',
  className = '',
  ...props
}: FormInputProps) {
  const inputClasses = [
    'form-input',
    baseStyles,
    variantStyles[variant],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <input
      className={inputClasses}
      {...props}
    />
  );
}

export default FormInput;