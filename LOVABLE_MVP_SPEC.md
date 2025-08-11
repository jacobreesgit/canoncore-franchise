# Claude Code MVP Specification - CanonCore

## 1. Product Context

### Product goal
Create a content management platform for organising REAL existing fictional franchises (Marvel, Doctor Who, Star Wars, DC, LOTR, etc.) ONLY. No original content creation - purely for cataloguing and tracking progress through established franchise universes.

### Primary users and jobs to be done
- **Franchise fans** - Catalogue REAL franchises like MCU phases, Doctor Who spinoffs, Star Wars eras with proper hierarchical relationships (NO original content)
- **Content consumers** - Track viewing progress through existing shows/movies, discover chronological watch orders for real franchises
- **Fandom organisers** - Create comprehensive databases of EXISTING characters, locations, events from established franchises (Marvel, DC, Doctor Who, etc.)

### Non goals for MVP
- **ABSOLUTELY NO original fictional content or story creation**
- **ABSOLUTELY NO tools for creating new characters, stories, or fictional content**
- Real-time collaboration on franchise organisation
- Rich media file hosting or streaming capabilities  
- Payment or monetisation systems
- Advanced user roles beyond owner/public access
- Mobile native applications
- AI-powered content recommendations
- Social features like comments or discussions
- Any content creation or editing tools for original fiction

### Tech constraints and preferences
- **Keep**: Next.js 15 + React 19 + TypeScript stack (package.json)
- **Keep**: Firebase Auth + Firestore for backend services (lib/firebase.ts, firestore.rules)
- **Keep**: Tailwind CSS v4 for styling (package.json)
- **Keep**: Jest testing framework with comprehensive coverage (__tests__/)
- **Keep**: Service layer architecture for data access (lib/services/)
- **Prefer**: Node.js 22 runtime, Firebase SDK v12, strict TypeScript configuration
- **Avoid**: Additional external APIs, complex state management libraries, server-side frameworks
- **Constraint**: NEW Firebase project to be created for fresh franchise-focused deployment

### Key assumptions
- **CRITICAL ASSUMPTION**: Users ONLY organise REAL existing fictional franchises (MCU, Doctor Who, Star Wars, DC, LOTR) - NEVER creating original content
- **Assumption**: Users are cataloguing established movies/shows/books that already exist (Iron Man 2008, The Eleventh Hour, A New Hope)
- **Assumption**: Hierarchical organisation (franchise > series/phases > episodes/movies > existing characters) meets cataloguing needs for real properties
- **Assumption**: Progress tracking applies ONLY to viewable content (existing episodes, movies, books) with automatic calculation for organisational holders (series, phases show progress based on contained viewable content)
- **Assumption**: Progress tracking should be individual per user - same public content can show different progress states for different users (100% completed for User A, 0% not started for User B)
- **Assumption**: Current comprehensive test suite (798 tests per CLAUDE.md) indicates production-ready codebase maturity

## 2. Snapshot of Current System

The repository contains a fully-featured fictional universe organisation system built with Next.js 15, React 19, TypeScript, and Firebase. The system includes Google OAuth authentication, universe creation/management for franchises like Doctor Who or Marvel, complete CRUD operations with edit forms and delete functionality, hierarchical content organisation for series/movies/characters, progress tracking for viewable content, public discovery of fan-curated universes, and comprehensive testing (798 tests across 47 suites). The codebase demonstrates production-ready architecture with service layer abstraction, error boundaries, and extensive UI component library with Storybook integration.

```
canoncore2/
├── app/                          # Next.js App Router
│   ├── content/[id]/            # Individual content views (episodes, characters)
│   ├── profile/[userId]/        # User profile pages
│   ├── public/                  # Anonymous universe browsing
│   ├── universe/[id]/           # Universe detail (Doctor Who, Marvel)
│   ├── layout.tsx               # Root auth/error layout
│   └── page.tsx                 # Landing/dashboard
├── components/                   # 40+ reusable UI components
│   ├── *.stories.tsx            # Storybook component stories
│   └── *.tsx                    # Component implementations
├── lib/
│   ├── services/                # Data access service layer
│   ├── auth-context.tsx         # Firebase Auth integration
│   ├── firebase.ts              # Firebase configuration
│   └── firestore.ts             # Data models/interfaces
├── __tests__/                   # Jest test suite (798 tests)
├── functions/                   # Firebase Cloud Functions
├── scripts/                     # Database management utilities
├── hooks/                       # Custom React hooks
└── firebase.json                # Firebase project configuration
```

