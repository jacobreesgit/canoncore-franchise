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

**Phase 5c: UX Review & Form Component System** ✅ COMPLETE
    ☒ ✅ Review and analyze current user flows across all pages
    ☒ ✅ Split content creation into separate viewable vs organisational flows (/content/add-viewable and /content/organise)
    ☒ ✅ Optimize navigation patterns and breadcrumb consistency
    ☒ ✅ Streamline form flows and reduce friction points
    ☒ ✅ Review content organization and discovery patterns
    ☒ ✅ Optimize universe-to-content creation workflow with focused flows
    ☒ ✅ Add grid and tree view toggle for universe pages (already implemented)
    ☒ ✅ ButtonLink migration: Fixed 25+ instances where Link components should use ButtonLink for consistent styling
    ☒ ✅ Cursor pointer audit: Added cursor-pointer styling to interactive elements throughout application
    ☒ ✅ Firestore performance: Created comprehensive firestore.indexes.json with 14 composite indexes for optimal query performance
    ☒ ✅ Error handling improvements: Enhanced useSearch hook with comprehensive error handling and safety checks
    ☒ ✅ Terminology updates: "Add Episodes & Movies" → "Add Content Item", "Organise Content" → "Add Organisation Group"
    ☒ ✅ Enhanced empty states with dual action buttons for improved UX
    ☒ ✅ FormSelect component: Created consistent select component matching FormInput/FormTextarea styling
    ☒ ✅ Replace all native select elements with FormSelect component across entire project
    ☒ ✅ Remove redundant examples from media type arrays for cleaner forms
    ☒ ✅ Remove search text and count from PageHeader for minimal design
    ☒ ✅ Fix PageHeader button duplication in empty states
    ☒ ✅ Clean up unused code and variables from search text removal
    ☒ ✅ Microsoft Playwright MCP Integration: Complete setup with @playwright/mcp@latest, configuration files, package scripts, and comprehensive documentation for Phase 7 testing
    ☒ ✅ Advanced Content Display Components: Created ContentSection, Tree, and TreeNode components for hierarchical content organization with tree/grid toggle and search functionality
    ☒ ✅ Enhanced Navigation Components: Added Breadcrumb component and Dropdown component with full Storybook integration and design system consistency
    ☒ ✅ Hierarchy Utilities: Implemented hierarchy.ts utils for tree building, content filtering, and unorganized content detection
    ☒ ✅ Storybook Authentication Fix: Added AuthProvider decorators to content component stories to resolve "useAuth must be used within AuthProvider" errors
    ☒ ✅ Tree Component UX Polish: Removed black borders from parent items in focused variant for cleaner visual hierarchy
    ☒ ✅ Global Design Consistency: Updated globals.css with enhanced design tokens, improved font loading, and consistent component styling
    ☒ ✅ Component Integration: Updated all affected pages (dashboard, discover, profile, universe detail, content detail) to use new content display components
    ☒ ✅ Page Updates & Improvements: Enhanced universe creation, content detail, profile, and discover pages with new component system and improved layouts
    ☒ ✅ Content Card Enhancements: Updated ContentCard and UniverseCard components with improved styling and functionality
    ☒ ✅ Interactive Component Updates: Enhanced Button, FavouriteButton, and ViewToggle components with better UX patterns
    ☒ ✅ Layout Component Refinements: Updated CardGrid, EmptyState, Navigation, and PageHeader components with new design system integration
    ☒ ✅ CLAUDE.md Documentation: Updated project documentation with comprehensive MCP setup, component system details, and development workflow improvements
    ☒ ✅ Smart Parent-Based Routing: Updated content creation forms to redirect to parent content page when parent is selected, improving hierarchical workflow UX
    ☒ ✅ File Cleanup: Removed deprecated files (CardGrid 2.tsx, todo 2.md, content/create route) and added development utility scripts
    ☒ ✅ Universe and content pages become more similar: Added "Universe Context" section to content pages showing hierarchical organization with highlighted current content, and content creation dropdown for organisational content pages

