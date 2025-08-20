# CanonCore Architecture

## Current System Overview

CanonCore is a franchise organisation platform built with Next.js 15, React 19, TypeScript, and Firebase. Currently implemented through Phase 6a with complete core functionality including authentication, service layer, dashboard, universe details, content details, discovery, user profiles, data management forms, individual user progress tracking, favourites system, advanced hierarchical content organisation with infinite depth support, comprehensive design system foundation with organized component architecture, unified Navigation component system across all pages, professional 3-environment deployment pipeline, comprehensive performance optimization with bundle size management and dynamic imports, advanced content display components, Microsoft Playwright MCP integration for testing, smart parent-based routing for hierarchical workflows, and infinite-depth content hierarchies with recursive tree building and enhanced organisation components.

**Note**: This is a ground-up rebuild of an existing project. The LOVABLE_MVP_SPEC.md contains the full specification for rebuilding the system as an MVP, focusing on core franchise organisation features while maintaining the same technical stack and architecture patterns.

## Technology Stack

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase (Auth + Firestore)
- **Authentication**: Google OAuth via Firebase Auth
- **Deployment**: Vercel with environment separation
- **Design System**: Storybook with organized component hierarchy
- **Testing**: Vitest + Accessibility testing via @axe-core/react

## Current Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Client (Next.js 15 App)                     │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    Pages    │  │Design System│  │  Contexts   │             │
│  │             │  │(17 Components)│  │             │             │
│  │ Dashboard   │  │ Navigation  │  │ AuthContext │             │
│  │ Universe    │  │ Button      │  │ - User mgmt │             │
│  │ Content     │  │ PageHeader  │  │ - Sign in/  │             │
│  │ Discovery   │  │ CardGrid    │  │   out       │             │
│  │ Profile     │  │ FormInput   │  │             │             │
│  │ Forms (5)   │  │ SearchBar   │  │             │             │
│  │             │  │ + 11 more   │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                           │                │                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Design System Foundation                   │   │
│  │                                                         │   │
│  │  • CSS Custom Properties (Design Tokens)               │   │
│  │  • Consistent Component Patterns                       │   │
│  │  • Responsive Mobile-First Design                      │   │
│  │  • Storybook Documentation                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
├───────────────────────────┼─────────────────────────────────────┤
│      Service Layer        │                                     │
│     (COMPLETE)            ▼                                     │
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
│  │             │  │ - userProgress                             │
│  └─────────────┘  └─────────────┘                              │
└─────────────────────────────────────────────────────────────────┘

