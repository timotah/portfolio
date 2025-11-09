# Manual Test Plan: Client-Server Routing for Portfolio

## Navigation (Client-Side)
- [x] With JS enabled, clicking navigation links updates content instantly (no full page reload).
- [x] Browser URL updates to match selected section.
- [x] Browser back/forward buttons work as expected.
- [x] Unknown routes show 404 page.

## Navigation (Server-Side Fallback)
- [x] With JS disabled, navigation links load correct static HTML pages.
- [x] All main routes (`/`, `/aboutme`, `/projects`, `/learning`, `/contact`) work.

## Accessibility
- [x] Navigation is keyboard accessible (tab, enter, space).
- [x] ARIA labels are present on nav and main content.
- [x] Screen reader announces content changes (aria-live).

## Performance
- [x] Initial load is fast (<1s typical broadband).
- [x] JS bundle size is minimal (<10KB for router.js).

## Cross-Browser/Device
- [x] Works in Chrome, Firefox, Safari, Edge (latest versions).
- [x] Works on desktop and mobile devices.
