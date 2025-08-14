import React from 'react';

/**
 * ProgressBar component with consistent styling and behavior
 */

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Component variant */
  variant?: 'viewable' | 'organisational';
  /** Component size */
  size?: 'default' | 'large';
  /** Optional custom class names */
  className?: string;
  /** Progress value (0-100) */
  value: number;
  /** Whether to show label and percentage */
  showLabel?: boolean;
  /** Custom label text (defaults to "Progress") */
  label?: string;
}

/**
 * Base progress bar styles using design system tokens
 */
const baseStyles = `
  w-full
`;

/**
 * Variant styles using design system tokens
 * These map to our progress component tokens
 */
const variantStyles = {
  viewable: `
    // Uses progress-viewable token (green-600)
  `,
  organisational: `
    // Uses progress-organisational token (blue-600)  
  `
};

/**
 * Size styles using design system spacing tokens
 */
const sizeStyles = {
  default: 'h-2',
  large: 'h-3'
};

/**
 * Get progress bar color based on variant using design system tokens
 */
const getProgressColor = (variant: ProgressBarProps['variant']) => {
  switch (variant) {
    case 'viewable':
      return 'bg-[var(--progress-viewable)]';
    case 'organisational':
      return 'bg-[var(--progress-organisational)]';
    default:
      return 'bg-[var(--progress-organisational)]';
  }
};

/**
 * Get background container classes using design system tokens
 */
const getContainerClasses = (size: ProgressBarProps['size']) => {
  return `w-full bg-[var(--progress-track)] rounded-full ${sizeStyles[size || 'default']}`;
};

/**
 * ProgressBar component
 */
export function ProgressBar({
  variant = 'organisational',
  size = 'default',
  className = '',
  value,
  showLabel = false,
  label = 'Progress',
  ...props
}: ProgressBarProps) {
  const progressBarClasses = [
    'progress-bar',
    baseStyles,
    variantStyles[variant],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const containerClasses = getContainerClasses(size);
  const progressColor = getProgressColor(variant);
  const progressHeight = sizeStyles[size || 'default'];
  
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(Math.max(value || 0, 0), 100);

  return (
    <div className={progressBarClasses} {...props}>
      {showLabel && (
        <div className="flex justify-end text-sm text-secondary mb-1">
          <span>{Math.round(normalizedValue)}%</span>
        </div>
      )}
      <div className={containerClasses}>
        <div
          className={`${progressColor} ${progressHeight} rounded-full transition-all`}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;