Current Data Flow:
User Action → Design System Components → Service Layer → Firestore → UI Update
Auth: Firebase Auth → onAuthStateChanged → User State → Context consumers
Design: Component Props → Design Tokens → Consistent Styling → Responsive UI
```

## Component Structure (Current State)

### Organized Component Architecture (Phase 5a Complete)

The design system follows industry best practices with logical component organization:

#### Component Organization (src/components/)

**Layout Components (`src/components/layout/` - 7 components):**
- **`PageContainer.tsx`**: Consistent page layout wrapper (wide/narrow variants)
- **`PageHeader.tsx`**: Page headers with titles, descriptions, breadcrumbs, and actions
- **`Navigation.tsx`**: Unified navigation with responsive design and hamburger menu
- **`Footer.tsx`**: Page footer with version information and branding
- **`CardGrid.tsx`**: Responsive grid layout with automatic content sorting
- **`EmptyState.tsx`**: Empty state with call-to-action patterns
- **`DeleteConfirmationModal.tsx`**: Consistent delete confirmation patterns

**Form Components (`src/components/forms/` - 5 components):**
- **`FormInput.tsx`**: Text input with validation and error states
- **`FormLabel.tsx`**: Consistent form labeling with required indicators
- **`FormTextarea.tsx`**: Multi-line text input with validation
- **`FormSelect.tsx`**: Select dropdown with consistent styling and validation
- **`FormActions.tsx`**: Form button groups (Cancel + Submit patterns)

**Interactive Components (`src/components/interactive/` - 6 components):**
- **`Button.tsx`**: Multi-variant button component (primary, secondary, danger, clear)
- **`FavouriteButton.tsx`**: Heart toggle for favouriting content/universes
- **`SearchBar.tsx`**: Search input with real-time filtering
- **`ViewToggle.tsx`**: Toggle switches for grid/tree views and tab navigation
- **`Breadcrumb.tsx`**: Navigation breadcrumb component with hierarchical links
- **`Dropdown.tsx`**: Dropdown menu component for navigation and actions

**Content Display (`src/components/content/` - 6 components):**
- **`UniverseCard.tsx`**: Universe display cards with progress tracking
- **`ContentCard.tsx`**: Content display cards with progress indicators
- **`ProgressBar.tsx`**: Progress indicators for viewable/organisational content
- **`Badge.tsx`**: Status badges for public/private and ownership labels
- **`ContentSection.tsx`**: Advanced content section with tree/grid toggle and search
- **`Tree.tsx`**: Hierarchical tree display with expandable nodes and focus modes

**Feedback Components (`src/components/feedback/` - 2 components):**
- **`LoadingSpinner.tsx`**: Loading indicators with size variants
- **`ErrorMessage.tsx`**: Error display with WCAG AA compliant contrast

#### Storybook Organization

Components are organized in Storybook under logical namespaces:
- `CanonCore/Layout/` - Page structure components
- `CanonCore/Forms/` - Form controls and validation
- `CanonCore/Interactive/` - Buttons, toggles, and user interactions
- `CanonCore/Content/` - Content display and cards
- `CanonCore/Feedback/` - Loading states and error handling

#### Professional 3-Environment Deployment Architecture (Phase 5b Complete)

**Development Environment:**
- **Branch:** develop  
- **Firebase:** canoncore-development
- **URL:** http://localhost:3000
- **Config:** .env.local
- **Purpose:** Safe development testing and feature development

**Staging Environment:**
- **Branch:** staging
- **Firebase:** canoncore-staging
- **URL:** https://canoncore-o3gmncb7o-jacob-rees-projects.vercel.app
- **Config:** Vercel preview environment variables
- **Purpose:** Production-like testing and stakeholder review

**Production Environment:**
- **Branch:** main
- **Firebase:** canoncore-production-929c5
- **URL:** https://canoncore-4wcorlbw6-jacob-rees-projects.vercel.app
- **Config:** Vercel production environment variables
- **Purpose:** Live user data and production deployment

**Benefits:**
- **Complete Data Isolation:** Each environment uses separate Firebase projects
- **Risk Management:** Triple safety net before production deployment
- **Automated Deployments:** Push-to-deploy workflow with branch detection
- **Professional Standards:** Industry-standard enterprise deployment architecture

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

- **`app/universes/[id]/content/add-viewable/page.tsx`**: Viewable content creation form
- **`app/universes/[id]/content/organise/page.tsx`**: Organisational content creation form
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

### Design System Foundation (Phase 4a-4d Complete)

#### Design System Structure
- **`src/design-system/`**: Complete design system documentation and tokens
  - **`tokens.js`**: CSS custom properties for colors, spacing, typography
  - **`COMPONENT_CREATION_GUIDE.md`**: Guidelines for creating components
  - **`README.md`**: Design system overview and usage patterns

#### Component Patterns Established
- **Form Patterns**: Consistent Cancel Link + Submit button pairs across all forms
- **Page Layout**: Standardised PageContainer + PageHeader patterns
- **Navigation**: Unified breadcrumb and action button patterns
- **Cards**: Consistent Universe and Content card layouts with progress
- **States**: Loading, error, and empty state patterns
- **Interactive Elements**: Buttons, toggles, and form controls with design tokens
- **Accessibility**: WCAG AA compliant components with automated checking and custom contrast validation

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
│   │   ├── page.tsx           # Franchise dashboard with design system components
│   │   ├── globals.css        # Global styles with Tailwind CSS v4
│   │   ├── content/
│   │   │   └── [id]/
│   │   │       └── page.tsx   # Content detail with Universe Context and tree display
│   │   ├── discover/
│   │   │   └── page.tsx       # Public discovery with SearchBar and CardGrid
│   │   ├── profile/
│   │   │   └── [userId]/
│   │   │       ├── page.tsx   # User profile with ViewToggle and favourites
│   │   │       └── edit/
│   │   │           └── page.tsx # Profile edit with form components
│   │   └── universes/
│   │       ├── create/
│   │       │   └── page.tsx   # Universe creation with form design system
│   │       └── [id]/
│   │           ├── page.tsx   # Universe detail with ContentSection and Tree components
│   │           ├── edit/
│   │           │   └── page.tsx # Universe edit with design system forms
│   │           └── content/
│   │               ├── add-viewable/
│   │               │   └── page.tsx # Viewable content creation with smart routing
│   │               ├── organise/
│   │               │   └── page.tsx # Organisational content creation with smart routing
│   │               └── [contentId]/
│   │                   └── edit/
│   │                       └── page.tsx # Content edit with form design system
│   ├── lib/
│   │   ├── contexts/
│   │   │   └── auth-context.tsx    # Authentication context with account selection
│   │   ├── services/               # Complete service layer
│   │   │   ├── universe.service.ts # Franchise CRUD + user-specific progress
│   │   │   ├── content.service.ts  # Episodes/movies/characters + user progress
│   │   │   ├── user.service.ts     # Favourites and profiles
│   │   │   ├── relationship.service.ts # Content hierarchies + tree building
│   │   │   ├── user-progress.service.ts # Individual user progress tracking
│   │   │   └── index.ts            # Service exports
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── index.ts            # Hook exports
│   │   │   ├── usePageTitle.ts     # Page title management hook
│   │   │   ├── useScreenSize.ts    # Screen size detection with Tailwind breakpoints
│   │   │   └── useSearch.ts        # Dynamic search hook with optimized Fuse.js loading
│   │   ├── utils/                  # Utility functions
│   │   │   ├── accessibility.ts    # WCAG AA compliance utilities
│   │   │   ├── accessibility.test.ts # Accessibility testing
│   │   │   └── hierarchy.ts        # Tree building and content filtering utilities
│   │   ├── firebase.ts             # Firebase config
│   │   └── types.ts                # TypeScript definitions + UserProgress interface
│   ├── components/                 # Complete design system (23 components)
│   │   ├── content/                # Content display components (6 components)
│   │   │   ├── Badge.tsx           # Status badges with variants
│   │   │   ├── Badge.stories.tsx   
│   │   │   ├── ContentCard.tsx     # Content display cards with progress
│   │   │   ├── ContentCard.stories.tsx
│   │   │   ├── ContentSection.tsx  # Advanced content section with tree/grid toggle
│   │   │   ├── ContentSection.stories.tsx
│   │   │   ├── ProgressBar.tsx     # Progress visualization
│   │   │   ├── ProgressBar.stories.tsx
│   │   │   ├── Tree.tsx            # Hierarchical tree display with focus modes
│   │   │   ├── Tree.stories.tsx
│   │   │   ├── UniverseCard.tsx    # Universe display cards
│   │   │   └── UniverseCard.stories.tsx
│   │   ├── feedback/               # Loading and error states (2 components)
│   │   │   ├── ErrorMessage.tsx    # Form error display with WCAG compliance
│   │   │   ├── ErrorMessage.stories.tsx
│   │   │   ├── LoadingSpinner.tsx  # Loading state component
│   │   │   └── LoadingSpinner.stories.tsx
│   │   ├── forms/                  # Form controls and validation (5 components)
│   │   │   ├── FormActions.tsx     # Cancel + Submit button pairs
│   │   │   ├── FormActions.stories.tsx
│   │   │   ├── FormInput.tsx       # Standardised form inputs
│   │   │   ├── FormInput.stories.tsx  
│   │   │   ├── FormLabel.tsx       # Consistent form labels
│   │   │   ├── FormLabel.stories.tsx  
│   │   │   ├── FormSelect.tsx      # Select dropdown with consistent styling
│   │   │   ├── FormSelect.stories.tsx
│   │   │   ├── FormTextarea.tsx    # Textarea with consistent styling
│   │   │   └── FormTextarea.stories.tsx
│   │   ├── interactive/            # Buttons, toggles, and user interactions (6 components)
│   │   │   ├── Breadcrumb.tsx      # Navigation breadcrumb component
│   │   │   ├── Breadcrumb.stories.tsx
│   │   │   ├── Button.tsx          # Primary button component with variants
│   │   │   ├── Button.stories.tsx     
│   │   │   ├── Dropdown.tsx        # Dropdown menu component
│   │   │   ├── Dropdown.stories.tsx
│   │   │   ├── FavouriteButton.tsx # Favouriting functionality
│   │   │   ├── FavouriteButton.stories.tsx
│   │   │   ├── SearchBar.tsx       # Search functionality
│   │   │   ├── SearchBar.stories.tsx  
│   │   │   ├── ViewToggle.tsx      # View switching component
│   │   │   └── ViewToggle.stories.tsx 
│   │   ├── layout/                 # Page structure and containers (7 components)
│   │   │   ├── CardGrid.tsx        # Responsive grid with content sorting
│   │   │   ├── CardGrid.stories.tsx   
│   │   │   ├── DeleteConfirmationModal.tsx # Consistent delete patterns
│   │   │   ├── DeleteConfirmationModal.stories.tsx
│   │   │   ├── EmptyState.tsx      # Empty state with CTA patterns
│   │   │   ├── EmptyState.stories.tsx 
│   │   │   ├── Footer.tsx          # Page footer with version information
│   │   │   ├── Footer.stories.tsx
│   │   │   ├── Navigation.tsx      # Unified navigation system with dropdowns
│   │   │   ├── Navigation.stories.tsx 
│   │   │   ├── PageContainer.tsx   # Consistent page layout wrapper
│   │   │   ├── PageContainer.stories.tsx
│   │   │   ├── PageHeader.tsx      # Page titles with breadcrumbs
│   │   │   └── PageHeader.stories.tsx 
│   │   ├── DevAccessibility.tsx    # Development accessibility component
│   │   └── index.ts                # Organized component exports
│   ├── design-system/              # Design system foundation
│   │   ├── COMPONENT_CREATION_GUIDE.md # Component creation guidelines
│   │   ├── README.md              # Design system overview
│   │   └── tokens.js              # Design tokens (colors, spacing, typography)
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
├── MICROSOFT_MCP_SETUP.md        # Microsoft Playwright MCP integration guide
├── README.md                      # Project README
├── claude-desktop-mcp-config.json # Claude Desktop MCP configuration
├── mcp-config.json               # Local MCP server configuration
├── test-font-fix.js              # Development utility script
├── test-microsoft-mcp.js         # MCP testing utility script
├── firebase.json                  # Firebase configuration
├── firestore.rules               # Firestore security rules + UserProgress collection
├── firestore.indexes.json       # Firestore database indexes
├── next-env.d.ts                 # Next.js TypeScript declarations
├── next.config.js               # Next.js config with performance optimizations
├── package.json                 # Dependencies + deployment scripts + performance analysis
├── package-lock.json           # Dependency lock file
├── postcss.config.mjs          # PostCSS configuration
├── todo.md                     # Implementation roadmap
├── tsconfig.json              # TypeScript config
├── tsconfig.tsbuildinfo       # TypeScript build cache
├── vitest.config.ts           # Vitest configuration for testing
├── vitest.shims.d.ts          # Vitest type shims
├── vercel.json                 # Vercel deployment configuration
├── .vercelignore              # Vercel deployment exclusions
└── .env.production            # Production environment template
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

## Performance Considerations (Phase 5a Complete)

### Performance Optimizations Implemented
- **Bundle Size Management**: Maintained 99.5 kB shared bundle size through strategic optimization
- **Dynamic Imports**: Fuse.js and @axe-core/react loaded only when needed to reduce initial bundle
- **Image Optimization**: WebP/AVIF formats with 1-year caching for static assets
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, and Referrer-Policy
- **Caching Strategy**: Long-term caching for static assets (31536000s) and favicon optimization
- **Console Removal**: Production builds strip console.log statements for cleaner deployment
- **Package Optimization**: Next.js experimental optimizePackageImports for firebase and fuse.js

### Bundle Analysis Tools
- **npm run analyze**: ANALYZE=true npm run build for detailed bundle inspection
- **npm run lighthouse**: Performance auditing with HTML reports
- **Deployment Integration**: Vercel build optimizations with regions (lhr1) and framework detection

### Architecture Optimizations
- **Conditional Loading**: Accessibility tools only load in development environment
- **Fallback Search**: Simple string matching while Fuse.js dynamically imports
- **SSR Safety**: useScreenSize hook with proper server-side rendering compatibility
- **Component Organization**: Logical component structure reduces import complexity

### Future Optimizations (Planned)
- Firestore query optimization for large franchise datasets
- Component lazy loading for large franchise trees
- Service worker for offline capability
- Advanced caching strategies for dynamic content

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

### Phase 4a: Design System Foundation (COMPLETE)
- ✅ **Navigation Component System**: Unified Navigation component with breadcrumb support and source context
- ✅ **Design System Tokens**: CSS custom properties for colors, spacing, and typography
- ✅ **Form Actions Pattern**: Cancel Link + Submit button pairs with consistent styling
- ✅ **Page Headers with Action Buttons**: Title + description + action button patterns
- ✅ **Delete Confirmation Modals**: Consistent modal structure with Cancel/Delete button pairs
- ✅ **Empty State with CTA**: Message + call-to-action button patterns
- ✅ **Button Component System**: Replace hardcoded buttons throughout codebase
- ✅ **Reusable UI Components**: Created 17 design system components with Storybook stories
- ✅ **Consolidated UI Patterns**: Consistent loading/error states across all components

### Phase 4b: Core Pages Design Consistency (COMPLETE)
- ✅ **Navigation Applied to 5 Core Pages**: Dashboard, Universe Detail, Content Detail, Discover, Profile
- ✅ **Design System Integration**: All core pages use design system components
- ✅ **Progress Tracking Components**: ProgressBar component for consistent progress display
- ✅ **SearchBar Integration**: Dashboard and Discover pages with search functionality
- ✅ **CardGrid and ViewToggle**: Consistent layout and view switching patterns

### Phase 4c: Form Pages Design Consistency (COMPLETE)
- ✅ **Navigation Applied to 5 Form Pages**: Universe Create/Edit, Content Create/Edit, Profile Edit
- ✅ **Form Component System**: FormInput, FormLabel, FormTextarea, FormActions throughout
- ✅ **Breadcrumb Navigation**: All form pages with proper hierarchical breadcrumbs
- ✅ **Consistent Form Patterns**: Standardised form layouts and validation patterns

### Phase 4d: Responsive Design & Polish (COMPLETE)
- ✅ **Mobile Responsive Navigation**: React-based responsive navigation with useScreenSize hook
- ✅ **Mobile Menu Implementation**: Hamburger menu with overlay dropdown for mobile screens
- ✅ **Screen Size Detection**: Custom useIsMobile hook with Tailwind breakpoint integration
- ✅ **Responsive Design Patterns**: Mobile-first approach with proper breakpoint handling
- ✅ **Mobile Touch Targets**: 44px minimum touch targets for mobile accessibility

### Phase 5a: Code Optimisation & Cleanup (COMPLETE)
- ✅ **Performance Optimization**: Bundle size maintained at 99.5 kB through strategic optimization
- ✅ **Dynamic Imports**: Fuse.js and @axe-core/react loaded only when needed
- ✅ **Image Optimization**: WebP/AVIF formats with comprehensive caching strategies
- ✅ **Security Headers**: Production-ready security and performance headers
- ✅ **Build Configuration**: Next.js optimization with experimental package imports
- ✅ **Analysis Tools**: Bundle analysis and Lighthouse performance auditing

### Phase 5b: Deployment (IN PROGRESS)
- ✅ **Vercel Deployment**: Production deployment with optimized build configuration
- ✅ **Environment Variables**: Firebase configuration for production environment
- ✅ **Performance Monitoring**: Deployment scripts and performance analysis tools
- ☐ **Environment Separation**: Separate Firebase projects for development vs production
- ☐ **Domain Configuration**: Custom domain setup and SSL configuration

### Phase 5c: Flow Optimisation & UX Review
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

## Accessibility Implementation (Phase 5a)

### Comprehensive WCAG AA Compliance

CanonCore implements industry-standard accessibility checking with full WCAG AA compliance across all components and user interactions.

#### Automated Accessibility Tools
- **@axe-core/react**: Real-time accessibility violation detection in development console
- **eslint-plugin-jsx-a11y**: Build-time accessibility linting with pre-commit validation
- **@storybook/addon-a11y**: Component-level accessibility testing with visual reports
- **Custom contrast utilities**: WCAG contrast ratio validation and automated compliance checking

#### Critical Issues Identified & Fixed
1. **ErrorMessage Component** - Fixed contrast violation
   - **Issue**: Red text on light red background (4.41:1 contrast - below WCAG AA)
   - **Solution**: Added `--color-text-error-on-light` token with darker red (#b91c1c)
   - **Result**: 5.91:1 contrast ratio (WCAG AA compliant)
   - **Impact**: Fixed across 6+ error states throughout application

2. **ViewToggle Component** - Enhanced visual distinction
   - **Previous**: White background with dark text (excellent contrast but low distinction)  
   - **Enhanced**: Blue background with white text (5.17:1 contrast)
   - **Improvement**: Better active/inactive state distinction while maintaining accessibility

#### Design System Accessibility Features
- **Automated development checking**: Real-time console warnings for violations
- **Component-level validation**: Every design system component tested for WCAG compliance
- **Contrast ratio monitoring**: Custom utilities validate all color combinations
- **Accessible error styling**: New `text-error-on-light` utility class for proper contrast

#### Development Workflow Integration
- **Zero production impact**: All accessibility checking is development-only
- **Build-time validation**: ESLint catches accessibility issues before deployment
- **Storybook integration**: Visual accessibility reports for all 17 design system components  
- **Custom validation**: Automated contrast checking with detailed console logging

#### WCAG Compliance Status
- **ErrorMessage**: ✅ WCAG AA compliant (5.91:1 contrast)
- **ViewToggle**: ✅ WCAG AA compliant (5.17:1 contrast) with enhanced UX
- **Navigation**: ✅ WCAG AA compliant (8.23:1+ contrast ratios)
- **Buttons**: ✅ All variants meet WCAG AA requirements
- **Form Components**: ✅ Proper label associations and contrast ratios
- **Overall Status**: **100% WCAG AA compliant** across all components

---

**Last Updated**: Phase 6a Advanced Content Hierarchies Complete (Foundation + Service Layer + All Core Pages + Data Management Forms + Edit & Delete Operations + Individual User Progress + Favourites System + Advanced Hierarchical Content Organisation + Complete Design System with 23 UI Components + Unified Navigation + Mobile Responsive Design + Comprehensive WCAG AA Accessibility Implementation + Performance Optimization + Professional 3-Environment Deployment Pipeline + Advanced Content Display Components + Microsoft Playwright MCP Integration + Smart Parent-Based Routing + Infinite-Depth Content Hierarchies + Recursive Tree Building + Enhanced Organisation Components)  
**Next Update**: After Phase 7: Comprehensive Testing & Quality Assurance