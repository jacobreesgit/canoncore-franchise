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

# Microsoft Playwright MCP (Global Configuration)
# MCP server is configured globally on this system

# Firebase Emulator commands
npm run emulator:start      # Start Firebase Auth/Firestore emulators
npm run emulator:dev        # Start emulators with data import/export
npm run dev:emulator        # Start development server with emulator mode enabled

# Version management commands
npm run version:check       # Display current version
npm run version:patch       # Increment patch version (1.5.0 → 1.5.1)
npm run version:minor       # Increment minor version (1.5.0 → 1.6.0)
npm run version:major       # Increment major version (1.5.0 → 2.0.0)
npm run release             # Build and create minor release
```

## Version Management

CanonCore uses **Phase-Based Semantic Versioning** with automated version management:

### Current Version Strategy
- **Major (x.0.0)**: Phase number (5 = Phase 5, 6 = Phase 6, 7 = Phase 7)
- **Minor (5.x.0)**: Sub-phase letter (1=a, 2=b, 3=c) - Phase 5c = 5.3.0
- **Patch (5.3.x)**: Bug fixes, small improvements, documentation updates

### Phase to Version Mapping
- **Phase 5c**: `5.3.0` (completed - UX Review & Form Component System)
- **Phase 6a**: `6.1.0` (completed - Advanced Content Hierarchies)
- **Phase 7**: `7.0.0` (completed - Comprehensive Testing & Quality Assurance)
- **Phase 8**: `8.0.0` (in progress - Context7 with UI consistency improvements)

### Version Workflow
```bash
# For bug fixes and small improvements
npm run version:patch

# For sub-phase completions (Phase 5c → 5d)
npm run version:minor

# For major phase transitions (Phase 5 → 6)
npm run version:major

