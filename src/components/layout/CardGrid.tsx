import React from 'react';
import { Content } from '@/lib/types';
import { ContentCard } from '../content/ContentCard';

/**
 * CardGrid component following the component creation guide
 */

export interface CardGridProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  /** CardGrid variant */
  variant?: 'default' | 'compact' | 'wide';
  /** Component size */
  size?: 'default';
  /** Optional custom class names */
  className?: string;
  /** Children elements (cards) - for manual card rendering */
  children?: React.ReactNode;
  /** Content items for automatic sorting and rendering */
  content?: Content[];
  /** Base URL for content links */
  contentHref?: (content: Content) => string;
  /** Whether to sort content by viewable/organisational */
  sortContent?: boolean;
}

/**
 * Base card grid styles using design system tokens
 */
const baseStyles = `
  grid gap-6
`;

/**
 * Variant styles using design system tokens
 */
const variantStyles = {
  default: `
    grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  `,
  compact: `
    grid-cols-1 md:grid-cols-3 lg:grid-cols-4
  `,
  wide: `
    grid-cols-1 md:grid-cols-2
  `
};

/**
 * Size styles using design system spacing tokens
 */
const sizeStyles = {
  default: ''
};

/**
 * CardGrid component
 */
export function CardGrid({
  variant = 'default',
  size = 'default',
  className = '',
  children,
  content,
  contentHref,
  sortContent = false,
  ...props
}: CardGridProps) {
  const containerClasses = [
    'card-grid',
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If content is provided, render automatically with optional sorting
  if (content && contentHref) {
    if (sortContent) {
      const viewableContent = content.filter(c => c.isViewable);
      const organisationalContent = content.filter(c => !c.isViewable);

      return (
        <div className="space-y-8">
          {viewableContent.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">Viewable Content</h2>
              <div className={containerClasses} {...props}>
                {viewableContent.map((item) => (
                  <ContentCard
                    key={item.id}
                    content={item}
                    href={contentHref(item)}
                  />
                ))}
              </div>
            </div>
          )}

          {organisationalContent.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">Organisational Content</h2>
              <div className={containerClasses} {...props}>
                {organisationalContent.map((item) => (
                  <ContentCard
                    key={item.id}
                    content={item}
                    href={contentHref(item)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    } else {
      // Render all content together without sorting
      return (
        <div className={containerClasses} {...props}>
          {content.map((item) => (
            <ContentCard
              key={item.id}
              content={item}
              href={contentHref(item)}
            />
          ))}
        </div>
      );
    }
  }

  // Fallback to manual children rendering
  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
}

export default CardGrid;