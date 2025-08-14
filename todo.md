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

**Phase 4a: Design System Foundation** ✅ COMPLETE
    ☒ ✅ Create Navigation component with breadcrumb variants and source context support
    ☒ ✅ Form Actions Pattern (5 files) - Cancel Link + Submit button pairs with consistent styling + Storybook stories
    ☒ ✅ Page Headers with Action Buttons - Title + description + action button patterns
    ☒ ✅ Simplify Navigation to consistent "logo | nav buttons | sign out" pattern across all pages
    ☒ ✅ Move breadcrumbs from Navigation to PageHeader for better hierarchy display
    ☒ ✅ Remove hover effects from PageHeader breadcrumbs and actions
    ☒ ✅ Design system token implementation with CSS custom properties
    ☒ ✅ Delete Confirmation Modals - Same modal structure with Cancel/Delete button pairs
    ☒ ✅ Empty State with CTA - Message + call-to-action button pattern
    ☒ ✅ Clean up unnecessary Storybook variants and stories across all components
    ☒ ✅ Replace hardcoded buttons with Button component throughout codebase (LAST)
    ☒ ✅ Consolidate duplicate UI patterns and Create reusable UI components but use already hardcoded elements as base. Make sure logic stays. Do one by one and let me check.
    ☒ ✅ Created LoadingSpinner component (appears in all 10 files)
    ☒ ✅ Created ErrorMessage component for form errors (5 files)
    ☒ ✅ Created FormInput/FormLabel/FormTextarea components (5 form files)
    ☒ ✅ Created PageContainer component (13 instances across 10 files)
    ☒ ✅ Created Badge component for public/private and Your Universe labels
    ☒ ✅ Created ViewToggle component with rounded toggle buttons in gray container
    ☒ ✅ Replaced universe page grid/tree toggle with ViewToggle component  
    ☒ ✅ Replaced profile page tab navigation with ViewToggle component
    ☒ ✅ Created SearchBar component with PageHeader integration
    ☒ ✅ Added search functionality to dashboard and discover pages
    ☒ ✅ Created CardGrid component with content sorting support (4 files)
    ☒ ✅ Enhanced CardGrid with automatic viewable/organisational content sorting
    ☒ ✅ Audited and updated all Storybook stories to reflect current project state and realistic use cases
    ☒ ✅ Added hyphenated component class names as first class for all components
    ☒ ✅ Ensure consistent loading and error states
    ☒ ✅  Establish design token for every file

**Phase 4b: Core Pages Design Consistency** 
    ☒ ✅ Apply Navigation component to all 5 CORE PAGES: Dashboard, Universe Detail, Content Detail, Discover, Profile pages
    ☒ ✅ Build franchise navigation components (Navigation component with breadcrumbs)
    ☒ ✅ Create progress tracking components
    ☒ ✅ Standardise navigation across 5 core pages

**Phase 4c: Form Pages Design Consistency**
    ☒ ✅ Apply Navigation component to 5 FORM PAGES: Universe Create, Universe Edit, Content Create, Content Edit, Profile Edit
    ☒ ✅ Add breadcrumb navigation to all form pages
    ☒ ✅ Ensure consistent header/nav patterns across form pages
    ☒ ✅ Standardise form layouts and validation patterns

**Phase 4d: Responsive Design & Polish** ✅ COMPLETE
    ☒ ✅ Fix hamburger menu showing on desktop (Navigation component) - Implemented React-based responsive navigation with useScreenSize hook
    ☒ ✅ Implement responsive design for mobile (all 10 pages) - Mobile hamburger menu with overlay dropdown, proper mobile touch targets
    ☒ ✅ Ensure consistent design across all screen sizes - React-based responsive logic with Tailwind breakpoint integration
    ☒ ✅ Final design consistency review across all pages - Mobile-first design patterns across all components
    ☒ ✅ Complete responsive design system implementation across all pages - useIsMobile hook with screen size detection, responsive Navigation component

**Phase 5a: Code Optimisation & Cleanup** ✅ COMPLETE
    ☒ ✅ SCAN FOR ALL UNUSED BACKEND/CODE/SERVICE/METHODS/HOOKS/Firebase features/collections/deprecated methods AND THEN PUT THEM IN A FILE FOR US TO DECIDE IF WE SHOULD IMPLEMENT OR REMOVE.
    ☒ ✅ Fix critical collection name bug in clear-firestore.js (favorites → favourites)
    ☒ ✅ Remove 3 deprecated service methods (ContentService.updateProgress, getWithProgress; UniverseService.updateProgress)
    ☒ ✅ Fix missing relationship cleanup in content deletion
    ☒ ✅ Remove 2 unused TypeScript interfaces (FranchiseContextType, UpdateContentProgressData)
    ☒ ✅ Remove 2 unused UserService methods (getRecentFavourites, bulkUpdateFavourites)
    ☒ ✅ Implement ContentService.search() for universe content search functionality
    ☒ ✅ Remove ContentService.getRecentlyAccessed() - unused method removed
    ☒ ✅ Remove UniverseService.searchPublic() - unused method removed
    ☒ ✅ Implement UserService.clearAllFavourites() on profile view page with confirmation modal
    ☒ ✅ Implement comprehensive accessibility checking with @axe-core/react, ESLint jsx-a11y rules, and custom contrast validation
    ☒ ✅ Fix ErrorMessage component contrast issue (4.41:1 → 5.91:1 WCAG AA compliant) 
    ☒ ✅ Enhance ViewToggle component with blue background and white text for active states
    ☒ ✅ Add design system tokens for accessible error text styling (--color-text-error-on-light)
    ☒ ✅ Find any TODO comments or anything else unfinished
    ☒ ✅ Remove unused files and directories
    ☒ ✅ Clean up redundant code and components
    ☒ ✅ Optimise imports and dependencies
    ☒ ✅ Review and improve code organisation, and update component organisation for Storybook to match new folder organisation.
    ☒ ✅ Performance optimization: Bundle size maintained at 99.5 kB, dynamic imports for Fuse.js and @axe-core/react, image optimization with WebP/AVIF, security headers, and comprehensive caching strategies

**Phase 5b: Deployment** ✅ COMPLETE
    ☒ ✅ Set up Vercel deployment with optimized build configuration and regions (lhr1)
    ☒ ✅ Configure Firebase environment variables for production deployment
    ☒ ✅ Deploy to production with performance monitoring and analysis tools
    ☒ ✅ Professional 3-environment pipeline: Created canoncore-development, canoncore-staging, canoncore-production-929c5 with complete data isolation, git branch-based deployments (develop/staging/main), and automated Vercel deployments
    ☐ Configure custom domain and SSL certificates (moved to future enhancement)

**Phase 5c: Flow Optimisation & UX Review**
    ☐ Review and optimise user flows objectively
    ☐ Split content creation: separate viewable vs non-viewable flows
    ☐ Analyse and improve navigation patterns
    ☐ Optimise form flows and reduce friction
    ☐ Review content organisation and discovery patterns
    ☐ Streamline universe-to-content creation workflow
    ☒ ✅ Add grid and tree view toggle for universe pages (already implemented)
    ☐ Add "Universe Context" section to viewable content pages showing all parent hierarchies
    ☐ Add add content button to organisational content pages
    Remove redundant component vairations

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

**Phase 7: Testing** (Final Phase)
    ☐ Test full end-to-end user workflows in production environment

**Phase 8: Scan old project for more ideas***
