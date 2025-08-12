import React from 'react';

/**
 * FormLabel component with consistent styling and behavior
 */

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Label variant */
  variant?: 'default' | 'required';
  /** Optional custom class names */
  className?: string;
  /** Label content */
  children: React.ReactNode;
}

/**
 * Base label styles using design system tokens
 */
const baseStyles = `
  block text-sm font-medium text-gray-700 mb-1
`;

/**
 * Variant styles using design system tokens
 */
const variantStyles = {
  default: ``,
  required: ``
};

/**
 * FormLabel component
 */
export function FormLabel({
  variant = 'default',
  className = '',
  children,
  ...props
}: FormLabelProps) {
  const labelClasses = [
    'form-label',
    baseStyles,
    variantStyles[variant],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <label
      className={labelClasses}
      {...props}
    >
      {children}
    </label>
  );
}

export default FormLabel;