**Phase 6a: Advanced Content Hierarchies - Infinite Nesting** ✅ COMPLETE
    ☒ ✅ Implement infinite looping nested children support
    ☒ ✅ Build recursive content tree components  
    ☒ ✅ Add parent-child relationship management in content forms
    ☒ ✅ Fix duplicate tree rendering bugs and hierarchy issues
    ☒ ✅ Implement consistent ordering across grid/tree views
    ☒ ✅ Add smart progress display logic for organisational content
    ☒ ✅ Create consistent progress color scheme (green/blue)
    ☒ ✅ Build enhanced data scanning and validation tools
    ☒ ✅ Fix tree view to show content when no hierarchies exist (prevent empty state message for first organisational groups)
    ☒ ✅ Remove content type labels from tree nodes for cleaner display  
    ☒ ✅ Fix form field ordering: move content/organisation type fields above description in all creation/edit forms
    ☒ ✅ Remove "⭐ Suggested" indicators from parent selection dropdowns
    ☒ ✅ Fix Firebase permissions for content deletion (resolve "Missing or insufficient permissions" errors)
    ☒ ✅ Clean up duplicate files (removed backup files with " 2" suffix)
    ☒ ✅ Update Firestore security rules for proper user progress deletion when content is deleted
    ☒ ✅ SCAN FOR ALL UNUSED BACKEND/CODE/SERVICE/METHODS/HOOKS/Firebase features/collections/deprecated methods AND THEN PUT THEM IN A FILE FOR US TO DECIDE IF WE SHOULD IMPLEMENT OR REMOVE (analysis completed - minimal unused code found)
    ☒ ✅ Update all documentation with Phase 6a completion status


**Phase 7: Code Cleanup & Optimization**

**Phase 7a: Core Testing Infrastructure**
    ☐ Expand existing Playwright test suite (tests/example.spec.ts) with comprehensive scenarios
    ☐ Configure Microsoft Playwright MCP for AI-assisted test generation and debugging
    ☐ Set up test data management and cleanup procedures
    ☐ Create test environment configurations (dev/staging/production)
    ☐ Implement visual regression testing with screenshot comparisons

**Phase 7b: Authentication & User Management Tests**
    ☐ Test Google OAuth sign-in flow and session persistence
    ☐ Test authentication state management across page refreshes
    ☐ Test sign-out functionality and session cleanup
    ☐ Test protected route redirections for unauthenticated users
    ☐ Test account selection flow with multiple Google accounts

**Phase 7c: Universe Management Testing**
    ☐ Test universe creation with form validation
    ☐ Test universe editing and data persistence
    ☐ Test universe deletion with confirmation modals
    ☐ Test public/private visibility toggles
    ☐ Test universe search functionality
    ☐ Test universe favourites system
    ☐ Test progress calculation aggregation from content

**Phase 7d: Content Management & Hierarchy Testing**
    ☐ Test viewable content creation (movies, episodes, books, audio)
    ☐ Test organisational content creation (characters, locations, collections)
    ☐ Test infinite-depth parent-child relationships and tree building
    ☐ Test content editing and form validation
    ☐ Test content deletion and hierarchy cleanup
    ☐ Test progress tracking for individual users
    ☐ Test calculated progress propagation up hierarchies

**Phase 7e: User Experience & Navigation Testing**
    ☐ Test responsive design across mobile, tablet, and desktop breakpoints
    ☐ Test navigation breadcrumbs and routing consistency
    ☐ Test search functionality across dashboard and discover pages
    ☐ Test grid/tree view toggles on universe pages
    ☐ Test empty states and loading indicators
    ☐ Test error handling and user feedback

**Phase 7f: Performance & Accessibility Testing**
    ☐ Test bundle size optimization and lazy loading
    ☐ Test Lighthouse performance scores (target: 90+ on all metrics)
    ☐ Test accessibility compliance with axe-core automated checks
    ☐ Test keyboard navigation and screen reader compatibility
    ☐ Test color contrast ratios and WCAG AA compliance
    ☐ Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)

**Phase 7g: Data Integrity & Security Testing**
    ☐ Test Firebase security rules enforcement
    ☐ Test user data isolation and privacy boundaries
    ☐ Test multi-user scenarios and data consistency
    ☐ Test favourites system data integrity
    ☐ Test progress tracking accuracy across users
    ☐ Test relationship cleanup on content deletion

**Phase 7h: Integration & End-to-End Workflow Testing**
    ☐ Test complete user journey: Sign in → Create universe → Add content → Track progress
    ☐ Test content discovery flow: Discover → Favourite → View progress
    ☐ Test profile management: View profile → Edit details → Manage favourites
    ☐ Test collaborative scenarios: Public universes → Multiple user progress
    ☐ Test data export/import scenarios (if implemented)

**Phase 7i: Performance & Production Environment Testing**
    ☐ Test deployment pipeline across dev/staging/production environments
    ☐ Test Firebase project isolation and environment separation
    ☐ Test production performance under realistic load
    ☐ Test error monitoring and logging systems
    ☐ Test backup and recovery procedures

**Phase 8: Advanced UI Features**
    ☐ Create drag-and-drop content organisation interface (implement reorderChildren method from RelationshipService)
    ☐ Add bulk operations for nested content structures
    ☐ Optimise performance for deep content hierarchies

**Phase 9: Legacy Project Analysis**
    ☐ Scan old project for more ideas (scabard, variations)
    ☐ Analyze scabard features for potential integration
    ☐ Identify unique features not yet implemented in CanonCore
    ☐ Plan implementation roadmap for scabard-inspired features