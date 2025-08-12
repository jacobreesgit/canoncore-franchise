# CanonCore Design System

A comprehensive design system built following W3C Design Tokens specification and industry best practices. This system provides the foundation for consistent visual design across the CanonCore franchise organisation platform.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Usage Guidelines](#usage-guidelines)
- [Implementation](#implementation)
- [Best Practices](#best-practices)

## 🎯 Overview

The CanonCore design system follows a **three-tier token architecture**:

```
Primitives → Semantic → Components
(Raw values) → (Meaningful names) → (Component-specific)
```

### Design Principles

1. **Consistency**: All design decisions come from a single source of truth
2. **Accessibility**: Colors meet WCAG contrast requirements
3. **Scalability**: Token hierarchy supports easy theming and updates
4. **Semantic Clarity**: Names describe purpose, not appearance
5. **Maintainability**: Changes cascade through the system automatically

## 🏗 Architecture

### Token Hierarchy

```javascript
// PRIMITIVE TOKENS (Raw values)
primitives: {
  color: { blue: { 600: '#2563eb' } },
  fontSize: { base: '1rem' },
  spacing: { 6: '1.5rem' }
}

// SEMANTIC TOKENS (Meaningful names)
semantic: {
  'color-interactive-primary': 'blue-600',
  'font-size-body-primary': 'base',
  'spacing-component-card-padding': '6'
}

// COMPONENT TOKENS (Component-specific)
components: {
  'button-primary-background': 'color-interactive-primary',
  'button-primary-font-size': 'font-size-body-primary'
}
```

### File Structure

```
src/design-system/
├── tokens.js          # Complete token definitions
├── README.md          # This documentation
└── examples/          # Usage examples
```

## 🎨 Color System

### Color Categories

#### Surface Colors
Used for backgrounds and containers:
- `color-surface-page` - Main page background (#f9fafb)
- `color-surface-card` - Card backgrounds (#ffffff)
- `color-surface-card-hover` - Card hover states (#f3f4f6)
- `color-surface-input` - Form input backgrounds (#ffffff)

#### Interactive Colors
Used for buttons, links, and interactive elements:
- `color-interactive-primary` - Primary actions (#2563eb)
- `color-interactive-primary-hover` - Primary hover states (#1d4ed8)
- `color-interactive-secondary` - Secondary actions (#f3f4f6)
- `color-interactive-danger` - Destructive actions (#dc2626)

#### Text Colors
Used for all text content:
- `color-text-primary` - Headings and high-emphasis text (#111827)
- `color-text-secondary` - Body text and descriptions (#4b5563)
- `color-text-tertiary` - Muted text and timestamps (#6b7280)
- `color-text-link` - Links and interactive text (#2563eb)

#### Status Colors
Used for progress bars and status indicators:
- `color-status-progress-viewable` - Viewable content progress (#16a34a)
- `color-status-progress-organisational` - Organisational progress (#2563eb)
- `color-status-success-background` - Success message backgrounds (#dcfce7)
- `color-status-error-background` - Error message backgrounds (#fef2f2)

### Usage Examples

```css
/* Using semantic tokens */
.primary-button {
  background: var(--color-interactive-primary);
  color: var(--color-text-on-primary);
}

.primary-button:hover {
  background: var(--color-interactive-primary-hover);
}
```

```jsx
// Using Tailwind classes (existing patterns maintained)
<button className="bg-blue-600 hover:bg-blue-700 text-white">
  Primary Button
</button>
```

## ✏️ Typography

### Type Scale

Following a consistent scale for all text sizes:

```javascript
fontSize: {
  xs: '0.75rem',    // 12px - Fine print, timestamps
  sm: '0.875rem',   // 14px - Secondary text, metadata  
  base: '1rem',     // 16px - Body text
  lg: '1.125rem',   // 18px - Item titles, emphasis
  xl: '1.25rem',    // 20px - Medium headings
  '2xl': '1.5rem',  // 24px - Section headings
  '3xl': '1.875rem', // 30px - Page titles
}
```

### Font Weights

```javascript
fontWeight: {
  normal: '400',  // Body text
  medium: '500',  // Emphasis, labels, buttons
  bold: '700',    // Headings
}
```

### Semantic Typography Tokens

- `font-size-heading-page` - Page titles (3xl, bold)
- `font-size-heading-section` - Section headings (2xl, bold)  
- `font-size-heading-item` - Item titles (lg, medium)
- `font-size-body-primary` - Main body text (base, normal)
- `font-size-body-secondary` - Secondary text (sm, normal)
- `font-size-body-small` - Fine print (xs, normal)

### Usage Examples

```css
/* Page titles */
.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-3xl);
  color: var(--color-text-primary);
}

/* Body text */
.body-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-text-secondary);
}
```

## 📏 Spacing & Layout

### Spacing Scale

Based on a consistent 4px grid system:

```javascript
spacing: {
  '0': '0px',
  '2': '0.5rem',    // 8px
  '3': '0.75rem',   // 12px - Form input padding
  '4': '1rem',      // 16px - Button padding, element spacing
  '6': '1.5rem',    // 24px - Card padding, section spacing
  '8': '2rem',      // 32px - Large section spacing
  '16': '4rem',     // 64px - Navigation height
}
```

### Layout Tokens

#### Component Spacing
- `spacing-component-card-padding` - Standard card padding (6 = 24px)
- `spacing-component-card-padding-large` - Large card padding (8 = 32px)
- `spacing-component-input-padding` - Form input padding (3 = 12px)
- `spacing-component-button-padding-x` - Button horizontal padding (4 = 16px)

#### Layout Spacing
- `spacing-layout-section-gap` - Between major sections (8 = 32px)
- `spacing-layout-element-gap` - Between related elements (6 = 24px)  
- `spacing-layout-field-gap` - Between form fields (4 = 16px)
- `spacing-layout-grid-gap` - Card grid gaps (6 = 24px)

### Container Tokens

- `container-max-width-page` - Main page container (7xl = 1280px)
- `container-max-width-form` - Form containers (2xl = 672px)
- `container-max-width-content` - Content containers (4xl = 896px)
- `container-max-width-narrow` - Narrow containers (md = 448px)

## 📖 Usage Guidelines

### When to Use Each Token Type

#### Primitives
- **Never use directly** in components
- Only reference from semantic tokens
- Used for defining color palettes and scales

#### Semantic Tokens  
- **Primary choice** for most design decisions
- Use when you need colors, typography, or spacing
- Provides meaning and context

#### Component Tokens
- **Use for component-specific styling**
- When building reusable components
- Ensures consistency within component variants

### Token Naming Convention

Follow this consistent pattern:
```
{category}-{type}-{property}-{variant}-{state}
```

Examples:
- `color-surface-card` (color for card surfaces)
- `color-interactive-primary-hover` (primary interactive color on hover)
- `spacing-component-card-padding` (padding for card components)
- `font-size-heading-page` (font size for page headings)

## 🔧 Implementation

### In Tailwind CSS v4

The tokens are automatically available through Tailwind's existing class names:

```jsx
// These existing classes now reference design tokens
<div className="bg-gray-50 text-gray-900">  
  <button className="bg-blue-600 hover:bg-blue-700 text-white p-6">
    Button
  </button>
</div>
```

### In Custom CSS

Access tokens directly via CSS custom properties:

```css
.custom-component {
  background: var(--color-surface-card);
  color: var(--color-text-primary);
  padding: var(--spacing-6);
  border-radius: var(--border-radius-lg);
}
```

### In JavaScript

Import and use tokens programmatically:

```javascript
import { primitives, semantic, components } from '@/design-system/tokens';

// Get resolved color value
const primaryColor = resolveTokenValue('color-interactive-primary', primitives, semantic);
// Returns: '#2563eb'
```

## ✅ Best Practices

### Do's

✅ **Use semantic tokens** for most styling decisions  
✅ **Follow the naming convention** consistently  
✅ **Reference existing Tailwind classes** when available  
✅ **Use component tokens** for component-specific styling  
✅ **Document new tokens** following the established patterns  

### Don'ts

❌ **Don't use primitive tokens directly** in components  
❌ **Don't hardcode color/spacing values** - use tokens  
❌ **Don't create one-off token names** - follow the system  
❌ **Don't mix different naming conventions**  
❌ **Don't bypass the token system** for "quick fixes"  

### Migration Strategy

When updating existing code:

1. **Audit existing styles** for hardcoded values
2. **Map to appropriate tokens** using semantic names
3. **Update gradually** by component or page
4. **Test thoroughly** to ensure visual consistency
5. **Document any new patterns** discovered during migration

## 🎯 Future Enhancements

### Planned Additions

- **Dark mode support** - Additional token modes for dark theme
- **Animation tokens** - Duration, easing, and transition tokens  
- **Breakpoint tokens** - Responsive design breakpoints
- **Shadow tokens** - Consistent elevation shadows
- **Component variants** - Extended component token library

### Token Evolution

The design system is built to evolve. When adding new tokens:

1. Follow the established hierarchy (primitive → semantic → component)
2. Use consistent naming conventions
3. Consider accessibility implications
4. Update documentation
5. Provide migration guidance for breaking changes

---

This design system ensures visual consistency, maintainability, and scalability for the CanonCore platform while providing flexibility for future enhancements and theming.