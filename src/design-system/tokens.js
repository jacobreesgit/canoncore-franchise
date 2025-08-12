/**
 * CanonCore Design System Tokens
 * 
 * Design tokens following best practices with proper primitive → semantic hierarchy.
 * Based on W3C Design Tokens specification and industry standards.
 * 
 * Structure:
 * - Primitives: Raw values (blue-600, gray-50, etc.)
 * - Semantic: Meaningful names referencing primitives (color-surface-page)
 * - Component: Component-specific tokens (button-primary-background)
 */

// PRIMITIVE TOKENS - Raw design values
const primitives = {
  // Color primitives - Consistent scale following established patterns
  color: {
    // Blue scale - Primary brand color
    blue: {
      50: '#eff6ff',
      100: '#dbeafe', 
      500: '#3b82f6',
      600: '#2563eb',   // Most used primary
      700: '#1d4ed8',
      800: '#1e40af',
    },
    
    // Gray scale - Neutral colors
    gray: {
      50: '#f9fafb',    // Lightest background
      100: '#f3f4f6',   // Secondary background
      200: '#e5e7eb',   // Borders, dividers
      300: '#d1d5db',   // Input borders
      500: '#6b7280',   // Muted text
      600: '#4b5563',   // Secondary text
      700: '#374151',   // Labels
      800: '#1f2937',   // Secondary headings
      900: '#111827',   // Primary text
    },

    // Green scale - Success, viewable content
    green: {
      100: '#dcfce7',   // Success backgrounds
      600: '#16a34a',   // Success actions
      800: '#166534',   // Success text
    },

    // Red scale - Errors, destructive actions
    red: {
      50: '#fef2f2',    // Error backgrounds
      200: '#fecaca',   // Error borders
      600: '#dc2626',   // Error actions
      700: '#b91c1c',   // Error hover
    },

    // Pure colors
    white: '#ffffff',
    black: '#000000',
  },

  // Typography primitives
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px  
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
  },

  fontWeight: {
    normal: '400',
    medium: '500', 
    bold: '700',
  },

  lineHeight: {
    tight: '1rem',      // xs
    snug: '1.25rem',    // sm
    normal: '1.5rem',   // base
    relaxed: '1.75rem', // lg, xl
    loose: '2rem',      // 2xl
    '3xl': '2.25rem',   // 3xl
  },

  // Spacing primitives
  spacing: {
    '0': '0px',
    '2': '0.5rem',      // 8px
    '3': '0.75rem',     // 12px
    '4': '1rem',        // 16px
    '6': '1.5rem',      // 24px
    '8': '2rem',        // 32px
    '16': '4rem',       // 64px
  },

  // Border radius primitives
  borderRadius: {
    lg: '0.5rem',       // 8px
    full: '9999px',     // Pills
  },

  // Container sizes
  maxWidth: {
    md: '28rem',        // 448px
    '2xl': '42rem',     // 672px
    '4xl': '56rem',     // 896px
    '7xl': '80rem',     // 1280px
  },
};

// SEMANTIC TOKENS - Meaningful names referencing primitives
const semantic = {
  // Surface colors
  'color-surface-page': 'gray-50',
  'color-surface-card': 'white',
  'color-surface-card-hover': 'gray-100',
  'color-surface-input': 'white',

  // Interactive colors
  'color-interactive-primary': 'blue-600',
  'color-interactive-primary-hover': 'blue-700',
  'color-interactive-secondary': 'gray-100',
  'color-interactive-secondary-hover': 'gray-200',
  'color-interactive-danger': 'red-600', 
  'color-interactive-danger-hover': 'red-700',

  // Text colors
  'color-text-primary': 'gray-900',
  'color-text-secondary': 'gray-600',
  'color-text-tertiary': 'gray-500',
  'color-text-on-primary': 'white',
  'color-text-link': 'blue-600',
  'color-text-link-hover': 'blue-800',
  'color-text-danger': 'red-600',

  // Border colors
  'color-border-default': 'gray-200',
  'color-border-input': 'gray-300',
  'color-border-focus': 'blue-600',
  'color-border-error': 'red-200',

  // Status colors
  'color-status-progress-track': 'gray-200',
  'color-status-progress-viewable': 'green-600',
  'color-status-progress-organisational': 'blue-600',
  'color-status-success-background': 'green-100',
  'color-status-success-text': 'green-800',
  'color-status-info-background': 'blue-100',
  'color-status-info-text': 'blue-800',
  'color-status-error-background': 'red-50',

  // Typography tokens
  'font-size-heading-page': '3xl',
  'font-size-heading-section': '2xl',
  'font-size-heading-medium': 'xl',
  'font-size-heading-item': 'lg',
  'font-size-body-primary': 'base',
  'font-size-body-secondary': 'sm',
  'font-size-body-small': 'xs',

  'font-weight-heading': 'bold',
  'font-weight-emphasis': 'medium',
  'font-weight-body': 'normal',

  'line-height-heading-page': '3xl',
  'line-height-heading-section': 'loose',
  'line-height-heading-medium': 'relaxed',
  'line-height-heading-item': 'relaxed',
  'line-height-body-primary': 'normal',
  'line-height-body-secondary': 'snug',
  'line-height-body-small': 'tight',

  // Spacing tokens
  'spacing-component-card-padding': '6',
  'spacing-component-card-padding-large': '8',
  'spacing-component-input-padding': '3',
  'spacing-component-button-padding-y': '2',
  'spacing-component-button-padding-x': '4',
  'spacing-component-button-padding-x-large': '6',
  'spacing-layout-section-gap': '8',
  'spacing-layout-element-gap': '6',
  'spacing-layout-field-gap': '4',
  'spacing-layout-small-gap': '3',
  'spacing-layout-grid-gap': '6',
  'spacing-layout-grid-gap-small': '4',
  'spacing-layout-nav-height': '16',
  'spacing-layout-page-vertical': '6',

  // Border radius tokens
  'border-radius-default': 'lg',
  'border-radius-full': 'full',

  // Container tokens
  'container-max-width-page': '7xl',
  'container-max-width-form': '2xl',  
  'container-max-width-content': '4xl',
  'container-max-width-narrow': 'md',
};

