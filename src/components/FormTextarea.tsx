import React from 'react';

/**
 * FormTextarea component with consistent styling and behavior
 */

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Textarea variant */
  variant?: 'default' | 'error';
  /** Optional custom class names */
  className?: string;
}

/**
 * Base textarea styles using design system tokens
 */
const baseStyles = `
  w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical
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
 * FormTextarea component
 */
export function FormTextarea({
  variant = 'default',
  className = '',
  ...props
}: FormTextareaProps) {
  const textareaClasses = [
    'form-textarea',
    baseStyles,
    variantStyles[variant],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <textarea
      className={textareaClasses}
      {...props}
    />
  );
}

export default FormTextarea;