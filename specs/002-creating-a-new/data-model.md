# Phase 1: Data Model

## Entities

### NavigationSection
- route: string (e.g., '/', '/projects', '/aboutme', '/learning', '/contact')
- label: string (display name)
- content: HTML (section content)
- subroutes: array of NavigationSection (optional)

### User
- deviceCapabilities: { jsEnabled: boolean, screenReader: boolean, keyboard: boolean }
- navigationHistory: array of route strings

## Relationships
- User interacts with NavigationSection via navigation links
- NavigationSection may have subroutes (for dynamic or nested content)

## Validation Rules
- All NavigationSection routes must be unique
- All navigation links must be accessible and functional with or without JS
- Content must be available for each route both client-side and server-side
- ARIA live region added to main content for screen reader support
- JS bundle size validated (<5KB for router.js)
