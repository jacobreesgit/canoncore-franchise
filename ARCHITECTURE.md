# CanonCore Architecture

## Current System Overview

CanonCore is a franchise organisation platform built with Next.js 15, React 19, TypeScript, and Firebase. Currently implemented through Phase 3d plus Phase 6a plus Phase 4a-4c with complete core functionality including authentication, service layer, dashboard, universe details, content details, discovery, user profiles, data management forms, individual user progress tracking, favourites system, advanced hierarchical content organisation with infinite depth support, polished UI with consistent progress indicators, and unified Navigation component system across all pages.

**Note**: This is a ground-up rebuild of an existing project. The LOVABLE_MVP_SPEC.md contains the full specification for rebuilding the system as an MVP, focusing on core franchise organisation features while maintaining the same technical stack and architecture patterns.

## Technology Stack

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase (Auth + Firestore)
- **Authentication**: Google OAuth via Firebase Auth

## Current Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Client (Next.js 15 App)                     │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    Pages    │  │ Components  │  │  Contexts   │             │
│  │             │  │             │  │             │             │
│  │ page.tsx    │  │ Navigation  │  │ AuthContext │             │
│  │ (Dashboard) │  │ Button      │  │ - User mgmt │             │
│  │ layout.tsx  │  │ Favourite   │  │ - Sign in/  │             │
│  │ universes/  │  │ Button      │  │   out       │             │
│  │ content/    │  │             │  │             │             │
│  │ discover/   │  │             │  │             │             │
│  │ profile/    │  │             │  │             │             │
│  │ Forms       │  │             │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                           │                │                    │
├───────────────────────────┼────────────────┼────────────────────┤
│      Service Layer        │                │                    │
│     (IMPLEMENTED)         ▼                ▼                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Franchise Services                         │   │
│  │                                                         │   │
│  │  UniverseService   ContentService   UserService        │   │
│  │  - CRUD ops        - Episodes/Chars - Favourites       │   │
│  │  - Public/Private  - Progress Track - Profiles         │   │
│  │  - Search          - Viewable/Org   - Activity         │   │
│  │                                                         │   │
│  │  RelationshipService + UserProgressService             │   │
│  │  - Hierarchies     - Individual Progress               │   │
│  │  - Tree Building   - Progress Calculation              │   │
│  │  - Path Navigation - Cross-User Isolation              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
├───────────────────────────┼─────────────────────────────────────┤
│        Firebase Backend   │                                     │
│                           ▼                                     │
│  ┌─────────────┐  ┌─────────────┐                              │
│  │Firebase Auth│  │  Firestore  │                              │
│  │             │  │             │                              │
│  │ Google      │  │ Collections:│                              │
│  │ OAuth       │  │ - users     │                              │
│  │ User mgmt   │  │ - universes │                              │
│  │ JWT tokens  │  │ - content   │                              │
│  │             │  │ - favourites│                              │
│  │             │  │ - relations │                              │
│  └─────────────┘  └─────────────┘                              │
└─────────────────────────────────────────────────────────────────┘

