import React from 'react';
import { Button, ButtonLink } from '../interactive/Button';
import { ProgressBar } from '../content/ProgressBar';
import { SearchBar } from '../interactive/SearchBar';
import { Breadcrumb, BreadcrumbItem } from '../interactive/Breadcrumb';
import { FavouriteButton } from '../interactive/FavouriteButton';

/**
 * PageHeader component with consistent styling and behavior
 */

export interface PageHeaderAction {
  /** Action type determines styling */
  type: 'primary' | 'secondary' | 'danger' | 'text';
  /** Action label */
  label: string;
  /** Link destination for ButtonLink actions */
  href?: string;
  /** Click handler for Button actions */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
}

export interface PageHeaderBreadcrumb {
  /** Breadcrumb label */
  label: string;
  /** Link destination */
  href?: string;
  /** Whether this is the current page */
  isCurrentPage?: boolean;
}

export interface PageHeaderProgressBar {
  /** Progress bar variant */
  variant: 'viewable' | 'organisational';
  /** Progress value (0-100) */
  value: number;
  /** Progress label */
  label: string;
}

export interface PageHeaderSearchBar {
  /** Search query value */
  value: string;
  /** Change handler */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Search bar variant */
  variant?: 'default' | 'large';
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header variant */
  variant?: 'dashboard' | 'detail' | 'form' | 'centered';
  /** Component size */
  size?: 'default';
  /** Optional custom class names */
  className?: string;
  /** Page title */
  title: string;
  /** Page description */
  description?: string;
  /** Action buttons */
  actions?: PageHeaderAction[];
  /** Breadcrumb navigation items */
  breadcrumbs?: PageHeaderBreadcrumb[];
  /** Metadata content for detail variant */
  metadata?: React.ReactNode;
  /** Extra content to display after description */
  extraContent?: React.ReactNode;
  /** Progress bar configuration */
  progressBar?: PageHeaderProgressBar;
  /** Search bar configuration */
  searchBar?: PageHeaderSearchBar;
  /** Favourite button configuration */
  favourite?: {
    targetId: string;
    targetType: 'universe' | 'content';
  };
}

/**
 * Base page header styles using design system tokens
 */
const baseStyles = `
  mb-8 bg-surface-card  card
`;

/**
 * Variant styles using design system tokens
 * These map to our spacing tokens: mb-8 = --spacing-8, etc.
 */
const variantStyles = {
  dashboard: `
    // Dashboard page header with title + actions beneath description
  `,
  detail: `
    // Detail page header with title/metadata + actions
  `,
  form: `
    // Form page header with title + description
  `,
  centered: `
    // Centered header for landing pages
    text-center
  `
};

/**
 * Size styles using design system spacing tokens
 * These map to our spacing tokens: mb-8 = --spacing-8
 */
const sizeStyles = {
  default: ''
};

/**
 * PageHeader component
 */
export function PageHeader({
  variant = 'dashboard',
  size = 'default',
  className = '',
  title,
  description,
  actions = [],
  breadcrumbs = [],
  metadata,
  extraContent,
  progressBar,
  searchBar,
  favourite,
  ...props
}: PageHeaderProps) {
  const containerClasses = [
    'page-header',
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Get title size based on variant - consistent text-3xl across all variants
  const getTitleClasses = () => {
    switch (variant) {
      case 'dashboard':
        return 'text-3xl font-bold text-primary';
      case 'detail':
        return 'text-3xl font-bold text-primary';
      case 'form':
        return 'text-3xl font-bold text-primary mb-2';
      case 'centered':
        return 'text-3xl font-bold text-primary mb-2';
      default:
        return 'text-3xl font-bold text-primary';
    }
  };

  // Render actions using existing Button components
  const renderActions = () => {
    return actions.map((action, index) => (
      <React.Fragment key={index}>
        {action.href ? (
          <ButtonLink
            variant={action.type === 'text' ? 'secondary' : action.type}
            href={action.href}
            className={action.type === 'text' ? 'text-secondary bg-transparent p-0' : ''}
          >
            {action.label}
          </ButtonLink>
        ) : (
          <Button
            variant={action.type === 'text' ? 'secondary' : action.type}
            onClick={action.onClick}
            disabled={action.disabled}
            className={action.type === 'text' ? 'text-secondary bg-transparent p-0' : ''}
          >
            {action.label}
          </Button>
        )}
      </React.Fragment>
    ));
  };

  // Convert PageHeaderBreadcrumb to BreadcrumbItem
  const breadcrumbItems: BreadcrumbItem[] = breadcrumbs.map(crumb => ({
    label: crumb.label,
    href: crumb.href,
    isCurrentPage: crumb.isCurrentPage
  }));

  // Default layout with actions beneath description
  const renderDefaultLayout = () => {
    return (
      <div className={containerClasses} {...props}>
        <div>
          <h2 className={getTitleClasses()}>{title}</h2>
          {description && (
            <p className="text-secondary mt-1">{description}</p>
          )}
          {actions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {renderActions()}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render based on variant
  
  if (variant === 'dashboard') {
    return renderDefaultLayout();
  }

  if (variant === 'detail') {
    return (
      <div className={containerClasses} {...props}>
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center gap-3">
              <h1 className={getTitleClasses()}>{title}</h1>
              {favourite && (
                <FavouriteButton 
                  targetId={favourite.targetId}
                  targetType={favourite.targetType}
                  showText={false}
                  size="large"
                />
              )}
            </div>
            {metadata && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {metadata}
              </div>
            )}
          </div>
          {actions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 md:space-x-2">
              {renderActions()}
            </div>
          )}
        </div>
        {description && (
          <p className="text-secondary mb-4">{description}</p>
        )}
        {progressBar && (
          <div className="mb-4">
            <ProgressBar 
              variant={progressBar.variant}
              size="large"
              value={progressBar.value}
              showLabel={true}
              label={progressBar.label}
            />
          </div>
        )}
        {searchBar && (
          <div className="mt-4 w-full">
            <SearchBar
              variant={searchBar.variant || 'default'}
              value={searchBar.value}
              onChange={searchBar.onChange}
              placeholder={searchBar.placeholder}
              className="w-full"
            />
          </div>
        )}
        {extraContent && extraContent}
      </div>
    );
  }

  if (variant === 'form') {
    return (
      <div className={containerClasses} {...props}>
        <h1 className={getTitleClasses()}>{title}</h1>
        {description && (
          <p className="text-secondary">{description}</p>
        )}
      </div>
    );
  }

  if (variant === 'centered') {
    return (
      <div className={containerClasses} {...props}>
        <h1 className={getTitleClasses()}>{title}</h1>
        {description && (
          <p className="text-secondary">{description}</p>
        )}
        {actions.length > 0 && (
          <div className="flex justify-center mt-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {renderActions()}
            </div>
          </div>
        )}
        {searchBar && (
          <div className="flex justify-center mt-6">
            <div className="max-w-md w-full">
              <SearchBar
                variant={searchBar.variant || 'default'}
                value={searchBar.value}
                onChange={searchBar.onChange}
                placeholder={searchBar.placeholder}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default fallback - use default layout with actions beneath description
  return renderDefaultLayout();
}

export default PageHeader;