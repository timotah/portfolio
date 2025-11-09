# Research Summary: Client-Server Routing for Portfolio

## Key Findings
- Vanilla JS router is best for minimal asset size and full control.
- Express.js backend is optimal for static HTML fallback.
- ARIA live region is recommended for SPA accessibility.
- No external frontend dependencies needed.
- Performance goals (<2s load, <14KB assets) are easily met with current structure.

## Decisions
- Use data-route attribute for SPA navigation links.
- Use pushState/popstate for browser history.
- Fallback to server routing if JS is disabled.
- Add aria-live to main content for screen reader support.

## Alternatives Considered
- React Router, Vue Router: Too heavy for portfolio, not needed.
- Hash-based routing: Less clean URLs, not preferred.

## Rationale
- Simplicity, accessibility, and performance are prioritized.
