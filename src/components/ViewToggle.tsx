import React from 'react';
import { Button } from './Button';

/**
 * ViewToggle component with rounded toggle buttons in gray container
 */

export interface ViewToggleOption {
  value: string;
  label: string;
}

export interface ViewToggleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current selected value */
  value: string;
  /** Callback when selection changes */
  onChange: (value: string) => void;
  /** Available options */
  options: ViewToggleOption[];
  /** Optional custom class names */
  className?: string;
}

/**
 * Base toggle container styles using design system tokens
 */
const baseStyles = `
  flex bg-[var(--color-interactive-secondary)] rounded-lg p-1
`;

/**
 * Button styles for toggle options using design system tokens
 */
const buttonBaseStyles = `
  px-3 py-2 sm:py-1 rounded-md text-sm font-medium transition-colors min-h-[40px] sm:min-h-[32px] flex items-center
`;

const getButtonStyles = (isActive: boolean) => `
  ${buttonBaseStyles}
  ${isActive 
    ? 'bg-[var(--color-surface-card)] text-primary shadow-sm' 
    : 'text-secondary hover:text-primary'
  }
`;

/**
 * ViewToggle component
 */
export function ViewToggle({
  value,
  onChange,
  options,
  className = '',
  ...props
}: ViewToggleProps) {
  const containerClasses = ['view-toggle', baseStyles, className]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <div
      className={containerClasses}
      {...props}
    >
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? 'primary' : 'secondary'}
          onClick={() => onChange(option.value)}
          className={getButtonStyles(value === option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

export default ViewToggle;