# Check current version
npm run version:check
```

**Note**: Version commands automatically create git commits and tags, then push to remote.

### Version Display
The current version is displayed in the **Footer Component**: `Version 6.1.0` at bottom of pages (dashboard, discover).

Version information is sourced from `package.json` and available throughout the application via `src/lib/utils/version.ts`.

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
│               ├── add-viewable/
│               │   └── page.tsx # Viewable content creation form
│               ├── organise/
│               │   └── page.tsx # Organisational content creation form
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
├── components/            # Organized component system (23 components)
│   ├── layout/            # Page structure & containers (7 components)
│   │   ├── PageContainer, PageHeader, Navigation, Footer
│   │   ├── CardGrid, EmptyState, DeleteConfirmationModal
│   │   └── *.stories.tsx  # Storybook stories for each component
│   ├── forms/             # Form controls & validation (5 components)
│   │   ├── FormInput, FormLabel, FormTextarea, FormSelect, FormActions
│   │   └── *.stories.tsx  # Storybook stories for each component
│   ├── interactive/       # Buttons, toggles, inputs (6 components)
│   │   ├── Button, FavouriteButton, SearchBar, ViewToggle
│   │   ├── Breadcrumb, Dropdown
│   │   └── *.stories.tsx  # Storybook stories for each component
│   ├── content/          # Cards, badges, progress, trees (6 components)
│   │   ├── UniverseCard, ContentCard, ProgressBar, Badge
│   │   ├── ContentSection, Tree
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
/universes/[id]/content/add-viewable                  # Add viewable content (movies, episodes)
/universes/[id]/content/organise                     # Add organisational content (characters, locations)
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

**Completed (Foundation + Phase 1-6a Complete):**
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
- **Phase 6a Advanced Content Hierarchies Complete** - Infinite-depth parent-child relationships with recursive tree building, expandable tree navigation, smart parent-based routing, enhanced content organisation components (ContentSection, Tree, TreeNode), consistent progress color schemes, comprehensive data scanning and validation tools
- **Phase 7e Hierarchical Depth Strategy Complete** - Hybrid display system with levels 1-5 using normal tree view with indentation, levels 6+ rendering in flat style within tree structure using breadcrumbs, mobile always uses full flat display for optimal UX
- **Phase 7a MCP Development Environment Setup Complete** - Microsoft Playwright MCP server integration with live browser automation, real-time testing workflow, screenshot capture, responsive design validation
- **Phase 7b Firebase Auth Emulator + MCP Authentication Testing Complete** - Comprehensive authentication flow testing via emulator, protected route redirections, sign-out functionality validation, session management verification

**Current Implementation Phase (see todo.md):**
7. **Phase 7: MCP-First Interactive Testing & Quality Assurance** ✅ COMPLETE - Comprehensive testing through Microsoft Playwright MCP integration including form component testing, UI component interactive testing, accessibility validation, performance auditing, and multi-environment testing with real Google OAuth and Firebase Auth Emulator
8. **Phase 8: Context7** 🚧 IN PROGRESS - UI consistency improvements (progress colors unified, private badges red, streamlined interfaces) and Context7 MCP integration for advanced React optimization

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

### Phase Completion Testing
- **ALWAYS** use Microsoft Playwright MCP testing at the end of each phase completion
- **Primary Testing Method**: Real Google OAuth authentication
- **Firebase Emulator**: Only for authentication flow testing (Google popup limitations prevent MCP automation)
- **Required MCP Tests Before Phase Sign-Off**:
  - Core feature functionality validation
  - User interface interaction testing  
  - Data persistence verification
  - Error handling and edge cases
  - Visual regression with screenshots
- **Testing Environment Setup**:
  ```bash
  # Standard testing with real Google OAuth (recommended)
  npm run dev
  # MCP server runs globally
  
  # Only for authentication flow testing
  npm run dev:emulator
  npm run emulator:start
  # MCP server runs globally
  ```
- **Testing Approach**:
  - **Real Google OAuth**: All functionality testing (universe management, profiles, content, navigation)
  - **Firebase Emulator**: Only when testing authentication flows that can't be automated due to Google popup restrictions

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

**Organized Design System (23 Components in 5 Categories):**

- **Layout Components (7)**: PageContainer, PageHeader, Navigation, Footer, CardGrid, EmptyState, DeleteConfirmationModal
- **Form Components (5)**: FormInput, FormLabel, FormTextarea, FormSelect, FormActions  
- **Interactive Components (6)**: Button, FavouriteButton, SearchBar, ViewToggle, Breadcrumb, Dropdown
- **Content Display (6)**: UniverseCard, ContentCard, ProgressBar, Badge, ContentSection, Tree
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

## Microsoft Playwright MCP Integration (Phase 7: MCP-First Development)

CanonCore implements **MCP-First Development** using Microsoft's official Playwright MCP server for live, interactive testing during development conversations.

### **MCP-First Development Philosophy**

**Traditional Approach (What We Don't Do):**
- ❌ Write static test files (.spec.ts)
- ❌ Manual test execution via npm run commands
- ❌ Separate testing from development workflow

**MCP-First Approach (Our Method):**
- ✅ Live browser automation during Claude Code conversations
- ✅ Interactive testing where Claude controls the browser directly
- ✅ Real-time debugging by navigating and inspecting the app live
- ✅ Dynamic test generation based on conversation context
- ✅ Visual feedback with screenshots and UI inspection

### **MCP Setup (Global Configuration)**

**Global MCP Configuration:**
- Microsoft Playwright MCP server configured globally on system
- No local MCP configuration files needed
- Playwright dependency maintained for browser automation compatibility
- Development workflow optimized for live testing with global MCP

**Firebase Auth Emulator Integration:**
- Firebase Auth Emulator (port 9099) and Firestore Emulator (port 8080) for limited authentication testing
- Environment-based configuration switching (`NEXT_PUBLIC_USE_EMULATOR`)
- Test user accounts (Alice, Bob) for authentication flow testing only
- **Critical Limitation**: Emulator incompatible with Next.js App Router SSR for dynamic routes (`/universes/[id]`, `/profile/[userId]`, `/content/[id]`)
- **Primary Testing Method**: Real Google OAuth for all functionality testing
- **Emulator Use Cases**: Authentication flow testing when Google popup prevents MCP automation
- **Real OAuth Required For**: All comprehensive feature testing (universe management, profiles, content, navigation)
- Automated cache clearing for reliable MCP browser testing

### **MCP-First Workflow**

**Typical Development Session:**
```bash
# Standard development (real Google OAuth)
npm run dev

