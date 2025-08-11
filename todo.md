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
    ☒ ✅ Create UserProgressService for individual
      user progress tracking

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
    ☒ ✅ Build content edit form (/universes/[id]/content/[contentId]/edit)
    ☒ ✅ Add universe delete functionality with confirmation
    ☒ ✅ Add content delete functionality with confirmation

**Phase 3c: Data Management - Progress & Hierarchies** ✅ COMPLETE
    ☒ ✅ Create hierarchical content organisation
      (Phase 1 > Iron Man > Tony Stark)
    ☒ ✅ Implement progress tracking for viewable
      content only
    ☒ ✅ Make progress tracking individual per user 
      (same public content can be 100% for one user, 0% for another)
    ☒ ✅ Build calculated progress for
      organisational holders

**Phase 3d: Data Management - Visibility & Favourites** ✅ COMPLETE
    ☒ ✅ Create public/private franchise visibility
      system (implemented with isPublic field)
    ☒ ✅ Build favourites system for franchises and
      content
    ☒ ✅ Re-enable favourites functionality in profile page
      (fully implemented with UI components)

**Phase 4a: Design System Foundation**
    ☐ Establish design system (colours, typography, spacing)
    ☐ Consolidate duplicate UI patterns and Create reusable UI components but use already hardcoded elements as base. Make sure logic stays. Do one by one and let me check.
    ☐ Ensure consistent loading and error states

**Phase 4b: Core Pages Design Consistency** 
    ☐ Apply consistent design to 5 CORE PAGES: Dashboard, Universe Detail, Content Detail, Discover, Profile pages
    ☐ Build franchise navigation components  
    ☐ Create progress tracking components
    ☐ Standardise navigation across 5 core pages

**Phase 4c: Form Pages Design Consistency**
    ☐ Apply consistent design to 5 FORM PAGES: Universe Create, Universe Edit, Content Create, Content Edit, Profile Edit
    ☐ Add breadcrumb navigation to all form pages
    ☐ Ensure consistent header/nav patterns across form pages
    ☐ Standardise form layouts and validation patterns

**Phase 4d: Responsive Design & Polish**
    ☐ Implement responsive design for mobile (all 10 pages)
    ☐ Ensure consistent design across all screen sizes
    ☐ Final design consistency review across all pages

**Phase 5a: Testing**
    ☐ Add service layer unit tests
    ☐ Create component integration tests
    ☐ Test Firestore security rules

**Phase 5b: Code Optimisation & Cleanup**
     ☐ Find any to do comments or anything else unfinshed


 BEFORE ANYTHING ELSE - SCAN FOR ALL UNUSED BACKEND/CODE/SERVICE/METHODS/HOOKS/Firebase features/collections AND THEN PUT THEM IN A FILE FOR US TO DECIDE IF WE SHOULD IMPLEMENT OR REMOVE.

    ☐ Remove unused files and directories
    ☐ Clean up redundant code and components
    ☐ Optimise imports and dependencies
    ☐ Review and improve code organisation
    ☐ Optimise bundle size and performance

**Phase 5c: Deployment**
    ☐ Set up development and production environment using Vercel
    ☐ Configure Firebase hosting
    ☐ Test full end-to-end user workflows

**Phase 5d: Flow Optimisation & UX Review**
    ☐ Review and optimise user flows objectively
    ☐ Split content creation: separate viewable vs non-viewable flows
    ☐ Analyse and improve navigation patterns
    ☐ Optimise form flows and reduce friction
    ☐ Review content organisation and discovery patterns
    ☐ Streamline universe-to-content creation workflow
    ☒ ✅ Add grid and tree view toggle for universe pages (already implemented)
    ☐ Add "Universe Context" section to viewable content pages showing all parent hierarchies
    ☐ Add add content button to organisational content pages

**Phase 6a: Advanced Content Hierarchies - Infinite Nesting** ✅ COMPLETE
    ☒ ✅ Implement infinite looping nested children support
    ☒ ✅ Build recursive content tree components  
    ☒ ✅ Add parent-child relationship management in content forms
    ☒ ✅ Fix duplicate tree rendering bugs and hierarchy issues
    ☒ ✅ Implement consistent ordering across grid/tree views
    ☒ ✅ Add smart progress display logic for organisational content
    ☒ ✅ Create consistent progress color scheme (green/blue)
    ☒ ✅ Build enhanced data scanning and validation tools
    ☐ Create drag-and-drop content organisation interface
    ☐ Build nested content navigation and breadcrumbs  
    ☐ Add bulk operations for nested content structures
    ☐ Optimise performance for deep content hierarchies

**Phase 6b: Scan old project for more ideas***