# CanonCore

A franchise organisation platform for cataloguing REAL existing fictional franchises (Marvel, Doctor Who, Star Wars, etc.). This is a ground-up rebuild of an existing project, focusing on core franchise organisation features.

## Current Status

**Phase 5c Complete** - Comprehensive UX Review & Form Component System with advanced content display components, Microsoft Playwright MCP integration, and professional 3-environment deployment pipeline.

## Features Implemented

### ✅ Core Platform
- **Authentication**: Google OAuth via Firebase Auth
- **Database**: Firestore with deployed security rules
- **Service Layer**: Complete with 5 core services (Universe, Content, User, Relationship, UserProgress)

### ✅ User Interface
- **Franchise Dashboard**: Lists user's universes with progress tracking and search functionality
- **Universe Detail Pages**: ContentSection with tree/grid view toggle, hierarchical navigation
- **Content Detail Pages**: Universe Context section with hierarchical tree display
- **Public Discovery**: Browse and search all public franchises with responsive CardGrid
- **User Profiles**: Display public franchises and favourites with tabbed interface

### ✅ Data Management
- **Create/Edit/Delete**: Full CRUD operations for universes and content with smart parent-based routing
- **Individual User Progress**: Per-user progress tracking - same public content shows different progress per user
- **Advanced Hierarchies**: Infinite depth parent-child relationships with recursive tree building
- **Split Content Creation**: Separate flows for viewable content (/add-viewable) and organisational content (/organise)

### ✅ Content Organisation
- **Viewable Content**: Movies, episodes, books with progress tracking (0-100%) - green progress indicators
- **Organisational Content**: Characters, locations, items with calculated progress from viewable children - blue progress indicators
- **Hierarchical Structure**: Unlimited nesting with consistent ordering by creation time across grid and tree views
- **Smart Progress Display**: Progress bars only shown for organisational content that has viewable children
- **Advanced Tree Components**: Tree, TreeNode, and ContentSection with focus modes and expandable hierarchies

### ✅ Design System
- **25+ UI Components**: Organized in 5 categories (Layout, Forms, Interactive, Content, Feedback)
- **Storybook Integration**: Comprehensive component documentation with realistic stories
- **WCAG AA Compliance**: 100% accessibility compliant with automated testing
- **Responsive Design**: Mobile-first with React-based responsive navigation
- **Design Tokens**: CSS custom properties for consistent styling

### ✅ Testing & Quality Assurance
- **Microsoft Playwright MCP**: Official MCP integration for AI-assisted testing
- **Accessibility Testing**: @axe-core/react, ESLint jsx-a11y, custom contrast validation
- **Performance Optimization**: Bundle size maintained at 99.5 kB with dynamic imports

### ✅ Deployment
- **3-Environment Pipeline**: Development, staging, and production with complete data isolation
- **Automated Deployments**: Branch-based deployments with Vercel integration
- **Firebase Projects**: canoncore-development, canoncore-staging, canoncore-production-929c5

## Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 with design tokens
- **Backend**: Firebase (Auth + Firestore)
- **Authentication**: Google OAuth
- **Design System**: Storybook with organized component hierarchy
- **Testing**: Microsoft Playwright MCP + Vitest + Accessibility testing
- **Deployment**: Vercel with 3-environment pipeline

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Clear development data (requires --force)
npm run clear-data --force

# Run Storybook design system
npm run storybook

# Run performance analysis
npm run analyze

# Test with Microsoft Playwright MCP
npm run mcp:start
```

## Project Structure

- **Documentation**: See `CLAUDE.md`, `ARCHITECTURE.md`, `MICROSOFT_MCP_SETUP.md`, and `todo.md`
- **Core Services**: `src/lib/services/` - Complete service layer (5 services)
- **Pages**: `src/app/` - Next.js App Router pages with smart routing
- **Components**: `src/components/` - 25+ organized design system components
- **Types**: `src/lib/types.ts` - Complete TypeScript interfaces
- **Utils**: `src/lib/utils/` - Accessibility and hierarchy utilities
- **Hooks**: `src/lib/hooks/` - Custom React hooks (useSearch, useScreenSize, usePageTitle)

## Next Implementation Phases

- **Phase 6a**: Advanced Content Hierarchies - Drag-and-drop organisation, nested content navigation
- **Phase 7**: Comprehensive Testing & Quality Assurance (Final Phase) - End-to-end Playwright testing, multi-browser testing, performance validation

## Key Constraints

- **REAL franchises only**: Marvel, Doctor Who, Star Wars, etc.
- **No original content creation**: Only catalogue existing franchise properties
- **British English**: Used throughout UI and documentation

---

**Last Updated**: Phase 5c Complete - UX Review & Form Component System with Microsoft Playwright MCP Integration