# Emulator development (test users Alice/Bob)
npm run dev:emulator

# Start Firebase emulators (separate terminal)
npm run emulator:start

# MCP server runs globally - no separate startup needed

# Then in Claude Code conversation:
"Claude, navigate to localhost:3000 and test the sign-in flow"
"Claude, create a new universe and verify the form validation"
"Claude, test the mobile responsive navigation"
"Claude, check the accessibility of the content hierarchy"
```

**Key MCP Development Commands:**
- `npm run dev` - Standard development with real Google OAuth
- `npm run dev:emulator` - Development with Firebase Auth Emulator and test users
- `npm run emulator:start` - Start Firebase Auth/Firestore emulators
- MCP server runs globally - no local startup needed

**Live Testing Capabilities:**
- **Interactive Form Testing**: Fill out forms, validate submissions, test error handling
- **Responsive Design Validation**: Switch viewports, test mobile navigation, capture screenshots
- **Authentication Flows**: Test Google OAuth, session management, protected routes
- **Accessibility Checking**: Keyboard navigation, screen reader compatibility, contrast validation
- **Performance Monitoring**: Lighthouse audits, bundle analysis, loading metrics
- **Cross-Browser Testing**: Chrome, Firefox, WebKit, Edge compatibility

### **Phase 7: MCP-First Testing Strategy**

Instead of traditional test suites, Phase 7 uses **live, conversational testing**:
- **Real-Time Feedback**: Claude navigates CanonCore and reports issues immediately
- **Visual Validation**: Screenshots capture UI states for comparison and review
- **Interactive Debugging**: Live problem-solving as issues are discovered
- **Context-Aware Testing**: Testing adapts to current development focus
- **Immediate Iteration**: Fix issues and re-test instantly in the same conversation

**Coverage Areas:**
- Authentication flows (Google OAuth, session persistence, protected routes)
- Universe management (CRUD operations, visibility toggles, search functionality)
- Content hierarchies (infinite depth, parent-child relationships, progress tracking)
- User experience (responsive design, navigation, accessibility, error handling)
- Performance (Lighthouse scores, bundle optimization, loading metrics)
- Data integrity (Firebase security rules, multi-user scenarios, favourites system)
- Production validation (staging and production environment testing)

### **Critical MCP Development Insights**

**Environment Variable Management:**
- Environment variables must be prefixed with `NEXT_PUBLIC_` for client-side access
- Changes to `.env.local` require development server restart to take effect
- Use `npm run dev:emulator` command to enable emulator mode rather than permanent `.env.local` settings

**Browser Caching Issues in MCP:**
- MCP browser automation requires explicit cache clearing for reliable testing
- Equivalent to Chrome DevTools "Empty Cache and Hard Reload" 
- Implement comprehensive cache clearing: localStorage, sessionStorage, cookies, service workers
- Essential when environment variables or Firebase configuration changes

**Hydration Mismatch Prevention:**
- Server-side rendering must match client-side rendering exactly
- Version numbers and dynamic content can cause SSR/client mismatches
- Convert client components to server components when possible to eliminate hydration issues

**Firebase Emulator Best Practices:**
- Use consistent test user accounts (Alice, Bob) for predictable testing scenarios
- Emulator provides fast, offline authentication without rate limits
- Hybrid approach: emulator for development speed, real OAuth for production validation
- Emulator data persists between restarts for consistent test scenarios

## Next Steps

Refer to todo.md for the current implementation roadmap. Each phase is designed as manageable tasks for iterative development. The LOVABLE_MVP_SPEC.md contains the complete technical specification for the rebuild.