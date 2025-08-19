import React from 'react';

/**
 * Breadcrumb component for hierarchical navigation
 */

export interface BreadcrumbItem {
  /** Display text for breadcrumb item */
  label: string;
  /** Link destination (optional for clickable items) */
  href?: string;
  /** Click handler for interactive navigation */
  onClick?: () => void;
  /** Whether this is the current page */
  isCurrentPage?: boolean;
}

export interface BreadcrumbProps {
  /** Breadcrumb items to display */
  items: BreadcrumbItem[];
  /** Optional custom class names */
  className?: string;
}

/**
 * Breadcrumb component
 * Matches the design from PageHeader's hardcoded breadcrumb implementation
 */
export function Breadcrumb({
  items,
  className = '',
}: BreadcrumbProps) {
  if (items.length === 0) return null;

  const containerClasses = [
    'breadcrumb',
    'mb-2 overflow-x-auto',
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <nav className={containerClasses} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-secondary min-w-max">
        {items.map((item, index) => (
          <li key={index} className="flex items-center whitespace-nowrap">
            {index > 0 && (
              <span className="text-tertiary mr-2">/</span>
            )}
            {item.onClick && !item.isCurrentPage ? (
              <button
                onClick={item.onClick}
                className="text-link hover:text-link-hover transition-colors cursor-pointer"
                aria-current={item.isCurrentPage ? 'page' : undefined}
              >
                {item.label}
              </button>
            ) : item.href && !item.isCurrentPage ? (
              <a
                href={item.href}
                className="text-link hover:text-link-hover transition-colors"
                aria-current={item.isCurrentPage ? 'page' : undefined}
              >
                {item.label}
              </a>
            ) : (
              <span
                className={item.isCurrentPage ? 'text-primary font-medium' : 'text-secondary'}
                aria-current={item.isCurrentPage ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;