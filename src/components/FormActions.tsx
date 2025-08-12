import React from 'react';
import { Button, ButtonLink } from './Button';

/**
 * FormActions component with consistent styling and behavior
 */

export interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Form action variant */
  variant?: 'create' | 'update' | 'add';
  /** Component size */
  size?: 'default';
  /** Optional custom class names */
  className?: string;
  /** Cancel destination URL */
  cancelHref: string;
  /** Submit button disabled state */
  isSubmitting?: boolean;
  /** Custom submit label override */
  submitLabel?: string;
  /** Custom submitting label override */
  submittingLabel?: string;
}

/**
 * Base form actions styles using design system tokens
 */
const baseStyles = `
  flex items-center justify-between pt-4
`;

/**
 * Variant styles using design system tokens
 * These map to our spacing tokens: py-2 = --spacing-2, px-4 = --spacing-4, etc.
 */
const variantStyles = {
  create: `
    // Create form variant
  `,
  update: `
    // Update form variant
  `,
  add: `
    // Add form variant
  `
};

/**
 * Size styles using design system spacing tokens
 * These map to our spacing tokens: py-2 = --spacing-2, px-4 = --spacing-4, etc.
 */
const sizeStyles = {
  default: ''
};

/**
 * FormActions component
 */
export function FormActions({
  variant = 'create',
  size = 'default',
  className = '',
  cancelHref,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
  ...props
}: FormActionsProps) {
  const containerClasses = [
    'form-actions',
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Get default labels based on variant
  const getLabels = () => {
    switch (variant) {
      case 'create':
        return {
          submit: submitLabel || 'Create Franchise',
          submitting: submittingLabel || 'Creating...'
        };
      case 'update':
        return {
          submit: submitLabel || 'Save Changes',
          submitting: submittingLabel || 'Saving...'
        };
      case 'add':
        return {
          submit: submitLabel || 'Add Content',
          submitting: submittingLabel || 'Adding...'
        };
      default:
        return {
          submit: submitLabel || 'Submit',
          submitting: submittingLabel || 'Submitting...'
        };
    }
  };

  const labels = getLabels();

  return (
    <div
      className={containerClasses}
      {...props}
    >
      <ButtonLink
        variant="secondary"
        href={cancelHref}
        className="text-gray-600 hover:text-gray-900 bg-transparent hover:bg-transparent p-0"
      >
        Cancel
      </ButtonLink>
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? labels.submitting : labels.submit}
      </Button>
    </div>
  );
}

export default FormActions;