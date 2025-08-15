# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CanonCore is a franchise organisation platform for cataloguing REAL existing fictional franchises (Marvel, Doctor Who, Star Wars, etc.). This is a ground-up rebuild of an existing project, following the MVP specification in LOVABLE_MVP_SPEC.md.

**Critical Constraint**: Users can ONLY organise existing fictional franchises - NEVER create original content. The platform is purely for cataloguing established franchise universes and tracking viewing progress.

## Development Commands

**IMPORTANT**: Never run `npm run dev` automatically. Always ask the user to start the development server themselves.

```bash
# Start development server (USER SHOULD RUN THIS)
npm run dev

# Build for production  
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check

# Clear development data (requires --force flag)
npm run clear-data --force

# Deployment commands
npm run deploy              # Deploy to production
npm run deploy:preview      # Deploy preview/staging
npm run storybook          # Run Storybook dev server
npm run build-storybook    # Build Storybook for deployment

# Performance analysis commands
npm run analyze             # Analyze bundle size and dependencies
npm run lighthouse          # Run Lighthouse performance audit
```

## Development Data Management

The project includes a script to clear development data from Firestore:

```bash
npm run clear-data --force
```

**Important Notes:**
- Requires `--force` flag to run as a safety measure
- Clears **all collections except `users`** (automatically discovers collections)
- **Preserves user accounts** (users collection is untouched)
- May encounter permission errors due to Firestore security rules (expected)
- If script fails, manually delete collections via Firebase Console
- Useful for testing from a clean state during development

## Project Documentation

This project includes comprehensive documentation across multiple files:

- **ARCHITECTURE.md** - Complete system architecture, data flows, and component organisation
- **ACCESSIBILITY.md** - WCAG AA compliance guidelines and accessibility testing procedures  
- **DEPLOYMENT.md** - Step-by-step Vercel deployment guide and environment setup
- **LOVABLE_MVP_SPEC.md** - Original MVP specification and technical requirements
- **README.md** - Project overview and quick start guide
- **todo.md** - Implementation roadmap and completed phases

## Architecture Overview

**For complete architecture details, data flows, and component responsibilities, see ARCHITECTURE.md**

