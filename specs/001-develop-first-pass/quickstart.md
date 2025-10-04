# Phase 1: Quickstart

## How to Run the Portfolio Locally

1. Install Node.js (v20+ recommended).
2. Clone the repository and checkout the `001-develop-first-pass` branch.
3. Run `npm install` to install Express.js and dev dependencies.
4. The backend uses ES Modules ("type": "module" in package.json); all server code uses `import ... from ...` syntax.
5. Start the server with `npm run dev` (uses nodemon for live reload) or `node server.js`.
6. Open `http://localhost:3000` in your browser.

## What to Expect
- The homepage loads in a single round trip under 14kb (gzipped).
- You will see Tim Radtke's name, professional links, Projects, Current Learning, About Me (with sidebar), and Contact sections.
- All navigation and content are accessible with or without JavaScript enabled.
- All CSS is in separate files; no inline styles are used.
- The site is fully accessible (WCAG 2.1 AA), keyboard navigable, and screen reader friendly.
- All static assets are stored in the /static/ directory.

## Updating Content
- To update Projects, Learning, About Me, or Contact, edit the static JS data in `public/js/` (e.g., `projects.js`, `learningItems.js`, `portfolioOwner.js`, `contactMethods.js`).
- To update page layout or structure, edit the corresponding HTML files in `public/pages/`.
- To update styles, edit the CSS files in `public/pages/` or `public/global.css`.
- To update static assets, add files to `/static/`.
- To update the resume, replace `resume.pdf` in the project root.

## Testing & Validation
- Manual test plan: see `specs/001-develop-first-pass/tests/manual-test-plan.md`
- Automated tests: see `specs/001-develop-first-pass/tests/`
