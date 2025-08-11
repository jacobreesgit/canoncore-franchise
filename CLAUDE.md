# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CanonCore is a franchise organisation platform for cataloguing REAL existing fictional franchises (Marvel, Doctor Who, Star Wars, etc.). This is a ground-up rebuild of an existing project, following the MVP specification in LOVABLE_MVP_SPEC.md.

**Critical Constraint**: Users can ONLY organise existing fictional franchises - NEVER create original content. The platform is purely for cataloguing established franchise universes and tracking viewing progress.

## Development Commands

```bash
# Start development server
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
```

## Development Data Management

The project includes a script to clear development data from Firestore:

```bash
npm run clear-data --force
```

**Important Notes:**
- Requires `--force` flag to run as a safety measure
- Clears collections: `universes`, `content`, `favorites`, `contentRelationships`
- **Preserves user accounts** (users collection is untouched)
- May encounter permission errors due to Firestore security rules (expected)
- If script fails, manually delete collections via Firebase Console
- Useful for testing from a clean state during development

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
│   │       └── page.tsx   # Content detail pages (episodes, characters)
│   ├── discover/
│   │   └── page.tsx       # Public franchise discovery page
│   ├── profile/
│   │   └── [userId]/
│   │       └── page.tsx   # User profile pages with favourites
│   └── universes/
│       ├── create/
│       │   └── page.tsx   # Universe creation form
│       └── [id]/
│           ├── page.tsx   # Universe detail pages
│           └── content/
│               └── create/
│                   └── page.tsx # Content creation form
├── lib/
│   ├── contexts/          # React contexts (AuthContext implemented)
│   ├── services/          # Firebase service layer (all 4 services implemented)
│   ├── hooks/             # Custom React hooks (empty)
│   ├── firebase.ts        # Firebase configuration
│   └── types.ts           # TypeScript interfaces
└── components/            # UI components (empty)
```

### Current Implementation Status

**Completed (Foundation + Phase 1 + Phase 2a + Phase 2b + Phase 3a + Phase 3b):**
- Next.js 15 + React 19 + TypeScript setup
- Firebase Auth + Firestore configuration with deployed security rules
- AuthContext with Google OAuth integration
- Complete TypeScript interfaces for franchise data
- Basic app layout with sign-in/dashboard flow
- **Service Layer** - All 4 core services implemented (UniverseService, ContentService, UserService, RelationshipService)
- **Franchise Dashboard** - Lists user's universes with progress tracking, responsive grid layout, navigation
- **Universe Detail Pages** - Shows universe details, content by type (viewable/organisational), owner permissions
- **Content Detail Pages** - Individual content viewing with progress tracking, breadcrumb navigation
- **Public Discovery** - Browse and search all public franchises with responsive interface
- **User Profiles** - Display public franchises and favourites with tabbed interface
- **Universe Creation Forms** - Complete form for creating new franchises with validation and Firebase integration
- **Content Creation Forms** - Comprehensive forms for adding content with media type selection and permissions
- **Universe Edit Forms** - Complete edit functionality for updating franchise details with pre-populated data
- **Content Edit Forms** - Full content editing with media type selection and automatic viewable detection
- **Delete Operations** - Universe and content deletion with confirmation modals and proper error handling

**Next Implementation Phases (see todo.md):**
3. **Phase 3c-3d: Data Management** - Individual user progress, hierarchies, visibility, favourites
4. **Phase 4a-4b: UI Components** - Component library with design system, navigation, responsive design
5. **Phase 5a-5d: Testing, Optimisation & Deployment** - Tests, code cleanup, production setup, flow optimisation
6. **Phase 6a: Advanced Content Hierarchies** - Infinite nesting, recursive trees, drag-and-drop organisation

## Data Model

The system uses a hierarchical franchise organisation model:

### Core Entities
- **Universe**: Top-level franchise container (e.g., "Marvel Cinematic Universe")
- **Content**: Episodes, movies, characters, locations within a franchise
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

// Franchise elements (episodes, characters, etc.)
interface Content {
  id: string;
  name: string;
  universeId: string;
  isViewable: boolean;          // true for episodes/movies, false for characters
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
- **ONLY viewable content** (episodes, movies, books) can be directly marked as watched
- **Individual per user**: Same public content can have different progress for each user (100% for User A, 0% for User B)
- **Organisational holders** (series, phases) show calculated progress based on contained viewable content
- Progress propagates up hierarchies: viewable content → organisational holders → franchise progress
- **Current limitation**: Progress is shared across users (needs individual tracking implementation)

### British English
- Use British English spelling throughout (organisation, cataloguing, favourites, optimise)
- This applies to UI text, comments, and documentation

## Franchise Content Rules

### Allowed Content
- REAL existing franchises only (Marvel, Doctor Who, Star Wars, DC, LOTR, etc.)
- Established movies, TV shows, books, characters from actual franchises
- Official franchise hierarchies and relationships

### Forbidden Content
- **NEVER** allow creation of original fictional content
- **NEVER** provide tools for creating new characters, stories, or fictional elements
- Users can only catalogue and organise existing, established franchise properties

## Service Layer (Phase 1 Complete)

All services are implemented in `src/lib/services/` and exported via index:

```typescript
import { universeService, contentService, userService, relationshipService } from '@/lib/services';

// Example usage:
const universes = await universeService.getUserUniverses(userId);
const content = await contentService.getByUniverse(universeId);
await userService.addToFavourites(userId, universeId, 'universe');
const hierarchy = await relationshipService.buildHierarchyTree(universeId);
```

**Service Capabilities:**
- **UniverseService**: Full CRUD, public/private, progress tracking, search
- **ContentService**: Episodes/characters, viewable/organisational distinction, progress updates
- **UserService**: Profile management, favourites system, activity tracking
- **RelationshipService**: Hierarchical organisation, tree building, path navigation

## Firebase Security

- User documents: Users can read/write own documents only
- Universe documents: Public read for isPublic=true, owner read/write for own
- Content documents: Inherit universe visibility rules
- All operations require proper authentication

## Next Steps

Refer to todo.md for the current implementation roadmap. Each phase is designed as manageable tasks for iterative development. The LOVABLE_MVP_SPEC.md contains the complete technical specification for the rebuild.