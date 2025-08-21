# CanonCore Context7 Improvement Phases

This document provides systematic Claude Code phrases to leverage Context7 MCP for comprehensive project improvement across all development phases.

## Phase 1: Dependency Audit & Modernization

### 1.1 Next.js 15 App Router Optimization
```
Audit the current routing structure in /app directory for Next.js 15 App Router best practices. use context7 for latest routing patterns and identify any deprecated approaches.
```

```
Review the layout.tsx and page.tsx files for Next.js 15 SSR/SSG optimization opportunities. use context7 for server component patterns and performance improvements.
```

```
Analyze the current metadata implementation and suggest improvements using Next.js 15 metadata API. use context7 for SEO optimization patterns.
```

### 1.2 React 19 Feature Integration
```
Review the AuthContext implementation for React 19 compatibility and concurrent features. use context7 for latest React context patterns and state management.
```

```
Audit all custom hooks (usePageTitle, useScreenSize, useSearch) for React 19 best practices. use context7 for modern hook patterns and performance optimization.
```

```
Examine the component props and state management for React 19 server/client component optimization. use context7 for component architecture patterns.
```

### 1.3 Firebase v9+ Modernization
```
Review all Firebase service layer implementations for v9+ modular SDK best practices. use context7 for latest Firebase patterns and error handling.
```

```
Audit the Firestore security rules and query patterns for performance optimization. use context7 for Firebase security and query optimization.
```

```
Examine the authentication flow for Firebase Auth v9+ best practices and error handling. use context7 for modern authentication patterns.
```

## Phase 2: Component System Enhancement

### 2.1 Design System Optimization
```
Review the component barrel exports in /components/index.ts for tree-shaking optimization. use context7 for modern JavaScript bundling patterns.
```

```
Audit the Tailwind CSS v4 usage across components for performance and maintainability. use context7 for Tailwind v4 best practices and optimization.
```

```
Examine the Storybook configuration and stories for accessibility testing integration. use context7 for Storybook accessibility patterns.
```

### 2.2 Form Component Modernization
```
Review the form components (FormInput, FormLabel, etc.) for React 19 form handling patterns. use context7 for modern form validation and accessibility.
```

```
Audit the FormActions component for server actions integration with Next.js 15. use context7 for server action patterns and error handling.
```

### 2.3 Interactive Component Enhancement
```
Examine the SearchBar component for performance optimization with debouncing and search patterns. use context7 for search UX patterns and performance.
```

```
Review the responsive navigation implementation for modern mobile-first patterns. use context7 for responsive navigation best practices.
```

## Phase 3: Performance & Accessibility

### 3.1 Bundle Optimization
```
Analyze the current bundle size and implement code splitting strategies. use context7 for Next.js 15 bundle optimization and dynamic imports.
```

```
Review the dependency usage for tree-shaking opportunities and bundle reduction. use context7 for JavaScript bundle optimization patterns.
```

### 3.2 Accessibility Enhancement
```
Audit all components for WCAG AA compliance using modern accessibility patterns. use context7 for accessibility testing and implementation guidelines.
```

```
Review the keyboard navigation and screen reader compatibility across the application. use context7 for accessibility navigation patterns.
```

### 3.3 SEO & Metadata Optimization
```
Examine the metadata implementation for search engine optimization. use context7 for Next.js 15 metadata API and SEO best practices.
```

```
Review the Open Graph and Twitter Card implementations for social media optimization. use context7 for social media metadata patterns.
```

## Phase 4: Testing & Quality Assurance

### 4.1 Testing Strategy Enhancement
```
Review the current MCP-first testing approach and suggest improvements for comprehensive coverage. use context7 for modern testing patterns and strategies.
```

```
Examine the Playwright testing patterns for accessibility and performance testing. use context7 for Playwright best practices and automation.
```

### 4.2 Error Handling & Monitoring
```
Audit the error handling patterns across services and components. use context7 for modern error handling and user experience patterns.
```

