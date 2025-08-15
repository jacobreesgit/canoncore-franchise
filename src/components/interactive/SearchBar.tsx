import React from 'react';

/**
 * SearchBar component following the component creation guide
 */

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange'> {
  /** SearchBar variant */
  variant?: 'default' | 'large';
  /** Component size */
  size?: 'default' | 'large';
  /** Optional custom class names */
  className?: string;
  /** Search query value */
  value: string;
  /** Change handler */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Base search bar styles using design system tokens
 */
const baseStyles = `
  relative w-full
`;

/**
 * Variant styles using design system tokens
 */
const variantStyles = {
  default: `
    // Default search bar styling
  `,
  large: `
    // Larger search bar for prominent placement
  `
};

/**
 * Size styles using design system spacing tokens
 */
const sizeStyles = {
  default: '',
  large: ''
};

/**
 * SearchBar component
 */
export function SearchBar({
  variant = 'default',
  size = 'default',
  className = '',
  value,
  onChange,
  placeholder = 'Search...',
  ...props
}: SearchBarProps) {
  const containerClasses = [
    'search-bar',
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const inputClasses = variant === 'large' 
    ? 'w-full px-4 py-3 pl-12 border border-input rounded-lg text-base sm:text-lg focus:ring-2 focus:border-focus min-h-[44px]'
    : 'w-full px-4 py-2 pl-10 border border-input rounded-lg text-base focus:ring-2 focus:border-focus min-h-[40px]';

  const iconClasses = variant === 'large'
    ? 'absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'
    : 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none';

  const iconSize = variant === 'large' ? 'h-6 w-6' : 'h-5 w-5';

  return (
    <div className={containerClasses}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputClasses}
        {...props}
      />
      <div className={iconClasses}>
        <svg className={`${iconSize} text-tertiary`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}

export default SearchBar;