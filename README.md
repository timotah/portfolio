# Tim Radtke Portfolio

A static, accessible, and performant portfolio site built with vanilla HTML, JS, and CSS. Express.js serves static files. No frontend dependencies.

## Quickstart
- Clone repo
- Run `npm install`
- Start dev server: `npm run dev` (uses nodemon)
- Access site at [http://localhost:3000](http://localhost:3000)

## Updating Content
- Edit static data in `public/js/` (e.g., `portfolioOwner.js`, `projects.js`, etc.)
- Update page HTML/CSS/JS in `public/pages/[section]/`
- Add static assets to `/static/`
- Update resume PDF in project root

## Testing
- Manual test plan: `specs/001-develop-first-pass/tests/manual-test-plan.md`
- Automated tests: see `specs/001-develop-first-pass/tests/`

## Accessibility & Performance
- All pages meet WCAG 2.1 AA
- Homepage loads <14kb, <2s on 3G
- Keyboard navigation and ARIA labels throughout

## Deployment
- Deploy as a static site or run with Node/Express