## 3. MVP Definition

### The smallest end to end slice that delivers core value
Fan discovers public "Doctor Who Universe" (cataloguing REAL Doctor Who episodes) → creates account → catalogues own "Marvel Cinematic Universe" → adds REAL Phase 1 movies (Iron Man 2008, Hulk 2008, etc.) → catalogues EXISTING characters like Tony Stark from the actual MCU → tracks viewing progress through REAL MCU phases → makes franchise catalogue public for other Marvel fans to discover and reference.

### Features split into three buckets

#### Must have
- Google OAuth authentication with Firebase Auth
- Franchise catalogue CRUD for REAL major franchises (MCU, Doctor Who, Star Wars, DC, LOTR, etc.)
- Content cataloguing for EXISTING franchise elements: real series, actual movies, existing episodes, established characters
- Content hierarchy system: Real Franchise > Actual Series/Phases > Real Episodes/Movies > Existing Characters/Locations
- Progress tracking on REAL viewable content (actual episodes, released movies, published books)
- Public franchise discovery for fans to share comprehensive catalogues of EXISTING franchises
- User profiles with favourites for real franchise universes and specific existing content
- Responsive web interface optimised for cataloguing established franchise content

#### Nice to have later
- Content variations for different continuities (comics vs movies vs TV)
- Advanced cross-referencing between characters/events across series
- Watch order recommendations based on chronology or release dates
- Content import from external databases (IMDb, Wikipedia)
- Enhanced search across all franchise content
- Detailed progress analytics per franchise/series
- Content rating and review systems
- Timeline visualization for complex franchises

#### Cut for now
- **Original content creation tools (NEVER - this is forbidden)**
- **Story creation or fictional content generation (NEVER - this is forbidden)**
- Real-time collaborative franchise editing
- File upload for fan art or custom media
- Advanced user permission systems for franchise management
- Third-party streaming service integration
- Mobile native applications
- Community features (forums, comments, discussions)
- Franchise comparison tools
- Multi-language support for international franchises

### Acceptance criteria for the must have list

#### Authentication
- Users can sign in with Google OAuth and auth state persists across sessions
- Protected routes redirect unauthenticated users to sign-in
- Users can sign out from any page with immediate auth state update

#### Franchise Cataloguing (Real Franchise Organisation)
- Authenticated users can create catalogues for REAL major franchises (MCU, Doctor Who, Star Wars)
- Franchise owners can edit catalogue details, add source links to official sites/wikis (IMDb, official franchise sites)
- Public franchise catalogues allow other fans to browse comprehensive databases of EXISTING franchises
- Catalogue list shows user's organised REAL franchises with privacy status and viewing progress summaries

#### Content System (Real Franchise Elements)
- Franchise owners can catalogue EXISTING content: real series, actual movies, released episodes, established characters
- Content supports hierarchical organisation: MCU Phase 1 > Iron Man (2008 film) > Tony Stark (existing character profile)
- Content respects catalogue privacy (public franchise databases visible to all, private only to owner)
- Multiple content types with appropriate badges (viewable real content vs reference material for existing characters)

