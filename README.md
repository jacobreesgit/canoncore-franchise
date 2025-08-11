# CanonCore

A franchise organisation platform for cataloguing REAL existing fictional franchises (Marvel, Doctor Who, Star Wars, etc.). This is a ground-up rebuild of an existing project, focusing on core franchise organisation features.

## Current Status

**Phase 3c + Phase 6a Complete** - Core functionality implemented with advanced hierarchical content organisation and polished UI.

## Features Implemented

### ✅ Core Platform
- **Authentication**: Google OAuth via Firebase Auth
- **Database**: Firestore with deployed security rules
- **Service Layer**: Complete with 5 core services (Universe, Content, User, Relationship, UserProgress)

### ✅ User Interface
- **Franchise Dashboard**: Lists user's universes with progress tracking
- **Universe Detail Pages**: Grid/tree view toggle, hierarchical navigation with consistent ordering
- **Content Detail Pages**: Individual content viewing with progress tracking
- **Public Discovery**: Browse and search all public franchises
- **User Profiles**: Display public franchises (favourites pending Phase 3d)

### ✅ Data Management
- **Create/Edit/Delete**: Full CRUD operations for universes and content
- **Individual User Progress**: Per-user progress tracking - same public content shows different progress per user
- **Advanced Hierarchies**: Infinite depth parent-child relationships with recursive tree building

### ✅ Content Organisation
- **Viewable Content**: Movies, episodes, books with progress tracking (0-100%) - green progress indicators
- **Organisational Content**: Characters, locations, items with calculated progress from viewable children - blue progress indicators
- **Hierarchical Structure**: Unlimited nesting with consistent ordering by creation time across grid and tree views
- **Smart Progress Display**: Progress bars only shown for organisational content that has viewable children

## Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase (Auth + Firestore)
- **Authentication**: Google OAuth

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
```

## Project Structure

- **Documentation**: See `CLAUDE.md`, `ARCHITECTURE.md`, and `todo.md`
- **Core Services**: `src/lib/services/` - Complete service layer
- **Pages**: `src/app/` - Next.js App Router pages
- **Types**: `src/lib/types.ts` - Complete TypeScript interfaces

## Next Implementation Phases

- **Phase 3d**: Favourites system and visibility controls
- **Phase 4a-4b**: Component library and responsive design
- **Phase 5a-5d**: Testing, optimisation, and deployment
- **Phase 6a** (remaining): Drag-and-drop, circular reference detection, breadcrumbs (core hierarchical functionality complete)

## Key Constraints

- **REAL franchises only**: Marvel, Doctor Who, Star Wars, etc.
- **No original content creation**: Only catalogue existing franchise properties
- **British English**: Used throughout UI and documentation

---

**Last Updated**: Phase 3c + Phase 6a Complete