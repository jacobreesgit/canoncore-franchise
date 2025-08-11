# CanonCore Architecture

## Current System Overview

CanonCore is a franchise organisation platform built with Next.js 15, React 19, TypeScript, and Firebase. Currently in foundational phase with authentication and basic UI implemented.

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
│  │ (Auth wrap) │  │             │  │   out       │             │
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
- **`app/page.tsx`**: Main dashboard/landing page
  - Responsibilities: Authentication gate, dashboard placeholder
  - Data Flow: AuthContext → UI state → conditional rendering
  - States: Loading, unauthenticated (sign-in), authenticated (dashboard)

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

### Firebase Collections (Defined but not used yet)

```
users/
├── {userId}/
    ├── id: string
    ├── displayName: string | null
    ├── email: string | null  
    └── createdAt: Timestamp

universes/ (Not implemented)
content/ (Not implemented)
favorites/ (Not implemented)
contentRelationships/ (Not implemented)
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
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with AuthProvider
│   │   ├── page.tsx           # Dashboard/landing page
│   │   └── globals.css        # Global styles
│   ├── lib/
│   │   ├── contexts/
│   │   │   └── auth-context.tsx    # Authentication context
│   │   ├── firebase.ts             # Firebase config
│   │   └── types.ts                # TypeScript definitions
│   ├── components/            # (Empty - Phase 4)
│   └── styles/               # (Empty)
├── package.json              # Dependencies
├── tsconfig.json            # TypeScript config
├── next.config.ts          # Next.js config
└── todo.md                # Implementation roadmap
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

### Phase 2: Core Pages  
- Will consume AuthContext for authentication state
- Will use future service layer for data operations
- Will extend current layout structure

### Phase 3: Data Management
- Forms will integrate with service layer
- Progress tracking will update Firestore directly
- Hierarchical organisation will use ContentRelationship model

### Phase 4: UI Components
- Components will consume service layer and contexts
- Reusable components will be built for franchise-specific needs
- Responsive design will be implemented across all components

### Phase 5: Testing & Deployment
- Comprehensive testing of all implemented features
- Production environment setup and deployment
- End-to-end workflow validation

---

**Last Updated**: Phase 1 Complete (Foundation + Service Layer)  
**Next Update**: After Phase 2a: Core Pages - Dashboard & Universe