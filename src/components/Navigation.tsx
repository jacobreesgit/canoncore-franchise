import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button, ButtonLink } from './Button';

/**
 * Navigation component with consistent styling and behavior
 */

/**
 * Helper function to build URLs with source context
 */
export function buildUrlWithContext(
  basePath: string,
  sourceContext: {
    from: 'dashboard' | 'discover' | 'profile' | 'universe' | 'content';
    profileId?: string;
    universeId?: string;
    universeName?: string;
    contentId?: string;
    contentName?: string;
  }
): string {
  const params = new URLSearchParams();
  params.set('from', sourceContext.from);
  
  if (sourceContext.profileId) {
    params.set('profileId', sourceContext.profileId);
  }
  if (sourceContext.universeId) {
    params.set('universeId', sourceContext.universeId);
  }
  if (sourceContext.universeName) {
    params.set('universeName', sourceContext.universeName);
  }
  if (sourceContext.contentId) {
    params.set('contentId', sourceContext.contentId);
  }
  if (sourceContext.contentName) {
    params.set('contentName', sourceContext.contentName);
  }
  
  return `${basePath}?${params.toString()}`;
}

export interface NavigationAction {
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

export interface NavigationProps {
  /** Navigation variant */
  variant?: 'dashboard' | 'detail' | 'form';
  /** Size variant - not used for navigation but keeping consistent with Button */
  size?: 'default';
  /** Optional custom class names */
  className?: string;
  /** Right-side action buttons */
  actions?: NavigationAction[];
  /** Show full navigation menu (Dashboard/Discover links) */
  showNavigationMenu?: boolean;
  /** Current page for active state styling */
  currentPage?: 'dashboard' | 'discover' | 'profile';
}

/**
 * Base navigation styles using design system tokens
 */
const baseStyles = `
  bg-white shadow-sm
`;

/**
 * Variant styles using design system tokens
 * These map to our spacing tokens: space-x-4 = --spacing-4, etc.
 */
const variantStyles = {
  dashboard: `
    // Full navigation for main pages
  `,
  detail: `
    // Simple navigation for detail pages
  `,
  form: `
    // Form navigation with hierarchical breadcrumbs
  `
};

/**
 * Size styles using design system spacing tokens
 * These map to our spacing tokens: h-16 = --spacing-16
 */
const sizeStyles = {
  default: 'h-16'
};

/**
 * Navigation component
 */
export function Navigation({
  variant = 'dashboard',
  size = 'default',
  className = '',
  actions = [],
  showNavigationMenu = false,
  currentPage,
  ...props
}: NavigationProps) {
  const { user, signOut } = useAuth();
  

  const navigationClasses = [
    'navigation',
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Auto-determine showNavigationMenu based on variant
  const shouldShowNavMenu = showNavigationMenu || variant === 'dashboard';

  return (
    <nav className={navigationClasses} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Brand + Navigation/Breadcrumbs */}
          <div className={`flex items-center ${shouldShowNavMenu ? 'space-x-8' : 'space-x-4'}`}>
            {/* CanonCore Brand */}
            {currentPage === 'dashboard' ? (
              <span className="text-xl font-bold text-primary">
                CanonCore
              </span>
            ) : (
              <Link href="/" className="text-xl font-bold text-primary">
                CanonCore
              </Link>
            )}

            {/* Navigation Menu (Dashboard/Discover/Profile) */}
            {shouldShowNavMenu && (
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/"
                  className={currentPage === 'dashboard' 
                    ? "text-blue-600 font-medium"
                    : "text-secondary hover:text-primary font-medium transition-colors"
                  }
                >
                  Dashboard
                </Link>
                <Link
                  href="/discover"
                  className={currentPage === 'discover'
                    ? "text-blue-600 font-medium" 
                    : "text-secondary hover:text-primary font-medium transition-colors"
                  }
                >
                  Discover
                </Link>
                {user && (
                  <Link
                    href={`/profile/${user.id}`}
                    className={currentPage === 'profile'
                      ? "text-blue-600 font-medium"
                      : "text-secondary hover:text-primary font-medium transition-colors"
                    }
                  >
                    {user.displayName || user.email}
                  </Link>
                )}
              </div>
            )}

          </div>

          {/* Right side: User actions */}
          <div className="flex items-center space-x-4">
            {/* Custom actions */}
            {actions.map((action, index) => (
              <React.Fragment key={index}>
                {action.href ? (
                  <ButtonLink
                    variant={action.type === 'text' ? 'secondary' : action.type}
                    href={action.href}
                    className={action.type === 'text' ? 'text-secondary hover:text-primary bg-transparent hover:bg-transparent p-0' : ''}
                  >
                    {action.label}
                  </ButtonLink>
                ) : (
                  <Button
                    variant={action.type === 'text' ? 'secondary' : action.type}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className={action.type === 'text' ? 'text-secondary hover:text-primary bg-transparent hover:bg-transparent p-0' : ''}
                  >
                    {action.label}
                  </Button>
                )}
              </React.Fragment>
            ))}

            {/* User authentication elements */}
            {user ? (
              <>
                {/* User greeting - only show on dashboard when nav menu is not shown */}
                {variant === 'dashboard' && !shouldShowNavMenu && (
                  <span className="text-gray-700">
                    Welcome, {user.displayName || user.email}
                  </span>
                )}

                {/* Sign out button */}
                <Button
                  variant="secondary"
                  onClick={signOut}
                >
                  Sign out
                </Button>
              </>
            ) : (
              /* Sign in for unauthenticated users */
              <ButtonLink
                variant="primary"
                href="/"
              >
                Sign In
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;