Current Data Flow:
User Action → AuthContext → Service Layer → Firestore → UI Update
Auth: Firebase Auth → onAuthStateChanged → User State → Context consumers
```

## Component Structure (Current State)

### Implemented Components (Phase 4a-4c Navigation Complete)

#### Component Library (src/components/)
- **`Navigation.tsx`**: Unified navigation component with breadcrumb system (Phase 4a-4c)
  - Responsibilities: Consistent navigation across all pages, breadcrumb hierarchy, source context
  - Variants: `dashboard` (full nav menu), `detail` (breadcrumbs), `form` (form navigation)
  - Features: Authentication integration, action buttons, source context breadcrumbs
  - Used by: All 10 pages (5 core + 5 form pages)

- **`Button.tsx`**: Reusable button component with consistent styling
  - Variants: primary, secondary, danger, text
  - Features: Loading states, disabled states, size variants
  - Integration: Used by Navigation component and forms

- **`FavouriteButton.tsx`**: Favouriting functionality component
  - Responsibilities: Universe and content favouriting with state management
  - Features: Heart icon toggle, optimistic updates, error handling

#### Layout Layer
- **`app/layout.tsx`**: Root layout with AuthProvider wrapper
  - Responsibilities: Global app setup, authentication context provision
  - Data Flow: Wraps entire app with auth state

#### Pages Layer  
- **`app/page.tsx`**: Franchise dashboard
  - Responsibilities: Authentication gate, display user's universes, navigation to franchise detail
  - Data Flow: AuthContext → UniverseService → Universe list → Responsive grid UI
  - States: Loading, unauthenticated (sign-in), authenticated (dashboard with universes)
  - Features: Universe cards, progress bars, create/edit actions, private/public indicators, navigation links

- **`app/universes/[id]/page.tsx`**: Universe detail pages
  - Responsibilities: Display franchise details, content organisation, owner permissions
  - Data Flow: AuthContext + URL params → UniverseService + ContentService → Universe + Content data → Detailed UI
  - States: Loading, error (not found/unauthorized), universe display
  - Features: Universe overview, content categorisation (viewable vs organisational), progress tracking, owner actions

- **`app/content/[id]/page.tsx`**: Content detail pages
  - Responsibilities: Display individual content (episodes, characters), progress tracking, universe context
  - Data Flow: AuthContext + URL params → ContentService + UniverseService → Content + Universe data → Detail UI
  - States: Loading, error (not found/unauthorized), content display
  - Features: Content details, progress updates, breadcrumb navigation, universe context, owner actions

- **`app/discover/page.tsx`**: Public discovery page
  - Responsibilities: Browse and search all public franchises, community discovery
  - Data Flow: UniverseService → Public universes → Search filtering → Grid display
  - States: Loading, empty state, search results
  - Features: Search functionality, public franchise grid, responsive design, navigation

- **`app/profile/[userId]/page.tsx`**: User profile pages
  - Responsibilities: Display user's public franchises and favourites, profile information
  - Data Flow: AuthContext + URL params → UserService + UniverseService → User + Universes + Favourites → Profile UI
  - States: Loading, error (user not found), own vs other profile display
  - Features: Tabbed interface (franchises/favourites), public franchise display, profile stats, responsive design

- **`app/universes/create/page.tsx`**: Universe creation form
  - Responsibilities: Allow authenticated users to create new franchises with validation
  - Data Flow: AuthContext + Form data → UniverseService.create → Redirect to new universe
  - States: Loading, form validation, submission, error handling
  - Features: Name/description fields, public/private toggle, source links, real franchise guidance

- **`app/universes/[id]/content/create/page.tsx`**: Content creation form
  - Responsibilities: Allow universe owners to add content (episodes, characters, etc.)
  - Data Flow: AuthContext + URL params + Form data → ContentService.create → Redirect to new content
  - States: Loading, permission checking, form validation, submission
  - Features: Media type selection, viewable/non-viewable detection, owner permissions, content guidance

- **`app/universes/[id]/edit/page.tsx`**: Universe edit form (Phase 3b)
  - Responsibilities: Allow universe owners to edit franchise details with pre-populated data
  - Data Flow: AuthContext + URL params → UniverseService.getById → Form population → UniverseService.update
  - States: Loading, permission checking, form validation, submission, error handling
  - Features: Pre-populated form fields, validation, owner permissions, proper navigation

- **`app/universes/[id]/content/[contentId]/edit/page.tsx`**: Content edit form (Phase 3b)
  - Responsibilities: Allow content owners to edit content details with automatic media type detection and parent selection
  - Data Flow: AuthContext + URL params → ContentService.getById + UniverseService.getById → Form population → ContentService.update + RelationshipService updates
  - States: Loading, permission checking, form validation, submission, error handling
  - Features: Pre-populated form, media type selection, parent content selection, automatic isViewable detection, hierarchical navigation

#### Context Layer
- **`lib/contexts/auth-context.tsx`**: Authentication state management
  - Responsibilities: 
    - Firebase Auth integration
    - User state management (loading, authenticated, user data)
    - Sign in/out operations
    - User document creation/retrieval
  - Data Flow: Firebase Auth → onAuthStateChanged → User state → Context consumers

### Implemented Services (Phase 1 Complete)

#### Service Layer (`src/lib/services/`)
- **UniverseService**: Complete franchise CRUD operations, public/private management, progress tracking, search
- **ContentService**: Episodes/movies/characters management, viewable vs organisational content, progress tracking  
- **UserService**: User profiles, favourites system, activity summaries, bulk operations
- **RelationshipService**: Hierarchical content organisation, tree building, path navigation, reordering

All services include:
- Firebase Firestore integration with error handling
- User authentication and ownership verification
- British English spelling throughout
- Full TypeScript type safety

### Not Yet Implemented

#### Component Library (Remaining - Phase 4: UI Components)
- **Form Action Patterns**: Cancel Link + Submit button pairs
- **Page Header Components**: Title + description + action button layouts
- **Modal Components**: Consistent delete confirmation and edit modals
- **Card Components**: Universe cards, content cards with consistent styling
- **Empty State Components**: Message + call-to-action button patterns

## Data Model (Current State)

### TypeScript Interfaces Defined

```typescript
// Core entities
User: { id, displayName, email, createdAt }
Universe: { id, name, description, userId, isPublic, progress, ... }
Content: { id, name, universeId, isViewable, mediaType, progress, ... }
Favorite: { id, userId, targetId, targetType, createdAt }
ContentRelationship: { id, contentId, parentId, displayOrder, ... }

