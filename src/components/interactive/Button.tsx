import React from 'react';
import Link from 'next/link';

/**
 * Button component with consistent styling and behavior
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant following design system */
  variant?: 'primary' | 'secondary' | 'danger' | 'clear';
  /** Button size */
  size?: 'small' | 'default' | 'large';
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Optional icon element */
  icon?: React.ReactNode;
  /** Optional custom class names */
  className?: string;
  /** Button content */
  children: React.ReactNode;
}

export interface ButtonLinkProps {
  /** Button variant following design system */
  variant?: 'primary' | 'secondary' | 'danger' | 'clear';
  /** Button size */
  size?: 'small' | 'default' | 'large';
  /** Optional icon element */
  icon?: React.ReactNode;
  /** Optional custom class names */
  className?: string;
  /** Button content */
  children: React.ReactNode;
  /** Link destination */
  href: string;
  /** Whether the link should be external */
  external?: boolean;
}

/**
 * Base button styles using design system tokens
 */
const baseStyles = 'btn-base';

/**
 * Variant styles using design system tokens from globals.css
 */
const variantStyles = {
  primary: 'btn-primary',
  secondary: 'btn-secondary', 
  danger: 'btn-danger',
  clear: 'btn-clear'
};

/**
 * Size styles using design system spacing tokens from globals.css
 */
const sizeStyles = {
  small: 'btn-small',
  default: '', // Default size is built into the variant classes
  large: 'btn-large'
};

/**
 * Button component
 */
export function Button({
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  icon,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  
  const buttonClasses = [
    'button',
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  ]
    .join(' ')
    .replace(/\\s+/g, ' ')
    .trim();

  return (
    <button
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && (
        <span className={children ? 'mr-2' : ''}>
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}

/**
 * Button Link component - renders as Link but looks like a button
 */
export function ButtonLink({
  variant = 'primary',
  size = 'default',
  href,
  external = false,
  icon,
  className = '',
  children
}: ButtonLinkProps) {
  const buttonClasses = [
    'button',
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  ]
    .join(' ')
    .replace(/\\s+/g, ' ')
    .trim();

  const content = (
    <>
      {icon && (
        <span className={children ? 'mr-2' : ''}>
          {icon}
        </span>
      )}
      {children}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        className={buttonClasses}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={buttonClasses}>
      {content}
    </Link>
  );
}

// Export both components
export default Button;