import React from 'react';
import { Button } from './Button';

/**
 * DeleteConfirmationModal component with consistent styling and behavior
 */

export interface DeleteConfirmationModalProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Modal variant */
  variant?: 'default';
  /** Component size */
  size?: 'default';
  /** Optional custom class names */
  className?: string;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Modal title */
  title: string;
  /** Item name being deleted */
  itemName: string;
  /** Additional warning message */
  warningMessage?: string;
  /** Whether the delete action is in progress */
  isDeleting: boolean;
  /** Delete button text (defaults to "Delete") */
  deleteButtonText?: string;
  /** Callback when cancel is clicked */
  onCancel: () => void;
  /** Callback when delete is confirmed */
  onConfirm: () => void;
}

/**
 * Base modal styles using design system tokens
 */
const baseStyles = `
  fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50
`;

/**
 * Variant styles using design system tokens
 * These map to our spacing tokens: p-6 = --spacing-6, etc.
 */
const variantStyles = {
  default: `
    // Default modal variant
  `
};

/**
 * Size styles using design system spacing tokens
 * These map to our spacing tokens: p-6 = --spacing-6
 */
const sizeStyles = {
  default: ''
};

/**
 * Modal content styles using design system tokens
 */
const getContentClasses = () => `
  bg-surface-card card max-w-md mx-4
`;

/**
 * DeleteConfirmationModal component
 */
export function DeleteConfirmationModal({
  variant = 'default',
  size = 'default',
  className = '',
  isOpen,
  title,
  itemName,
  warningMessage,
  isDeleting,
  deleteButtonText = 'Delete',
  onCancel,
  onConfirm,
  ...props
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  const modalClasses = [
    'delete-confirmation-modal',
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const contentClasses = getContentClasses();

  return (
    <div className={modalClasses} {...props}>
      <div className={contentClasses}>
        <h3 className="text-lg font-medium text-primary mb-2">
          {title}
        </h3>
        <p className="text-secondary mb-4">
          Are you sure you want to delete &ldquo;{itemName}&rdquo;? This action cannot be undone
          {warningMessage && `. ${warningMessage}`}.
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isDeleting}
            className="bg-transparent hover:bg-transparent text-secondary hover:text-primary p-0"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : deleteButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;