// Future: Individual User Progress (Phase 3c)
UserProgress: { id, userId, contentId, progress, lastAccessedAt }

// Form interfaces
CreateUniverseData: { name, description, isPublic, sourceLink?, ... }
CreateContentData: { name, description, isViewable, mediaType }

// Context interfaces  
AuthContextType: { user, loading, signIn, signOut }
FranchiseContextType: { universes, loading, createUniverse, ... }
```

### Firebase Collections (Phase 1 Services Ready, Phase 2a Pages Consuming)

```
users/ (Used by AuthContext)
├── {userId}/
    ├── id: string
    ├── displayName: string | null
    ├── email: string | null  
    └── createdAt: Timestamp

universes/ (Service implemented, consumed by dashboard and detail pages)
├── {universeId}/
    ├── id: string
    ├── name: string
    ├── description: string
    ├── userId: string
    ├── isPublic: boolean
    ├── progress?: number
    └── createdAt, updatedAt: Timestamp

content/ (Service implemented, consumed by universe detail pages)
├── {contentId}/
    ├── id: string
    ├── name: string
    ├── universeId: string
    ├── isViewable: boolean
    ├── mediaType: string
    ├── progress?: number (CURRENT: shared across users, FUTURE: individual per user)
    └── createdAt, updatedAt: Timestamp

favorites/ (Service implemented, not yet used by UI)
contentRelationships/ (Service implemented, used by hierarchical content organisation - Phase 3c)
├── {relationshipId}/
    ├── contentId: string (child content)
    ├── parentId: string (parent content)
    ├── universeId: string
    ├── userId: string
    ├── displayOrder?: number
    ├── contextDescription?: string
    └── createdAt: Timestamp

userProgress/ (Phase 3c - Individual user progress tracking - IMPLEMENTED)
├── {userProgressId}/
    ├── userId: string
    ├── contentId: string
    ├── universeId: string
    ├── progress: number (0 or 100 - binary: not started/completed)
    ├── lastAccessedAt: Timestamp
    └── createdAt, updatedAt: Timestamp
```

## Current Data Flows

### Authentication Flow
```
1. User clicks "Sign in with Google"
2. AuthContext.signIn() → signInWithPopup(GoogleProvider)
3. Firebase Auth triggers onAuthStateChanged
4. AuthContext gets/creates user document in Firestore
5. AuthContext updates user state
6. UI re-renders with authenticated state
```

### Sign Out Flow
```
1. User clicks "Sign out"  
2. AuthContext.signOut() → firebaseSignOut()
3. Firebase Auth triggers onAuthStateChanged (user = null)
4. AuthContext sets user state to null
5. UI re-renders showing sign-in screen
```

### User Document Creation
```
1. First-time Google sign-in
2. AuthContext checks if user document exists in Firestore
3. If not exists, creates new user document with:
   - displayName from Google
   - email from Google  
   - createdAt timestamp
