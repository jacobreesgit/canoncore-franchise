⏺ MVP Implementation - Optimal Order
  ⎿ ☒ ✅ Set up Next.js 15 + TypeScript +          
      Tailwind v4
    ☒ ✅ Configure Firebase Auth + Firestore
    ☒ ✅ Create authentication context with 
      Google OAuth
    ☒ ✅ Build basic app layout and sign-in flow
    ☒ ✅ Set up TypeScript interfaces for 
      franchise data

**Phase 1: Core Services Foundation** ✅ COMPLETE
    ☒ ✅ Create UniverseService for franchise CRUD
      operations
    ☒ ✅ Create ContentService for
      episodes/movies/characters
    ☒ ✅ Create UserService for favourites and
      profiles
    ☒ ✅ Create RelationshipService for content
      hierarchies

**Phase 2a: Core Pages - Dashboard & Universe** ✅ COMPLETE
    ☒ ✅ Build franchise dashboard (list user's
      universes)
    ☒ ✅ Create universe detail page (Marvel, Doctor
      Who, etc)

**Phase 2b: Core Pages - Content & Discovery** ✅ COMPLETE
    ☒ ✅ Build content detail pages (episodes,
      characters)
    ☒ ✅ Create public discovery page (browse all
      public franchises)
    ☒ ✅ Build user profile pages with favourites

**Phase 3a: Data Management - Forms & Content Creation** ✅ COMPLETE
    ☒ ✅ Implement franchise creation form (Marvel,
      Doctor Who, etc)
    ☒ ✅ Build content creation (add episodes,
      movies, characters)

**Phase 3b: Data Management - Edit & Delete Operations** ✅ COMPLETE
    ☒ ✅ Build universe edit form (/universes/[id]/edit)
    ☒ ✅ Build content edit form (/content/[id]/edit)
    ☒ ✅ Add universe delete functionality with confirmation
    ☒ ✅ Add content delete functionality with confirmation

**Phase 3c: Data Management - Progress & Hierarchies**
    ☐ Create hierarchical content organisation
      (Phase 1 > Iron Man > Tony Stark)
    ☒ ✅ Implement progress tracking for viewable
      content only
    ☐ Make progress tracking individual per user 
      (same public content can be 100% for one user, 0% for another)
    ☐ Build calculated progress for
      organisational holders

**Phase 3d: Data Management - Visibility & Favourites**
    ☐ Create public/private franchise visibility
      system
    ☐ Build favourites system for franchises and
      content

**Phase 4a: UI Components - Component Library**
CHECK WHAT OTHER PAGES TO MAKE CONSISTENT
    ☐ Establish design system (colours, typography, spacing)
    ☐ Create reusable UI components (forms, cards, modals)
    ☐ Standardise button and form styles
    ☐ Apply consistent design to: Dashboard, Universe Detail, Content Detail
    ☐ Ensure consistent loading and error states

**Phase 4b: UI Components - Navigation & Responsive**
    ☐ Build franchise navigation components
    ☐ Create progress tracking components
    ☐ Apply design system to: Discover page, Profile pages
    ☐ Standardise navigation across all 5 core pages
    ☐ Implement responsive design for mobile (all pages)
    ☐ Ensure consistent design across all screen sizes

**Phase 5a: Testing**
    ☐ Add service layer unit tests
    ☐ Create component integration tests
    ☐ Test Firestore security rules

**Phase 5b: Code Optimisation & Cleanup**
    ☐ Remove unused files and directories
    ☐ Clean up redundant code and components
    ☐ Remove unused service methods and hooks
    ☐ Optimise imports and dependencies
    ☐ Consolidate duplicate UI patterns
    ☐ Review and improve code organisation
    ☐ Remove unused Firebase features/collections
    ☐ Optimise bundle size and performance

**Phase 5c: Deployment**
    ☐ Set up production environment
    ☐ Configure Firebase hosting
    ☐ Test full end-to-end user workflows

**Phase 5d: Flow Optimisation & UX Review**
    ☐ Review and optimise user flows objectively
    ☐ Split content creation: separate viewable vs non-viewable flows
    ☐ Analyse and improve navigation patterns
    ☐ Optimise form flows and reduce friction
    ☐ Review content organisation and discovery patterns
    ☐ Streamline universe-to-content creation workflow

**Phase 6a: Advanced Content Hierarchies - Infinite Nesting**
    ☐ Implement infinite looping nested children support
    ☐ Build recursive content tree components
    ☐ Add parent-child relationship management in content forms
    ☐ Create drag-and-drop content organisation interface
    ☐ Implement circular reference detection and prevention
    ☐ Build nested content navigation and breadcrumbs
    ☐ Add bulk operations for nested content structures
    ☐ Optimise performance for deep content hierarchies