### Tech Stack
- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4  
- **Backend**: Firebase (Auth + Firestore)
- **Authentication**: Google OAuth via Firebase Auth

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Franchise dashboard (lists user's universes)
│   ├── content/
│   │   └── [id]/
│   │       └── page.tsx   # Content detail pages (viewable/organisational content)
│   ├── discover/
│   │   └── page.tsx       # Public franchise discovery page
│   ├── profile/
│   │   └── [userId]/
│   │       ├── page.tsx   # User profile pages with favourites
│   │       └── edit/
│   │           └── page.tsx # Profile edit form
│   └── universes/
│       ├── create/
│       │   └── page.tsx   # Universe creation form
│       └── [id]/
│           ├── page.tsx   # Universe detail pages
│           ├── edit/
│           │   └── page.tsx # Universe edit form
│           └── content/
│               ├── create/
│               │   └── page.tsx # Content creation form
│               └── [contentId]/
│                   └── edit/
│                       └── page.tsx # Content edit form
├── lib/
│   ├── contexts/          # React contexts (AuthContext implemented)
│   ├── services/          # Firebase service layer (all 5 services implemented)
│   ├── hooks/             # Custom React hooks
│   │   ├── index.ts           # Hook exports
│   │   ├── usePageTitle.ts    # Page title management hook
│   │   ├── useScreenSize.ts   # Responsive screen size detection hook with Tailwind breakpoints
│   │   └── useSearch.ts       # Dynamic search hook with Fuse.js code splitting
│   ├── utils/             # Utility functions
│   │   ├── accessibility.ts   # WCAG AA compliance utilities
│   │   └── accessibility.test.ts # Accessibility testing
│   ├── firebase.ts        # Firebase configuration
│   └── types.ts           # TypeScript interfaces
├── components/            # Organized component system (17 components)
│   ├── layout/            # Page structure & containers (6 components)
│   │   ├── PageContainer, PageHeader, Navigation
│   │   ├── CardGrid, EmptyState, DeleteConfirmationModal
│   │   └── *.stories.tsx  # Storybook stories for each component
│   ├── forms/             # Form controls & validation (4 components)
│   │   ├── FormInput, FormLabel, FormTextarea, FormActions
│   │   └── *.stories.tsx  # Storybook stories for each component
│   ├── interactive/       # Buttons, toggles, inputs (4 components)
│   │   ├── Button, FavouriteButton, SearchBar, ViewToggle
│   │   └── *.stories.tsx  # Storybook stories for each component
│   ├── content/          # Cards, badges, progress (4 components)
│   │   ├── UniverseCard, ContentCard, ProgressBar, Badge
│   │   └── *.stories.tsx  # Storybook stories for each component
│   ├── feedback/         # Loading, errors, empty states (2 components)
│   │   ├── LoadingSpinner, ErrorMessage
│   │   └── *.stories.tsx  # Storybook stories for each component
│   └── index.ts          # Organized barrel exports with logical groupings
└── design-system/        # Design system documentation and tokens
```

## Routing Conventions

The application follows **hierarchical routing** that mirrors the data relationships and user navigation patterns. All routes use Next.js 15 App Router with consistent patterns:

### **Route Structure**

```
/                                                    # Dashboard (user's universes)
/discover                                            # Public universe discovery

# Universe Operations (grouped by universe ownership)
/universes/create                                    # Create new universe
/universes/[id]                                      # View universe details
/universes/[id]/edit                                 # Edit universe
/universes/[id]/content/create                       # Add content to universe
/universes/[id]/content/[contentId]/edit             # Edit universe content

# Direct Content Access
/content/[id]                                        # View any content directly

# Profile Operations (grouped by user)
/profile/[userId]                                    # View user profile
/profile/[userId]/edit                               # Edit own profile (permission-gated)
```

### **Routing Principles**

1. **Hierarchical Organisation**: Edit operations are nested under their parent resources
   - Universe edits: `/universes/[id]/edit` 
   - Content edits: `/universes/[id]/content/[contentId]/edit` (grouped with universe)
   - Profile edits: `/profile/[userId]/edit` (grouped with profile)

2. **Permission Context**: Route structure reflects permission boundaries
   - Universe routes require universe ownership for edit operations
   - Content routes inherit universe permissions
   - Profile routes require user authentication and ownership verification

3. **Navigation Flow**: Routes match natural user navigation patterns
   - Dashboard → Universe → Content → Edit
   - Dashboard → Profile → Edit
   - Direct content access via `/content/[id]` for cross-universe linking

4. **Consistency**: All resource edit operations follow pattern: `/{resource}/[id]/edit`

### **Parameter Conventions**

- `[id]` - Primary resource identifier (universe ID, content ID)
- `[userId]` - User identifiers for profiles 
- `[contentId]` - Content identifiers when nested under universe context
- Route parameters are extracted via `useParams()` with TypeScript casting

### Current Implementation Status

**Completed (Foundation + Phase 1-4d Complete):**
- Next.js 15 + React 19 + TypeScript setup
- Firebase Auth + Firestore configuration with deployed security rules
- AuthContext with Google OAuth integration and account selection
- Complete TypeScript interfaces for franchise data including UserProgress
- Basic app layout with sign-in/dashboard flow
- **Service Layer** - All 5 core services implemented (UniverseService, ContentService, UserService, RelationshipService, UserProgressService)
- **Franchise Dashboard** - Lists user's universes with user-specific progress tracking, responsive grid layout, navigation
- **Universe Detail Pages** - Shows universe details, content by type (viewable/organisational), owner permissions, tree/grid view toggle, hierarchical navigation
- **Content Detail Pages** - Individual content viewing with user-specific progress tracking, breadcrumb navigation
- **Public Discovery** - Browse and search all public franchises with responsive interface
- **User Profiles** - Display public franchises and favourites with tabbed interface (favourites functionality fully implemented)
- **Universe Creation Forms** - Complete form for creating new franchises with validation and Firebase integration
- **Content Creation Forms** - Comprehensive forms for adding content with media type selection, parent selection for hierarchies, and permissions
- **Universe Edit Forms** - Complete edit functionality for updating franchise details with pre-populated data
- **Content Edit Forms** - Full content editing with media type selection and automatic viewable detection
- **Delete Operations** - Universe and content deletion with confirmation modals and proper error handling
- **Individual User Progress** - Per-user progress tracking with UserProgress collection, same content shows different progress per user
- **Advanced Hierarchical Content Organisation** - Infinite depth parent-child relationships, recursive tree building, expandable tree navigation, calculated progress for organisational content
- **Polished UI & Progress Indicators** - Consistent progress bar colors (green for viewable, blue for organisational), smart progress display logic, consistent ordering across grid/tree views, conditional progress text colors
- **Complete Design System Foundation** - 17 reusable UI components with Storybook stories, design tokens, and consistent patterns
- **Navigation Component System** - Unified Navigation component with breadcrumbs, source context support, and consistent patterns across all pages
- **Form Component System** - FormInput, FormLabel, FormTextarea, FormActions with validation and error handling
- **Layout Components** - PageContainer, PageHeader, CardGrid, ViewToggle for consistent page structure
- **Interactive Components** - Button, Badge, SearchBar, ProgressBar, FavouriteButton with design token integration
- **State Components** - LoadingSpinner, ErrorMessage, EmptyState, DeleteConfirmationModal for user feedback
- **Content Display** - UniverseCard, ContentCard with progress tracking and responsive design
- **Mobile Responsive Design** - Mobile-first design patterns with React-based responsive navigation across all 10 pages
- **Navigation Responsive System** - Hamburger menu for mobile screens, desktop navigation menu, React-based screen size detection with useIsMobile hook
- **Comprehensive Accessibility Implementation** - WCAG AA compliant design with automated checking via @axe-core/react, ESLint accessibility rules, and custom contrast validation
- **Fixed Critical Accessibility Issues** - ErrorMessage contrast compliance (5.91:1 ratio), enhanced ViewToggle with blue active states and white text
- **Component Organisation & Structure** - Logical component folders (layout, forms, interactive, content, feedback) with organized Storybook hierarchy
- **Deployment Configuration** - Vercel deployment setup with environment separation, optimized build configuration, and comprehensive deployment documentation
- **Phase 5a Performance Optimization Complete** - Bundle size optimization maintaining 99.5 kB shared bundle, dynamic imports for Fuse.js and axe-core, image optimization with WebP/AVIF formats, security headers, and comprehensive caching strategies
- **Professional 3-Environment Pipeline Complete** - Enterprise-grade deployment architecture with development/staging/production separation using canoncore-development, canoncore-staging, and canoncore-production-929c5 Firebase projects with complete data isolation and automated branch-based deployments

**Next Implementation Phases (see todo.md):**
5. **Phase 5c: UX Review** - Flow optimization and user experience improvements
6. **Phase 6a-6b: Advanced Content Hierarchies & Legacy Review** - Drag-and-drop organisation, old project analysis
7. **Phase 7: Testing** (Final Phase) - Unit tests, integration tests, security rule testing

## Data Model

The system uses a hierarchical franchise organisation model:

### Core Entities
- **Universe**: Top-level franchise container (e.g., "Marvel Cinematic Universe")
- **Content**: Viewable content (episodes, movies, books) and organisational content (characters, locations, collections) within a franchise
- **User**: Fan accounts with Google OAuth
- **Favourite**: User bookmarks for franchises/content
- **ContentRelationship**: Hierarchical links between content items

### Key TypeScript Interfaces

```typescript
// Franchise container
interface Universe {
  id: string;
  name: string;
  description: string;
  userId: string;        // Owner
  isPublic: boolean;     // Visibility
  progress?: number;     // Viewing progress
  // ... timestamps
}

// Franchise elements (viewable and organisational content)
interface Content {
  id: string;
  name: string;
  universeId: string;
  isViewable: boolean;          // true for viewable content, false for organisational content
  mediaType: 'video' | 'audio' | 'text' | 'character' | 'location' | ...;
  progress?: number;            // Only for viewable content
  calculatedProgress?: number;  // For organisational holders
  // ... other fields
}
```

## Authentication Flow

1. Google OAuth via Firebase Auth
2. AuthContext manages user state across app
3. User documents auto-created in Firestore on first sign-in
4. Protected routes redirect unauthenticated users

## Development Guidelines

### TypeScript Usage
- Strict mode enabled, no `any` types
- Use interfaces from `src/lib/types.ts`
- All service methods must return proper types

### Firebase Integration  
- Use `src/lib/firebase.ts` for Firebase config
- All Firestore operations should go through service layer (when implemented)
- Auth operations use AuthContext

### Progress Tracking Rules
- **ONLY viewable content** (movies, episodes, books, audio) can be directly marked as watched
- **Individual per user**: Same public content can have different progress for each user (100% for User A, 0% for User B)
- **Organisational holders** (series, phases) show calculated progress based on contained viewable content
- Progress propagates up hierarchies: viewable content → organisational holders → franchise progress
- **Current limitation**: Progress is shared across users (needs individual tracking implementation)

### British English
- Use British English spelling throughout (organisation, cataloguing, favourites, optimise)
- This applies to UI text, comments, and documentation

### Content Terminology
- Use **"Viewable Content"** for movies, episodes, books, audio (content that can be watched/consumed)
- Use **"Organisational Content"** for characters, locations, collections, series (content that helps organise)
- Never use old terms: ~~"Watchable Content"~~, ~~"Characters & Locations"~~, ~~"Reference Material"~~
- This terminology must be consistent across all UI, documentation, and code comments

## Franchise Content Rules

### Allowed Content
- REAL existing franchises only (Marvel, Doctor Who, Star Wars, DC, LOTR, etc.)
- Established movies, TV shows, books, characters from actual franchises
- Official franchise hierarchies and relationships

### Forbidden Content
- **NEVER** allow creation of original fictional content
- **NEVER** provide tools for creating new characters, stories, or fictional elements
- Users can only catalogue and organise existing, established franchise properties

## Component System (Phase 4a-4d Complete)

### Navigation Component
Unified navigation system with consistent patterns across all pages:

```typescript
import { Navigation, PageContainer, PageHeader, Button, LoadingSpinner } from '@/components';

// Example page structure with design system
<PageContainer>
  <Navigation variant="dashboard" currentPage="dashboard" showNavigationMenu={true} />
  <PageHeader 
    title="Dashboard"
    breadcrumbs={[
      { label: 'Dashboard', href: '/' }
    ]}
    actions={
      <Button variant="primary" href="/universes/create">
        Create Universe
      </Button>
    }
  />
  {loading ? <LoadingSpinner /> : <Content />}
</PageContainer>
```

**Organized Design System (17 Components in 5 Categories):**

- **Layout Components (6)**: PageContainer, PageHeader, Navigation, CardGrid, EmptyState, DeleteConfirmationModal
- **Form Components (4)**: FormInput, FormLabel, FormTextarea, FormActions  
- **Interactive Components (4)**: Button, FavouriteButton, SearchBar, ViewToggle
- **Content Display (4)**: UniverseCard, ContentCard, ProgressBar, Badge
- **Feedback Components (2)**: LoadingSpinner, ErrorMessage
- **Design Tokens**: CSS custom properties for colors, spacing, and typography throughout

**Storybook Organization:**
- Components organized in logical hierarchy: `CanonCore/Layout/`, `CanonCore/Forms/`, etc.
- Each component includes comprehensive stories with realistic use cases
- Accessibility testing integrated via @storybook/addon-a11y

**Responsive Design System:**
- **useScreenSize Hook**: Custom hook for detecting window dimensions with SSR-safe implementation
- **useIsMobile Hook**: Tailwind-breakpoint-aware mobile detection (`sm`, `md`, `lg`, `xl`, `2xl`)
- **React-Based Responsive Logic**: JavaScript conditional rendering instead of CSS media queries for complex responsive navigation
- **Navigation Component**: Uses `useIsMobile('md')` for responsive hamburger menu and desktop navigation switching

## Service Layer (Phase 1 Complete)

All services are implemented in `src/lib/services/` and exported via index:

```typescript
import { universeService, contentService, userService, relationshipService, userProgressService } from '@/lib/services';

// Example usage:
const universes = await universeService.getUserUniversesWithProgress(userId);
const content = await contentService.getByUniverseWithUserProgress(universeId, userId);
await userService.addToFavourites(userId, universeId, 'universe');
const hierarchy = await relationshipService.buildHierarchyTree(universeId);
await userProgressService.setUserProgress(userId, { contentId, universeId, progress: 100 });
```

**Service Capabilities:**
- **UniverseService**: Full CRUD, public/private, user-specific progress calculation, search
- **ContentService**: Viewable/organisational content management, user-specific progress updates, calculated progress for organisational content
- **UserService**: Profile management, favourites system, activity tracking
- **RelationshipService**: Hierarchical organisation, tree building, path navigation, parent-child relationships
- **UserProgressService**: Individual user progress tracking, per-user progress states, organisational progress calculation

## Firebase Security

- User documents: Users can read/write own documents only
- Universe documents: Public read for isPublic=true, owner read/write for own
- Content documents: Inherit universe visibility rules
- All operations require proper authentication

## Professional Deployment Architecture (Phase 5b Complete)

CanonCore implements enterprise-grade deployment architecture with complete environment separation and automated deployments.

### **3-Environment Pipeline**

```
Development Environment:
├── Branch: develop
├── Firebase: canoncore-development  
├── URL: http://localhost:3000
├── Config: .env.local
└── Data: Safe development testing

Staging Environment:
├── Branch: staging
├── Firebase: canoncore-staging
├── URL: https://canoncore-o3gmncb7o-jacob-rees-projects.vercel.app
├── Config: Vercel preview environment variables
└── Data: Production-like testing environment

Production Environment:
├── Branch: main
├── Firebase: canoncore-production-929c5
├── URL: https://canoncore-4wcorlbw6-jacob-rees-projects.vercel.app
├── Config: Vercel production environment variables
└── Data: Live user data
```

### **Git Workflow**

**Standard Development Flow:**
```bash
# Feature development
git checkout develop
git checkout -b feature/new-feature
# ... develop feature ...
git push origin feature/new-feature

# Staging deployment
git checkout staging
git merge feature/new-feature
git push  # Auto-deploys to staging environment

# Production deployment  
git checkout main
git merge staging
git push  # Auto-deploys to production
```

**Emergency Hotfix Flow:**
```bash
# Critical bug fix
git checkout -b hotfix/urgent-fix main
# ... fix bug ...
git checkout staging  
git merge hotfix/urgent-fix
git push  # Test in staging

git checkout main
git merge staging
git push  # Deploy to production
```

### **Environment Separation Benefits**

- **Complete Data Isolation:** Each environment uses separate Firebase projects
- **Risk Management:** Triple safety net before production deployment
- **Stakeholder Review:** Staging environment for feature approval
- **Automated Deployments:** Push-to-deploy workflow with branch detection
- **Professional Standards:** Industry-standard enterprise deployment architecture

### **Firebase Project Structure**

- **canoncore-development:** Local development and feature testing
- **canoncore-staging:** Pre-production testing and stakeholder review  
- **canoncore-production-929c5:** Live production environment
- **Complete isolation:** No cross-contamination between environments
- **Consistent rules:** Same Firestore security rules deployed to all environments

## Next Steps

Refer to todo.md for the current implementation roadmap. Each phase is designed as manageable tasks for iterative development. The LOVABLE_MVP_SPEC.md contains the complete technical specification for the rebuild.