4. Returns complete User object with Firestore data
```

## File Structure (Current)

```
canoncore/
├── scripts/
│   ├── clear-firestore.js        # Development data clearing script
│   └── scan-data.js             # Data scanning and validation script
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with AuthProvider
│   │   ├── page.tsx           # Franchise dashboard with Navigation component (Phase 2a/3c/4b)
│   │   ├── globals.css        # Global styles with Tailwind CSS v4
│   │   ├── content/
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Content detail with Navigation + breadcrumbs (Phase 2b/3c/4b)
│   │   ├── discover/
│   │   │   └── page.tsx       # Public discovery with Navigation component (Phase 2b/4b)
│   │   ├── profile/
│   │   │   └── [userId]/
│   │   │       ├── page.tsx   # User profile with Navigation + breadcrumbs (Phase 2b/4b)
│   │   │       └── edit/
│   │   │           └── page.tsx # Profile edit with Navigation form variant (Phase 3b/4c)
│   │   └── universes/
│   │       ├── create/
│   │       │   └── page.tsx   # Universe creation with Navigation form variant (Phase 3a/4c)
│   │       └── [id]/
│   │           ├── page.tsx   # Universe detail with Navigation + breadcrumbs (Phase 2a/3c/4b)
│   │           ├── edit/
│   │           │   └── page.tsx # Universe edit with Navigation form variant (Phase 3b/4c)
│   │           └── content/
│   │               ├── create/
│   │               │   └── page.tsx # Content creation with Navigation form variant (Phase 3a/3c/4c)
│   │               └── [contentId]/
│   │                   └── edit/
│   │                       └── page.tsx # Content edit with Navigation form variant (Phase 3b/4c)
│   ├── lib/
│   │   ├── contexts/
│   │   │   └── auth-context.tsx    # Authentication context with account selection
│   │   ├── services/               # Service layer (Phase 1/3c)
│   │   │   ├── universe.service.ts # Franchise CRUD + user-specific progress
│   │   │   ├── content.service.ts  # Episodes/movies/characters + user progress
│   │   │   ├── user.service.ts     # Favourites and profiles
│   │   │   ├── relationship.service.ts # Content hierarchies + tree building
│   │   │   ├── user-progress.service.ts # Individual user progress tracking (Phase 3c)
│   │   │   └── index.ts            # Service exports
│   │   ├── hooks/                  # Custom React hooks (empty)
│   │   ├── firebase.ts             # Firebase config
│   │   └── types.ts                # TypeScript definitions + UserProgress interface
│   ├── components/                 # UI components (Phase 4a-4c)
│   │   ├── Navigation.tsx         # Unified navigation with breadcrumbs + source context (Phase 4a-4c)
│   │   ├── Navigation.stories.tsx # Storybook stories for Navigation component
│   │   ├── Button.tsx             # Reusable button component with variants
│   │   ├── Button.stories.tsx     # Storybook stories for Button component
│   │   ├── FavouriteButton.tsx    # Favouriting functionality component (Phase 3d)
│   │   └── index.ts               # Component exports
│   ├── design-system/              # Design system documentation and tokens
│   │   ├── COMPONENT_CREATION_GUIDE.md # Guide for creating design system components
│   │   ├── README.md              # Design system overview
│   │   └── tokens.js              # Design system tokens (colors, spacing, typography)
│   └── styles/                     # Additional styles (empty)
├── public/                         # Static assets (Firebase hosting files)
│   ├── 404.html                   # Firebase 404 page
│   └── index.html                 # Firebase default page
├── .storybook/                     # Storybook configuration
│   ├── main.ts                    # Storybook main configuration
│   ├── preview.ts                 # Storybook preview configuration
│   └── vitest.setup.ts            # Vitest setup for Storybook
├── ARCHITECTURE.md                 # System architecture documentation
├── CLAUDE.md                      # Development guide for Claude Code
├── LOVABLE_MVP_SPEC.md           # Complete MVP specification
├── README.md                      # Project README
├── firebase.json                  # Firebase configuration
├── firestore.rules               # Firestore security rules + UserProgress collection
├── firestore.indexes.json       # Firestore database indexes
├── next-env.d.ts                 # Next.js TypeScript declarations
├── next.config.ts               # Next.js config
├── package.json                 # Dependencies and scripts + Storybook
├── package-lock.json           # Dependency lock file
├── postcss.config.mjs          # PostCSS configuration
├── todo.md                     # Implementation roadmap
├── tsconfig.json              # TypeScript config
├── tsconfig.tsbuildinfo       # TypeScript build cache
├── vitest.config.ts           # Vitest configuration for testing
└── vitest.shims.d.ts          # Vitest type shims
```

## Security Model (Current)

### Authentication
- Google OAuth through Firebase Auth
- JWT tokens automatically managed by Firebase
- User session persistence across browser sessions

### Authorization (Defined but not implemented)
- User document creation on first sign-in
- All franchise operations will require authenticated user
- Universe ownership through userId field
- Public/private universe visibility through isPublic field

## Error Handling (Current)

### Authentication Errors
- Sign-in errors logged to console and re-thrown
- Sign-out errors logged to console and re-thrown
- Loading states managed during auth operations

### Missing Error Handling (To be implemented)
- Firestore operation errors
- Network connectivity issues
- Form validation errors
- Component error boundaries

## Performance Considerations (Current)

### Optimisations In Place
- React 19 with concurrent features
- Next.js App Router with automatic optimisation
- Tailwind CSS for minimal bundle size

### Future Optimisations (Planned)
- Firestore query optimisation for large franchise datasets
- Component lazy loading for large franchise trees
- Image optimisation for franchise media
- Service worker for offline capability

## Next Phase Integration Points

### Phase 1: Core Services Foundation
- Services will integrate with existing AuthContext
- Firebase operations will use existing `db` instance
- Type definitions already prepared for service methods

### Phase 2a: Core Pages - Dashboard & Universe (COMPLETE)
- Dashboard page consumes AuthContext and UniverseService for franchise listing
- Universe detail pages consume AuthContext, UniverseService, and ContentService
- Extended layout structure with dynamic routing
- Responsive grid layouts with progress visualization

### Phase 2b: Core Pages - Content & Discovery (COMPLETE)
- Content detail pages consume ContentService and UniverseService for individual content display
- Discovery page uses UniverseService for public franchise browsing and search
- Profile pages integrate UserService with franchise and favourite display
- Navigation system connects all pages with consistent routing

### Phase 3a: Data Management - Forms & Content Creation (COMPLETE)
- Universe creation form integrates with UniverseService for franchise creation
- Content creation form uses ContentService for adding episodes, characters, etc.
- Forms include validation, error handling, and authentication checks
- Media type selection with automatic viewable/non-viewable detection

### Phase 3b: Data Management - Edit & Delete Operations (COMPLETE)
- Universe edit form (/universes/[id]/edit) using UniverseService.update() with pre-populated data
- Content edit form (/universes/[id]/content/[contentId]/edit) using ContentService.update() with media type and parent selection
- Universe delete functionality with confirmation modal and cascade deletion
- Content delete functionality with confirmation modal and proper navigation
- Owner permission checks, error handling, loading states, and proper redirects

### Phase 3c: Data Management - Progress & Hierarchies (COMPLETE)
- **Individual user progress tracking**: UserProgress collection implemented for per-user progress states
- Same public content shows different progress for each user (100% for User A, 0% for User B)
- Migrated from content.progress to userId+contentId based progress storage via UserProgressService
- **Hierarchical organisation**: ContentRelationship model fully implemented with tree building
- **Tree navigation**: Grid/tree view toggle with expandable hierarchical content display
- **Parent-child creation**: Content forms include parent selection for hierarchical relationships
- **Calculated progress**: Organisational holders show progress based on user-specific child viewable content

### Phase 3d: Data Management - Visibility & Favourites (COMPLETE)
- Public/private visibility system and favourites functionality fully implemented
- Users can favourite/unfavourite their own and other users' universes and content
- Profile page displays favourites with tabbed interface

### Phase 4a: Design System Foundation (COMPLETE - Navigation)
- ✅ **Navigation Component System**: Created unified Navigation component with breadcrumb support and source context
- ☐ Replace hardcoded buttons with Button component throughout codebase
- ☐ Form Actions Pattern: Cancel Link + Submit button pairs with consistent styling
- ☐ Page Headers with Action Buttons: Title + description + action button patterns
- ☐ Delete Confirmation Modals: Same modal structure with Cancel/Delete button pairs
- ☐ Empty State with CTA: Message + call-to-action button pattern
- ☐ Establish design system foundation (colours, typography, spacing)
- ☐ Create reusable UI components using already hardcoded elements as base
- ☐ Consolidate duplicate UI patterns and ensure consistent loading/error states

### Phase 4b: Core Pages Design Consistency (COMPLETE - Navigation)
- ✅ **Navigation Applied to 5 Core Pages**: Dashboard, Universe Detail, Content Detail, Discover, Profile pages all use Navigation component
- ✅ **Unified Navigation System**: Built franchise navigation components with breadcrumbs and authentication integration
- ☐ Create progress tracking components for consistent progress display
- ✅ **Standardised Navigation**: All 5 core pages use consistent Navigation patterns with proper variants

### Phase 4c: Form Pages Design Consistency (COMPLETE - Navigation)
- ✅ **Navigation Applied to 5 Form Pages**: Universe Create, Universe Edit, Content Create, Content Edit, Profile Edit all use Navigation component
- ✅ **Breadcrumb Navigation**: All form pages have proper hierarchical breadcrumbs showing parent relationships
- ✅ **Consistent Header/Nav Patterns**: All form pages use Navigation form variant with Cancel actions
- ☐ Standardise form layouts and validation patterns beyond navigation

### Phase 4d: Responsive Design & Polish
- Implement responsive design for mobile (all 10 pages)
- Ensure consistent design across all screen sizes
- Final design consistency review across all pages

### Phase 5a: Testing
- Comprehensive testing of all implemented features
- Service layer unit tests and component integration tests
- Firestore security rules validation

### Phase 5b: Code Optimisation & Cleanup
- Remove unused files, components, and service methods
- Consolidate duplicate UI patterns and optimise imports
- Clean up Firebase features and improve code organisation
- Bundle size optimisation and performance improvements

### Phase 5c: Deployment
- Production environment setup and deployment
- Firebase hosting configuration
- End-to-end workflow validation

### Phase 5d: Flow Optimisation & UX Review
- Objective review and optimisation of user flows
- Split content creation: separate viewable vs non-viewable flows
- Analyse and improve navigation patterns across all pages
- Optimise form flows and reduce user friction
- Review content organisation and discovery patterns
- Streamline universe-to-content creation workflow

### Phase 6a: Advanced Content Hierarchies - Infinite Nesting
- Implement infinite looping nested children support using RelationshipService
- Build recursive content tree components with React performance optimisation
- Add parent-child relationship management in content creation/edit forms
- Create drag-and-drop content organisation interface with position updates
- Implement circular reference detection and prevention in ContentRelationship model
- Build nested content navigation with dynamic breadcrumbs and tree views
- Add bulk operations for nested content structures (move, copy, delete hierarchies)
- Optimise Firestore queries and component rendering for deep content hierarchies
- Support complex franchise structures: Universe → Series → Episodes → Scenes → Characters

---

**Last Updated**: Phase 3d + Phase 6a + Phase 4a-4c Navigation Complete (Foundation + Service Layer + All Core Pages + Data Management Forms + Edit & Delete Operations + Individual User Progress + Favourites System + Advanced Hierarchical Content Organisation with Infinite Depth Support + Unified Navigation Component System across all 10 pages)  
**Next Update**: After Phase 4a-4d Remaining: UI Components & Design System Completion