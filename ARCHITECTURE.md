# CanonCore Architecture

## Current System Overview

CanonCore is a franchise organisation platform built with Next.js 15, React 19, TypeScript, and Firebase. Currently implemented through Phase 3a with complete core page functionality including authentication, service layer, dashboard, universe details, content details, discovery, user profiles, and data management forms.

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
│  │ page.tsx    │  │ (Empty)     │  │ AuthContext │             │
│  │ (Dashboard) │  │             │  │ - User mgmt │             │
│  │ layout.tsx  │  │             │  │ - Sign in/  │             │
│  │ universes/  │  │             │  │   out       │             │
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
│  │  RelationshipService + Type Definitions                │   │
│  │  - Hierarchies     User, Universe, Content, etc.       │   │
│  │  - Tree Building   CreateData interfaces               │   │
│  │  - Path Navigation AuthContextType, etc.               │   │
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

### Implemented Components

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

#### Component Library (Planned - Phase 4: UI Components)
- **Forms**: Universe creation, content creation
- **Cards**: Universe cards, content cards
- **Modals**: Confirmation, editing
- **Navigation**: Franchise trees, breadcrumbs

## Data Model (Current State)

### TypeScript Interfaces Defined

```typescript
// Core entities
User: { id, displayName, email, createdAt }
Universe: { id, name, description, userId, isPublic, progress, ... }
Content: { id, name, universeId, isViewable, mediaType, progress, ... }
Favorite: { id, userId, targetId, targetType, createdAt }
ContentRelationship: { id, contentId, parentId, displayOrder, ... }

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
    ├── progress?: number
    └── createdAt, updatedAt: Timestamp

favorites/ (Service implemented, not yet used by UI)
contentRelationships/ (Service implemented, not yet used by UI)
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
│   └── clear-firestore.js        # Development data clearing script
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with AuthProvider
│   │   ├── page.tsx           # Franchise dashboard (Phase 2a)
│   │   ├── content/
│   │   │   └── [id]/
│   │   │       ├── page.tsx   # Content detail pages (Phase 2b)
│   │   │       └── edit/      # MISSING - Content edit form (Phase 3b)
│   │   ├── discover/
│   │   │   └── page.tsx       # Public discovery page (Phase 2b)
│   │   ├── profile/
│   │   │   └── [userId]/
│   │   │       └── page.tsx   # User profile pages (Phase 2b)
│   │   ├── universes/
│   │   │   ├── create/
│   │   │   │   └── page.tsx   # Universe creation form (Phase 3a)
│   │   │   └── [id]/
│   │   │       ├── page.tsx   # Universe detail pages (Phase 2a)
│   │   │       ├── edit/      # MISSING - Universe edit form (Phase 3b)
│   │   │       └── content/
│   │   │           └── create/
│   │   │               └── page.tsx # Content creation form (Phase 3a)
│   │   └── globals.css        # Global styles
│   ├── lib/
│   │   ├── contexts/
│   │   │   └── auth-context.tsx    # Authentication context
│   │   ├── services/               # Service layer (Phase 1)
│   │   │   ├── universe.service.ts # Franchise CRUD operations
│   │   │   ├── content.service.ts  # Episodes/movies/characters
│   │   │   ├── user.service.ts     # Favourites and profiles
│   │   │   ├── relationship.service.ts # Content hierarchies
│   │   │   └── index.ts            # Service exports
│   │   ├── hooks/                  # Custom React hooks (empty)
│   │   ├── firebase.ts             # Firebase config
│   │   └── types.ts                # TypeScript definitions
│   ├── components/                 # UI components (empty - Phase 4)
│   └── styles/                     # Additional styles (empty)
├── public/                         # Static assets (Firebase hosting files)
│   ├── 404.html                   # Firebase 404 page
│   └── index.html                 # Firebase default page
├── ARCHITECTURE.md                 # System architecture documentation
├── CLAUDE.md                      # Development guide for Claude Code
├── LOVABLE_MVP_SPEC.md           # Complete MVP specification
├── firebase.json                  # Firebase configuration
├── firestore.rules               # Firestore security rules
├── firestore.indexes.json       # Firestore database indexes
├── next-env.d.ts                 # Next.js TypeScript declarations
├── next.config.ts               # Next.js config
├── package.json                 # Dependencies and scripts
├── package-lock.json           # Dependency lock file
├── postcss.config.mjs          # PostCSS configuration
├── todo.md                     # Implementation roadmap
├── tsconfig.json              # TypeScript config
└── tsconfig.tsbuildinfo       # TypeScript build cache
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

### Phase 3b: Data Management - Edit & Delete Operations (PENDING)
- Universe edit form (/universes/[id]/edit) using existing UniverseService.update()
- Content edit form (/content/[id]/edit) using existing ContentService.update()
- Universe delete functionality with confirmation using UniverseService.delete()
- Content delete functionality with confirmation using ContentService.delete()
- Owner permission checks and error handling for all operations

### Phase 3c: Data Management - Progress & Hierarchies (PENDING)
- Progress tracking will update Firestore directly
- Hierarchical organisation will use ContentRelationship model

### Phase 3d: Data Management - Visibility & Favourites (PENDING)
- Public/private visibility system and favourites functionality

### Phase 4a: UI Components - Component Library
- Establish design system foundation (colours, typography, spacing)
- Components will consume service layer and contexts
- Apply consistent design to: Dashboard, Universe Detail, Content Detail pages
- Reusable components built with consistent styling patterns
- Standardised button, form, and component variations

### Phase 4b: UI Components - Navigation & Responsive
CHECK WHAT OTHER PAGES TO MAKE CONSISTENT

- Build franchise navigation components with design system applied
- Apply design system to: Discover page, Profile pages
- Standardise navigation patterns across all 5 core pages
- Progress tracking components with consistent styling
- Responsive design implemented across all pages and screen sizes

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

**Last Updated**: Phase 3a Complete (Foundation + Service Layer + All Core Pages + Data Management Forms)  
**Next Update**: After Phase 3b: Data Management - Edit & Delete Operations