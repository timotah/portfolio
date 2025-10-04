# Phase 0: Outline & Research

## Unknowns from Technical Context
- No major unknowns; all requirements and constraints are explicit in the spec and user input.

## Best Practices
- Use semantic HTML5 elements for all content.
- All CSS in separate files, using classes and proper specificity (e.g., .section .sidebar).
- ARIA labels for all interactive elements and navigation.
- Keyboard navigation: all links, buttons, and form fields must be accessible via Tab/Shift+Tab and Enter/Space.
- No inline styles or web animations.
- Minimize JS on pageload; support full navigation and content with JS disabled.
- Optimize all assets to keep total gzipped size under 14kb.
- Test with screen readers and on mobile/desktop browsers.

## Decisions
- Express.js will serve all static files and handle routing for /, /projects, /aboutme (includes contact), and fallback to index.html for SPA navigation.
- All static assets (HTML, CSS, JS, images, fonts) are stored in /static/.
- Each main section will have its own HTML and CSS file for clarity and maintainability.
- No client-side frameworks or libraries will be used.
- Nodemon or native tooling will be used for live reload during development.

## Alternatives Considered
- Using a frontend framework (React, Vue, etc.): Rejected due to size and dependency constraints.
- Single HTML file with dynamic JS rendering: Rejected to maximize accessibility and minimize JS on pageload.
- Inline styles: Rejected for maintainability and constitutional compliance.

## Rationale
- This approach maximizes performance, accessibility, and maintainability while strictly adhering to the 14kb size budget and all constitutional principles.