```
Review the logging and monitoring implementation for production readiness. use context7 for application monitoring and observability patterns.
```

## Phase 5: Security & Data Management

### 5.1 Firebase Security Review
```
Examine the Firestore security rules for comprehensive data protection. use context7 for Firebase security patterns and rule optimization.
```

```
Review the authentication flow for security vulnerabilities and session management. use context7 for secure authentication patterns and session handling.
```

### 5.2 Data Privacy & Compliance
```
Audit the user data handling for privacy compliance and data protection. use context7 for data privacy patterns and GDPR compliance.
```

## Phase 6: Deployment & DevOps

### 6.1 Build Process Optimization
```
Review the build configuration and deployment pipeline for efficiency. use context7 for Next.js build optimization and deployment patterns.
```

```
Examine the environment configuration and secrets management. use context7 for secure environment variable patterns and deployment security.
```

### 6.2 Production Monitoring
```
Review the production monitoring and analytics implementation. use context7 for web analytics and performance monitoring patterns.
```

```
Audit the error tracking and user feedback systems for production readiness. use context7 for error tracking and user experience monitoring.
```

## Phase 7: Advanced Features & Innovation

### 7.1 Progressive Web App Features
```
Examine the potential for PWA implementation with offline capabilities. use context7 for Progressive Web App patterns and service worker implementation.
```

### 7.2 Performance Optimization
```
Review the Core Web Vitals and implement performance improvements. use context7 for web performance optimization and measurement patterns.
```

```
Examine the image optimization and lazy loading implementation. use context7 for modern image optimization patterns and performance.
```

### 7.3 Advanced UI Patterns
```
Review the component system for advanced interaction patterns and micro-animations. use context7 for modern UI patterns and animation libraries.
```

## Phase 8: Documentation & Maintenance

### 8.1 Code Documentation
```
Review the code documentation and type definitions for maintainability. use context7 for TypeScript documentation patterns and JSDoc best practices.
```

### 8.2 Developer Experience
```
Examine the development workflow and tooling for efficiency improvements. use context7 for modern development tooling and workflow optimization.
```

```
Review the linting and formatting configuration for code quality. use context7 for ESLint and Prettier configuration patterns.
```

## Phase 9: Future-Proofing

### 9.1 Technology Roadmap
```
Research emerging patterns and technologies relevant to the CanonCore stack. use context7 for future technology trends and migration planning.
```

### 9.2 Scalability Planning
```
Examine the current architecture for scalability and performance at scale. use context7 for scalable architecture patterns and optimization strategies.
```

## Implementation Strategy

### Daily Development Integration
- Include Context7 phrases in every development session
- Use specific library IDs when available (e.g., `/vercel/next.js/v15.0.0`)
- Focus on one phase per development session for systematic improvement

### Quality Gates
- Complete MCP testing after each phase
- Document improvements and lessons learned
- Update CLAUDE.md with new patterns discovered

### Continuous Improvement
- Regularly audit dependencies for updates
- Monitor performance metrics after each phase
- Maintain accessibility and security standards throughout

## Usage Notes

1. **Specific Library Targeting**: Replace general library names with Context7-compatible IDs when known
2. **Topic Focusing**: Add specific topics (e.g., "routing", "hooks", "security") to narrow documentation scope
3. **Version Awareness**: Always specify version numbers when requesting documentation
4. **Iterative Approach**: Complete one section before moving to the next for manageable improvements
5. **Testing Integration**: Combine Context7 insights with MCP-first testing for validation

## Quick Reference Commands

```bash
# Development with Context7 insights
npm run dev

# Testing with MCP after Context7 improvements
# (MCP server runs globally)

# Quality assurance after improvements
npm run lint
npm run type-check
npm run build

# Version management after phase completion
npm run version:patch  # For incremental improvements
npm run version:minor  # For phase completions
```

This systematic approach ensures comprehensive project improvement using Context7's up-to-date documentation while maintaining CanonCore's professional development standards.