#### Progress Tracking (Viewing Progress)
- **ONLY viewable content (episodes, movies, books) can be directly ticked/marked as watched**
- Progress tracking for viewable content: 0-100% or simple watched/unwatched toggle
- **Organisational holders automatically show calculated progress** based on their contained viewable content (e.g., "MCU Phase 1" shows 60% if you've watched 3 out of 5 movies)
- Progress propagates up hierarchies: viewable content → organisational holders → franchise progress
- Progress controls accessible ONLY on viewable content pages with persistent state across sessions
- "Up next" recommendations based on viewing progress and franchise chronology

#### Discovery and Sharing (Franchise Databases)
- Anonymous users can browse public franchise databases created by other fans
- Authenticated users can favourite well-organised franchise universes
- User profiles display public franchise databases and allow community browsing
- Public franchise browsing includes search for specific series/characters across universes

## 4. MVP Architecture

### Plain text diagram
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     Client (Next.js 15 Franchise Manager)                      │
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────────────────┐ │
│  │   Pages     │  │ Components  │  │   Hooks     │  │       Contexts         │ │
│  │             │  │             │  │             │  │                        │ │
│  │ /universe   │  │ Forms       │  │ Editable    │  │ AuthContext (Firebase) │ │
│  │ (Marvel)    │  │ Cards       │  │ Error       │  │ ErrorContext (Toast)   │ │
│  │ /content    │  │ Trees       │  │ Relations   │  │ UpNextContext          │ │
│  │ (Iron Man)  │  │ Progress    │  │ Progress    │  │ FranchiseContext       │ │
│  │ /profile    │  │ Modals      │  │ Favorites   │  │                        │ │
│  │ /public     │  │ Navigation  │  │             │  │                        │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────────────────┘ │
│                                         │                                       │
├─────────────────────────────────────────┼───────────────────────────────────────┤
│            Franchise Service Layer      │                                       │
│                                         ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                 Franchise Management Services                           │   │
│  │                                                                         │   │
│  │  ContentService    UniverseService    UserService    RelationshipSvc   │   │
│  │  - Episodes/Movies - Franchise CRUD   - Fan Profiles - Character links │   │
│  │  - Characters      - Progress calc    - Favorites    - Series order    │   │
│  │  - Viewing progress- Public discovery - Watch lists  - Cross-refs      │   │
│  │  - Series/Phases   - Marvel/DW/SW     - Community    - Chronology      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                         │                                       │
├─────────────────────────────────────────┼───────────────────────────────────────┤
│               Firebase Backend          │                                       │
│                                         ▼                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐   │
│  │  Firestore  │  │Firebase Auth│  │   Hosting   │  │    Security Rules    │   │
│  │             │  │             │  │             │  │                      │   │
│  │ users       │  │ Google      │  │ Static      │  │ Owner permissions    │   │
│  │ universes   │  │ OAuth       │  │ assets      │  │ Public read access   │   │
│  │ (franchises)│  │ JWT tokens  │  │ SPA routes  │  │ Fan database sharing │   │
│  │ content     │  │ User mgmt   │  │             │  │ Franchise visibility │   │
│  │ (episodes/  │  │             │  │             │  │                      │   │
│  │  chars)     │  │             │  │             │  │                      │   │
│  │ favorites   │  │             │  │             │  │                      │   │
│  │ relations   │  │             │  │             │  │                      │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘

Franchise Data Flow:
Fan Input → Franchise Pages → Service Layer → Firestore Collections
         ↙                 ↙                ↙
Auth Check → Firebase Auth → Security Rules → Franchise Data Access
```

### Key decisions
- **Client-side rendering**: Next.js App Router optimised for complex franchise navigation with real-time updates
- **Authentication**: Firebase Auth with Google OAuth for fan community access
- **Data storage**: Firestore NoSQL perfect for flexible franchise schemas (Marvel vs Doctor Who structures)
- **State management**: React Context for auth/franchise state, local component state for UI interactions
- **Styling**: Tailwind CSS for consistent franchise theming and responsive design
- **No server-side rendering**: Client-rendered for real-time franchise updates and progress tracking
- **Service layer pattern**: Abstraction over Firebase for testable franchise data operations

## 5. Exact Deliverables for Claude Code to Build

### Target runtime versions
- Node.js: 22.x (latest LTS)
- Package manager: npm 10.x (bundled with Node.js)
- Firebase CLI: 13.x (for deployment and emulators)

### Directory structure to create under mvp
```
mvp/
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── content/[id]/        # Individual franchise content (episodes, characters)
│   │   ├── profile/[userId]/    # Fan profile pages  
│   │   ├── public/              # Browse public franchise databases
│   │   ├── universe/[id]/       # Franchise universe detail (Marvel, Doctor Who)
│   │   ├── layout.tsx           # Root layout with auth
│   │   ├── page.tsx             # Home dashboard with franchise overview
│   │   └── globals.css          # Global styles
│   ├── components/              # Reusable UI components
│   │   ├── forms/               # Form components for franchise data
│   │   ├── ui/                  # Basic UI elements  
│   │   ├── franchise/           # Franchise-specific components
│   │   └── layout/              # Layout components
│   ├── lib/
│   │   ├── services/            # Franchise data access services
│   │   ├── hooks/               # Custom React hooks for franchise operations
│   │   ├── contexts/            # React contexts for franchise state
│   │   ├── types.ts             # TypeScript interfaces for franchise data
│   │   ├── firebase.ts          # Firebase configuration
│   │   └── utils.ts             # Franchise utility functions
│   └── styles/                  # Additional stylesheets
├── tests/
│   ├── components/              # Component tests
│   ├── services/                # Service layer tests
│   ├── integration/             # Firebase integration tests
│   ├── utils/                   # Test utilities
│   └── setup.ts                 # Jest setup configuration
├── scripts/
│   ├── dev-setup.ts             # Development environment setup
│   └── seed-data.ts             # Demo franchise data (Marvel, Doctor Who samples)
├── firebase.json                # Firebase project configuration
├── firestore.rules              # Database security rules
├── .env.example                 # Environment variable template
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── jest.config.js               # Jest test configuration
└── README.md                    # Franchise organisation setup instructions
```

### Dependency list with version ranges
#### Runtime dependencies
- next: ^15.4.4 (React framework)
- react: ^19.1.0 (UI library) 
- react-dom: ^19.1.0 (DOM renderer)
- firebase: ^12.0.0 (Firebase SDK)
- tailwindcss: ^4.0.0 (CSS framework)

#### Development dependencies  
- typescript: ^5.0.0 (Type checking)
- @types/react: ^19.0.0 (React type definitions)
- @types/react-dom: ^19.0.0 (React DOM type definitions)
- @types/node: ^20.0.0 (Node.js type definitions)
- eslint: ^9.32.0 (Code linting)
- eslint-config-next: ^15.4.5 (Next.js ESLint configuration)
- jest: ^30.0.0 (Testing framework)
- @testing-library/react: ^16.3.0 (React testing utilities)
- @testing-library/jest-dom: ^6.6.4 (DOM testing matchers)
- @testing-library/user-event: ^14.6.1 (User interaction testing)
- jest-environment-jsdom: ^30.0.0 (Browser-like testing environment)
- firebase-admin: ^13.4.0 (Firebase Admin SDK for testing)
- tsx: ^4.20.3 (TypeScript execution for scripts)

### Coding conventions
- **TypeScript**: Strict mode enabled, no any types, explicit return types for functions
- **ESLint**: Next.js configuration with React hooks rules, no unused variables
- **Prettier**: Integrated with ESLint for consistent formatting (assumption)
- **Import organisation**: External libraries first, internal modules second, relative imports last
- **Component patterns**: Functional components with hooks, proper prop typing, error boundaries
- **Commit messages**: Conventional commits format for consistency (assumption)

## 6. API Design

Since this is a client-side application using Firebase, the "API" consists of Firebase service methods wrapped in service classes for franchise management:

### Authentication Service
```typescript
// Method: signInWithGoogle
// Auth: None (public method)
// Input: None
// Output: Promise<User | null>
// Example:
const user = await authService.signInWithGoogle();
// Response: { uid: "abc123", email: "user@gmail.com", displayName: "Marvel Fan" }

// Method: signOut  
// Auth: Authenticated user
// Input: None
// Output: Promise<void>
```

### Universe Service (Franchise Management)
```typescript
// Method: create
// Auth: Authenticated user
// Input: CreateUniverseData
// Output: Promise<Universe>
// Example Request:
const universe = await universeService.create("user123", {
  name: "Marvel Cinematic Universe",
  description: "Complete MCU timeline with all phases, movies, and characters",
  isPublic: true,
  sourceLink: "https://marvelcinematicuniverse.fandom.com/",
  sourceLinkName: "MCU Wiki"
});
// Response: { id: "mcu456", name: "Marvel Cinematic Universe", userId: "user123", isPublic: true, progress: 0, createdAt: Timestamp }

// Method: getPublicUniverses
// Auth: None (public access)
// Input: None  
// Output: Promise<Universe[]>
// Example:
const publicUniverses = await universeService.getPublicUniverses();
// Response: Array of public franchise databases like Doctor Who, Star Wars, LOTR
```

### Content Service (Franchise Elements)
```typescript
// Method: create
// Auth: Universe owner
// Input: userId, universeId, CreateContentData
// Output: Promise<Content>
// Example Request - Adding Iron Man movie to MCU:
const content = await contentService.create("user123", "mcu456", {
  name: "Iron Man",
  description: "Tony Stark becomes Iron Man. First MCU Phase 1 movie.",
  isPublic: true,
  isViewable: true,
  mediaType: "video"
});
// Response: { id: "ironman789", name: "Iron Man", universeId: "mcu456", isViewable: true, progress: 0 }

// Method: create - Adding character to franchise:
const character = await contentService.create("user123", "mcu456", {
  name: "Tony Stark / Iron Man", 
  description: "Genius billionaire philanthropist, founding Avenger",
  isPublic: true,
  isViewable: false,
  mediaType: "character"
});

// Method: updateProgress
// Auth: Content owner
// Input: contentId, progress (0-100)
// Output: Promise<void>
// Example - Marking Iron Man movie as watched (ONLY viewable content can be directly marked):
await contentService.updateProgress("ironman789", 100);
// This automatically updates organisational holder progress (MCU Phase 1's calculatedProgress updates based on contained movies)
```

### User Service (Fan Profiles)
```typescript
// Method: addToFavorites
// Auth: Authenticated user
// Input: userId, targetId, targetType
// Output: Promise<void>
// Example - Favoriting someone's comprehensive Doctor Who database:
await userService.addToFavorites("user123", "doctorwho456", "universe");

// Method: getFavorites
// Auth: User (own favorites only)
// Input: userId, targetType
// Output: Promise<Favorite[]>
// Example:
const favorites = await userService.getFavorites("user123", "universe");
// Response: User's favorited franchise databases
```

## 7. Data Model

### Collections and fields

#### users
- id: string (Firebase Auth UID, primary key)
- displayName: string | null (from Google OAuth - "Marvel Fan", "Whovian")
- email: string | null (from Google OAuth) 
- createdAt: Timestamp (account creation)
- **Indexes**: Primary key (id)

#### universes (Franchise Databases)
- id: string (auto-generated, primary key)
- name: string ("Marvel Cinematic Universe", "Doctor Who Universe", "Star Wars Canon")
- description: string ("Complete MCU timeline", "All Doctor Who episodes and spinoffs")
- userId: string (owner reference to users.id - franchise curator)
- isPublic: boolean (allow other fans to browse this franchise database)
- sourceLink: string | optional ("https://marvelcinematicuniverse.fandom.com/")
- sourceLinkName: string | optional ("MCU Wiki", "Tardis Data Core")
- progress: number | optional (0-100, viewing progress across entire franchise)
- contentProgress: object | optional ({ total, completed, inProgress, unstarted })
- createdAt: Timestamp (creation date)
- updatedAt: Timestamp (last modification)
- **Indexes**: userId + isPublic + createdAt (compound), isPublic + createdAt (public franchise discovery)
- **Relations**: One-to-many with content (franchise elements), one-to-many with favorites

#### content (Franchise Elements)
- id: string (auto-generated, primary key)  
- name: string ("Iron Man", "Tony Stark", "The Eleventh Hour", "The TARDIS")
- description: string ("First MCU movie", "Genius billionaire", "Matt Smith's first episode", "Time machine")
- universeId: string (parent franchise reference)
- userId: string (franchise curator reference, inherited from universe)
- isViewable: boolean (true for movies/episodes/books, false for characters/locations/items)
- mediaType: string (video|audio|text|character|location|item|event|collection)
- progress: number | optional (0-100, ONLY for viewable content - episodes/movies can be directly marked)
- calculatedProgress: number | optional (calculated from contained viewable content for organisational holders like series/phases)
- lastAccessedAt: Timestamp | optional (progress tracking)
- isPublic: boolean (inherited from universe)
- createdAt: Timestamp (creation date)
- updatedAt: Timestamp (last modification)
- **Indexes**: universeId + createdAt (franchise content listing), userId + createdAt (user content)
- **Relations**: Many-to-one with universe (franchise), one-to-many with contentRelationships

#### favorites (Fan Bookmarks)
- id: string (auto-generated, primary key)
- userId: string (fan reference)
- targetId: string (universeId or contentId - favorited franchise or specific content)
- targetType: string (universe|content)
- createdAt: Timestamp (favorite date)
- **Indexes**: userId + targetType + createdAt (user favorites listing)
- **Relations**: Many-to-one with users, references to universes or content

#### contentRelationships (Franchise Cross-References)
- id: string (auto-generated, primary key)
- contentId: string (child content reference - "Tony Stark" character)
- parentId: string (parent content reference - "Iron Man" movie)
- universeId: string (franchise reference for security)
- userId: string (franchise curator reference for security)
- displayOrder: number | optional (chronological order within series/phase)
- contextDescription: string | optional ("First appearance", "Main character", "Cameo")
- createdAt: Timestamp (relationship creation)
- **Indexes**: parentId + displayOrder (franchise hierarchy queries), contentId (reverse lookups)
- **Relations**: Many-to-one with content (both parent and child), many-to-one with universe

### Migration notes
No data migration needed - this is a fresh MVP implementation for franchise organisation. A NEW Firebase project will be created specifically for this franchise cataloguing system, replacing any existing Firebase configuration.

## 8. Environment Variables

### Required variables
- NEXT_PUBLIC_FIREBASE_API_KEY: Firebase web API key (public, safe to expose)
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: Firebase auth domain (public)
- NEXT_PUBLIC_FIREBASE_PROJECT_ID: Firebase project ID (public)
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: Firebase storage bucket (public)
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: Firebase messaging sender (public)
- NEXT_PUBLIC_FIREBASE_APP_ID: Firebase app identifier (public)

### Optional variables  
- FIREBASE_PRIVATE_KEY: Service account private key (server-side only, base64 encoded)
- FIREBASE_CLIENT_EMAIL: Service account email (server-side only)
- NODE_ENV: Environment mode (development|production, defaults to development)

### Sample .env.example block
```bash
# Firebase Configuration (Public - safe to commit)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyExample123456789
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Firebase Admin (Server-side only - keep secret)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Environment
NODE_ENV=development
```

## 9. Setup and Local Run

### Package scripts
```json
{
  "dev": "next dev --turbopack",
  "build": "next build", 
  "start": "next start",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:integration": "firebase emulators:exec --only auth,firestore 'jest --config jest.integration.config.js'",
  "lint": "next lint",
  "format": "prettier --write .",
  "type-check": "tsc --noEmit",
  "seed": "tsx scripts/seed-data.ts"
}
```

### Local service requirements
- No database setup needed (Firestore is cloud-hosted)
- No Firebase emulators needed (development uses live Firebase)
- No additional local services required

### Firebase setup notes
- Development and testing will use the live Firebase project
- No emulator configuration needed - keep setup simple
- Firebase CLI installation is optional (only needed for deployment)

## 10. Test Plan

### Unit test focus areas
- Service layer methods (franchise CRUD operations, progress calculations)
- React component behavior (franchise navigation, content hierarchies, progress tracking)
- Custom hooks (auth state, franchise operations, viewing progress)
- Utility functions (franchise data formatting, progress calculations, content type validation)
- Context providers (auth context, franchise context, progress context)

### Integration test focus areas
- Firebase Auth flow (Google OAuth for fan accounts) - uses live Firebase
- Firestore security rules (franchise data access permissions, public/private visibility) - tests against live database
- Service layer with real Firebase (franchise CRUD operations end-to-end)
- Component integration with services (complete fan workflows for franchise management)

### Regression checklist (30-minute session)
1. **Authentication**: Sign in as franchise fan, verify auth state, sign out
2. **Franchise Creation**: Create Marvel Universe, add basic details, toggle public/private
3. **Content Management**: Add Iron Man movie, create Tony Stark character, link them hierarchically
4. **Progress Tracking**: Mark Iron Man as watched, verify progress propagates to MCU universe
5. **Public Discovery**: Browse public franchise databases anonymously, verify privacy rules
6. **Franchise Navigation**: Navigate complex hierarchies (MCU > Phase 1 > Iron Man > Characters)
7. **Favourites System**: Bookmark well-organised Doctor Who database, verify persistence
8. **Cross-References**: Link character across multiple movies/episodes within franchise
9. **Responsive Design**: Basic mobile layout for franchise browsing on phones
10. **Performance**: Large franchise trees (all Marvel movies + characters) load reasonably

## 11. Risks and Mitigations

### Security
- **Risk**: Firebase configuration exposed in client code for franchise data
- **Mitigation**: Use public Firebase config (safe) and secure server-side admin keys properly

### Performance  
- **Risk**: Large franchise hierarchies (all Doctor Who episodes + spinoffs) cause slow loading
- **Mitigation**: Implement pagination and lazy loading for complex franchise content trees

### Coupling
- **Risk**: Components tightly coupled to Firebase SDK making franchise operations inflexible
- **Mitigation**: Service layer abstraction isolates Firebase dependencies for franchise data

### Licensing
- **Risk**: Dependency licensing conflicts for franchise management features
- **Mitigation**: All specified dependencies use permissive licenses (MIT/Apache)

## 12. Handoff Checklist for Claude Code

1. **Project Setup**
   - Create mvp/ directory structure as specified for franchise organisation
   - Initialize npm project with package.json dependencies for React/Firebase
   - Set up TypeScript configuration with strict mode for franchise data types
   - Configure Tailwind CSS with franchise-friendly theme customization

2. **Firebase Configuration**
   - Create Firebase config file with environment variables for franchise project
   - Set up Firebase Auth with Google OAuth provider for fan authentication
   - Configure Firestore with security rules for franchise data sharing
   - Test Firebase connection and franchise data operations in development

3. **Core Architecture**  
   - Implement franchise service layer classes (ContentService, UniverseService, UserService)
   - Create React contexts (AuthContext, FranchiseContext, ProgressContext) 
   - Build custom hooks for franchise operations (useProgress, useFranchise, useFavorites)
   - Set up error boundaries and loading states for franchise page navigation

4. **UI Implementation**
   - Create reusable component library optimised for franchise data (forms, cards, trees, modals)
   - Implement main pages (home dashboard, franchise detail, content detail, fan profiles)
   - Build franchise navigation components with hierarchical browsing
   - Add responsive design with franchise theming and mobile optimisation

5. **Testing Setup**
   - Configure Jest with jsdom environment for franchise component testing
   - Create test utilities and mocks for Firebase franchise operations
   - Write unit tests for franchise services and UI components
   - Set up Firebase emulator integration tests for franchise data workflows

6. **Development Environment**
   - Start development server with npm run dev for franchise development
   - Verify hot reload works correctly for franchise page updates
   - Test Firebase Auth integration with Google OAuth for fan accounts
   - Validate franchise CRUD operations work end-to-end with progress tracking

7. **Success Criteria Verification**
   - Fan can sign in with Google OAuth and create franchise account
   - Fan can create comprehensive franchise database (Marvel, Doctor Who, etc.)
   - Fan can organise complex content hierarchies with episodes/movies/characters
   - Public franchise discovery works for sharing databases with other fans
   - Progress tracking functions correctly for viewing episodes/movies across franchises
   - Test suite passes with good coverage for franchise functionality

## 13. Machine Readable Build Spec

```json
{
  "runtime": {
    "language": "Node.js",
    "version": "22.x",
    "packageManager": "npm"
  },
  "framework": {
    "name": "Next.js",
    "version": "15.4.4"
  },
  "directories": [
    "mvp/src/app",
    "mvp/src/components", 
    "mvp/src/lib/services",
    "mvp/src/lib/hooks",
    "mvp/src/lib/contexts",
    "mvp/tests/components",
    "mvp/tests/services", 
    "mvp/tests/integration",
    "mvp/scripts"
  ],
  "dependencies": {
    "runtime": {
      "next": "^15.4.4",
      "react": "^19.1.0",
      "react-dom": "^19.1.0", 
      "firebase": "^12.0.0",
      "tailwindcss": "^4.0.0"
    },
    "dev": {
      "typescript": "^5.0.0",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      "@types/node": "^20.0.0",
      "eslint": "^9.32.0",
      "eslint-config-next": "^15.4.5",
      "jest": "^30.0.0",
      "@testing-library/react": "^16.3.0",
      "@testing-library/jest-dom": "^6.6.4",
      "@testing-library/user-event": "^14.6.1",
      "jest-environment-jsdom": "^30.0.0",
      "firebase-admin": "^13.4.0",
      "tsx": "^4.20.3"
    }
  },
  "env": [
    {
      "name": "NEXT_PUBLIC_FIREBASE_API_KEY",
      "required": true,
      "example": "AIzaSyExample123456789",
      "notes": "Firebase web API key for franchise data access (public)"
    },
    {
      "name": "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", 
      "required": true,
      "example": "your-project.firebaseapp.com",
      "notes": "Firebase auth domain for fan authentication (public)"
    },
    {
      "name": "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      "required": true, 
      "example": "your-project-id",
      "notes": "Firebase project ID for franchise database (public)"
    },
    {
      "name": "FIREBASE_PRIVATE_KEY",
      "required": false,
      "example": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
      "notes": "Service account private key for franchise admin operations (server-side only)"
    }
  ],
  "endpoints": [
    {
      "method": "POST",
      "path": "/api/auth/signin", 
      "auth": "public",
      "input": {},
      "output": {"user": "User | null"},
      "accept": ["Initiates Google OAuth flow for franchise fans"]
    },
    {
      "method": "GET",
      "path": "/api/universes",
      "auth": "authenticated", 
      "input": {},
      "output": {"universes": "Universe[]"},
      "accept": ["Returns user's own franchise databases (Marvel, Doctor Who, etc.)"]
    },
    {
      "method": "POST", 
      "path": "/api/universes",
      "auth": "authenticated",
      "input": {"name": "string", "description": "string", "isPublic": "boolean"},
      "output": {"universe": "Universe"},
      "accept": ["Creates new franchise database for authenticated fan"]
    },
    {
      "method": "GET",
      "path": "/api/universes/public",
      "auth": "public",
      "input": {},
      "output": {"universes": "Universe[]"}, 
      "accept": ["Returns all public franchise databases for community discovery"]
    },
    {
      "method": "POST",
      "path": "/api/content",
      "auth": "authenticated",
      "input": {"name": "string", "mediaType": "string", "isViewable": "boolean"},
      "output": {"content": "Content"},
      "accept": ["Creates franchise content (episodes, characters, etc.) within universe"]
    }
  ],
  "dataModel": [
    {
      "entity": "User",
      "fields": [
        {"name": "id", "type": "string", "index": true},
        {"name": "displayName", "type": "string | null", "index": false},
        {"name": "email", "type": "string | null", "index": false},
        {"name": "createdAt", "type": "Timestamp", "index": false}
      ],
      "relations": [
        {"type": "one_to_many", "to": "Universe", "via": "userId"},
        {"type": "one_to_many", "to": "Favorite", "via": "userId"}
      ]
    },
    {
      "entity": "Universe", 
      "fields": [
        {"name": "id", "type": "string", "index": true},
        {"name": "name", "type": "string", "index": false},
        {"name": "description", "type": "string", "index": false},
        {"name": "userId", "type": "string", "index": true},
        {"name": "isPublic", "type": "boolean", "index": true},
        {"name": "sourceLink", "type": "string | optional", "index": false},
        {"name": "progress", "type": "number | optional", "index": false},
        {"name": "createdAt", "type": "Timestamp", "index": true}
      ],
      "relations": [
        {"type": "many_to_one", "to": "User", "via": "userId"},
        {"type": "one_to_many", "to": "Content", "via": "universeId"}
      ]
    },
    {
      "entity": "Content",
      "fields": [
        {"name": "id", "type": "string", "index": true},
        {"name": "name", "type": "string", "index": false}, 
        {"name": "description", "type": "string", "index": false},
        {"name": "universeId", "type": "string", "index": true},
        {"name": "userId", "type": "string", "index": true},
        {"name": "isViewable", "type": "boolean", "index": false},
        {"name": "mediaType", "type": "string", "index": false},
        {"name": "progress", "type": "number | optional", "index": false},
        {"name": "createdAt", "type": "Timestamp", "index": true}
      ],
      "relations": [
        {"type": "many_to_one", "to": "Universe", "via": "universeId"},
        {"type": "one_to_many", "to": "ContentRelationship", "via": "contentId"}
      ]
    }
  ],
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build", 
    "test": "jest",
    "lint": "next lint",
    "format": "prettier --write .",
    "seed": "tsx scripts/seed-data.ts"
  },
  "postCreate": [
    "Start development server with npm run dev",
    "Open http://localhost:3000 in browser for franchise management",
    "Verify Firebase authentication works for fan accounts",
    "Run test suite with npm test for franchise functionality", 
    "Seed demo franchise data (Marvel, Doctor Who samples) if applicable"
  ]
}
```