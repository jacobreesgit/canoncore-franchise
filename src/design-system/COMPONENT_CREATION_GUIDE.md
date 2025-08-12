# Component Creation Guide

Create reusable UI components following the exact same format and structure as `src/components/Button.tsx`.

## Required Structure

```typescript
import React from 'react';
import Link from 'next/link'; // Only if needed

/**
 * [ComponentName] component with consistent styling and behavior
 */

export interface [ComponentName]Props extends React.[HTMLElement]Attributes<HTML[Element]Element> {
  /** Component variant */
  variant?: 'variant1' | 'variant2' | 'variant3';
  /** Component size */
  size?: 'default' | 'large';
  /** Optional custom class names */
  className?: string;
  /** Component content */
  children: React.ReactNode;
}

/**
 * Base [component] styles using design system tokens
 */
const baseStyles = `
  // Common styles here
`;

/**
 * Variant styles using design system tokens
 * These map to our spacing tokens: py-2 = --spacing-2, px-4 = --spacing-4, etc.
 */
const variantStyles = {
  variant1: `
    // Tailwind classes that use design tokens
  `,
  variant2: `
    // Tailwind classes that use design tokens
  `,
  variant3: `
    // Tailwind classes that use design tokens
  `
};

/**
 * Size styles using design system spacing tokens
 * These map to our spacing tokens: py-2 = --spacing-2, px-4 = --spacing-4, etc.
 */
const sizeStyles = {
  default: 'classes here',
  large: 'classes here'
};

/**
 * [ComponentName] component
 */
export function [ComponentName]({
  variant = 'variant1',
  size = 'default',
  className = '',
  children,
  ...props
}: [ComponentName]Props) {
  const componentClasses = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <[element]
      className={componentClasses}
      {...props}
    >
      {children}
    </[element]>
  );
}

export default [ComponentName];
```

## Process

### 1. Analysis Phase
- Search codebase for duplicate UI patterns using `Grep` tool
- Identify common className combinations and styling patterns
- Document all variants and states found in existing code
- Note any special logic or interactions that must be preserved
- **CRITICAL**: Check for existing components that should be reused instead of creating hardcoded elements

### 2. Component Design
- Create TypeScript interface with proper prop types
- Design component API that covers all existing use cases
- Plan variant system based on found patterns
- Ensure backward compatibility with existing usage

### 3. Implementation
- **Follow Button.tsx structure exactly**
- Use same patterns: baseStyles, variantStyles, sizeStyles
- Use Tailwind classes that automatically use design tokens
- **CRITICAL**: Always import and use existing components instead of hardcoded HTML elements:
  - Use `Button` and `ButtonLink` instead of `<button>` and `<Link>` with hardcoded styles
  - Use any existing components from `src/components/` before creating new hardcoded elements
  - Check `src/components/index.ts` for available components to reuse
- Maintain all existing functionality
- Keep documentation minimal like Button component
- Same class joining and cleanup logic
- Same TypeScript patterns and prop spreading

### 4. Design System Integration
- Use Tailwind classes that map to design tokens (e.g., `bg-blue-600` uses `--color-interactive-primary`)
- Reference spacing tokens through Tailwind utilities (e.g., `p-6` uses `--spacing-6`)
- Ensure consistent behavior with existing Button component patterns

### 5. Testing & Validation
- Run `npm run type-check` to verify TypeScript correctness  
- Run `npm run build` to ensure component compiles
- Test one simple replacement in an existing page
- Update component index exports
- Verify existing functionality is preserved
- **Create Storybook stories** to document all component variants and states

## Component Priority List

1. **Card** - Most common layout pattern (`bg-white rounded-lg shadow p-6`)
2. **ProgressBar** - Status indicators (`bg-gray-200`, `bg-blue-600`, `bg-green-600`)
3. **Badge** - Status labels (`bg-green-100 text-green-600`, `bg-blue-100 text-blue-800`)
4. **Modal** - Confirmation dialogs (`fixed inset-0 bg-black bg-opacity-50`)
5. **Input** - Form elements (`border border-gray-300 rounded-lg px-3 py-2`)

## Key Requirements

- ✅ Follow Button.tsx structure exactly
- ✅ Use same patterns: baseStyles, variantStyles, sizeStyles
- ✅ Use Tailwind classes that automatically use design tokens
- ✅ **REUSE EXISTING COMPONENTS**: Import and use Button, ButtonLink, etc. instead of hardcoded elements
- ✅ Maintain all existing functionality
- ✅ Keep documentation minimal like Button component
- ✅ Same class joining and cleanup logic
- ✅ Same TypeScript patterns and prop spreading
- ✅ Test with one simple replacement before proceeding
- ✅ Export properly from components/index.ts
- ✅ **CREATE STORYBOOK STORIES**: Document all variants and use cases

## Component Reuse Checklist

Before creating hardcoded HTML elements in your new component, check if these exist:

### Available Components (`src/components/index.ts`)
- `Button` - Use instead of `<button>` with styling
- `ButtonLink` - Use instead of `<Link>` with button styling  
- `FavouriteButton` - Use for favourite/bookmark functionality
- `FormActions` - Use for form Cancel/Submit button pairs (example of proper component composition)
- `Navigation` - Use for page navigation and breadcrumbs

### When Creating New Components
1. **First**: Check existing components that could be reused
2. **Second**: Import and use existing components instead of duplicating their HTML/styles
3. **Last**: Only create new hardcoded HTML elements if no existing component covers the use case

## Storybook Stories Requirements

Create `[ComponentName].stories.tsx` following the exact same format as `src/components/Button.stories.tsx`:

### Required Structure
```typescript
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { [ComponentName] } from './[ComponentName]';

const meta: Meta<typeof [ComponentName]> = {
  title: 'CanonCore/[ComponentName]',
  component: [ComponentName],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['variant1', 'variant2', 'variant3'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Create stories for each variant
export const Variant1: Story = {
  args: {
    variant: 'variant1',
    // other props
  },
};
```

### Story Requirements
- **Follow Button.stories.tsx format exactly** - Same structure, same patterns
- **All variants**: Create story for each variant prop option
- **All states**: Document loading, disabled, error states if applicable  
- **Real examples**: Use realistic content that demonstrates the component's purpose
- **Interactive controls**: Enable Storybook controls for all props
- **Documentation**: Use autodocs tag for automatic prop documentation

**Output**: One component file + one stories file, both ready for production use.