// COMPONENT TOKENS - Component-specific tokens
const components = {
  // Button component tokens
  'button-primary-background': 'color-interactive-primary',
  'button-primary-background-hover': 'color-interactive-primary-hover',
  'button-primary-text': 'color-text-on-primary',
  'button-primary-font-size': 'font-size-body-primary',
  'button-primary-font-weight': 'font-weight-emphasis',
  'button-primary-padding-y': 'spacing-component-button-padding-y',
  'button-primary-padding-x': 'spacing-component-button-padding-x',
  'button-primary-border-radius': 'border-radius-default',

  'button-secondary-background': 'color-interactive-secondary',
  'button-secondary-background-hover': 'color-interactive-secondary-hover',
  'button-secondary-text': 'color-text-primary',
  'button-secondary-font-size': 'font-size-body-primary',
  'button-secondary-font-weight': 'font-weight-emphasis',
  'button-secondary-padding-y': 'spacing-component-button-padding-y',
  'button-secondary-padding-x': 'spacing-component-button-padding-x',
  'button-secondary-border-radius': 'border-radius-default',

  'button-danger-background': 'color-interactive-danger',
  'button-danger-background-hover': 'color-interactive-danger-hover',
  'button-danger-text': 'color-text-on-primary',

  // Card component tokens
  'card-background': 'color-surface-card',
  'card-background-hover': 'color-surface-card-hover',
  'card-padding': 'spacing-component-card-padding',
  'card-padding-large': 'spacing-component-card-padding-large',
  'card-border-radius': 'border-radius-default',
  'card-gap': 'spacing-layout-grid-gap',

  // Form component tokens
  'form-input-background': 'color-surface-input',
  'form-input-border': 'color-border-input',
  'form-input-border-focus': 'color-border-focus',
  'form-input-padding': 'spacing-component-input-padding',
  'form-input-border-radius': 'border-radius-default',
  'form-field-gap': 'spacing-layout-field-gap',

  // Navigation component tokens
  'nav-background': 'color-surface-card',
  'nav-height': 'spacing-layout-nav-height',
  'nav-text': 'color-text-primary',
  'nav-link': 'color-text-link',
  'nav-link-hover': 'color-text-link-hover',

  // Progress component tokens
  'progress-track': 'color-status-progress-track',
  'progress-viewable': 'color-status-progress-viewable',
  'progress-organisational': 'color-status-progress-organisational',

  // Badge component tokens
  'badge-success-background': 'color-status-success-background',
  'badge-success-text': 'color-status-success-text',
  'badge-info-background': 'color-status-info-background',
  'badge-info-text': 'color-status-info-text',
  'badge-border-radius': 'border-radius-full',
  'badge-font-size': 'font-size-body-small',

  // Layout tokens
  'layout-page-background': 'color-surface-page',
  'layout-page-max-width': 'container-max-width-page',
  'layout-section-gap': 'spacing-layout-section-gap',
  'layout-element-gap': 'spacing-layout-element-gap',
};

// Grid layout patterns
const layout = {
  'grid-cards': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  'grid-cards-small': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',  
  'grid-form': 'grid-cols-1',
  'grid-form-two-column': 'grid-cols-1 md:grid-cols-2',
};

// Helper function to resolve token references
function resolveTokenValue(tokenName, primitives, semantic) {
  // If it's a primitive reference (e.g., 'blue-600')
  if (tokenName.includes('-') && !tokenName.startsWith('color-')) {
    const [colorFamily, shade] = tokenName.split('-');
    if (primitives.color[colorFamily] && primitives.color[colorFamily][shade]) {
      return primitives.color[colorFamily][shade];
    }
    // Handle other primitive types
    for (const [category, values] of Object.entries(primitives)) {
      if (category !== 'color' && values[tokenName]) {
        return values[tokenName];
      }
    }
  }
  
  // If it's a semantic reference (e.g., 'color-surface-page')
  if (semantic[tokenName]) {
    return resolveTokenValue(semantic[tokenName], primitives, semantic);
  }
  
  // If it's a direct primitive value
  if (primitives.color[tokenName]) {
    return primitives.color[tokenName];
  }
  
  return tokenName; // Return as-is if not found
}

// Export design tokens following W3C specification structure
module.exports = {
  primitives,
  semantic,
  components,
  layout,
  
  // Helper for resolving token values
  resolveTokenValue,
  
  // Flattened structure for easier Tailwind integration
  flatten: {
    colors: Object.keys(semantic)
      .filter(key => key.startsWith('color-'))
      .reduce((acc, key) => {
        const shortName = key.replace('color-', '').replace(/-/g, '');
        acc[shortName] = resolveTokenValue(semantic[key], primitives, semantic);
        return acc;
      }, {}),
    
    spacing: Object.keys(semantic)
      .filter(key => key.startsWith('spacing-'))
      .reduce((acc, key) => {
        const shortName = key.replace('spacing-', '').replace(/-/g, '');
        acc[shortName] = resolveTokenValue(semantic[key], primitives, semantic);
        return acc;
      }, {}),
  }
};