# Portfolio First Pass Development: Task List

## Parallel Execution Guidance
- Tasks marked [P] can be executed in parallel.
- Tasks on the same file or with dependencies must be executed sequentially.

---

### Setup Tasks
T001. Initialize project and verify repo structure (public/, static/, server.js, etc.)
T002. Install dependencies: Express.js, nodemon (dev only)
T003. Set up ESLint with size-aware rules
T004. Configure nodemon for live reload in development

### Test Tasks [P]
T005. Write accessibility test for homepage (WCAG 2.1 AA, ARIA, keyboard nav) [P]
T006. Write performance/load test for homepage (<14kb, <2s on 3G) [P]
T007. Write integration test for homepage loading and navigation [P]
T008. Write unit test scaffolds for Portfolio Owner entity [P]
T009. Write unit test scaffolds for Project entity [P]
T010. Write unit test scaffolds for Learning Item entity [P]
T011. Write unit test scaffolds for Navigation Section entity [P]
T012. Write unit test scaffolds for Contact Method entity [P]

### Core Implementation Tasks
T013. Implement Portfolio Owner entity/model (static data in JS/HTML)
T014. Implement Project entity/model (static data in JS/HTML)
T015. Implement Learning Item entity/model (static data in JS/HTML)
T016. Implement Navigation Section entity/model (static data in JS/HTML)
T017. Implement Contact Method entity/model (static data in JS/HTML)
T018. Implement Express.js server with static file serving (server.js)
T019. Implement route handling for all main sections (Home, Projects, About Me, Learning, Contact)
T020. Implement homepage HTML (public/pages/home/home.html)
T021. Implement homepage CSS (public/pages/home/home.css)
T022. Implement homepage JS (public/pages/home/home.js)
T023. Implement Projects page HTML, CSS, and JS [P]
T024. Implement About Me page HTML, CSS, and JS [P]
T025. Implement Current Learning page HTML, CSS, and JS [P]
T026. Implement Contact page HTML, CSS, and JS [P]
T027. Implement left sidebar navigation for About Me section
T028. Implement global CSS (public/global.css) for consistent styling
T029. Implement keyboard navigation and ARIA labels for all pages
T030. Implement client-side router (public/router.js) for navigation (JS-enabled)
T031. Implement fallback navigation for JS-disabled browsers

### Polish Tasks [P]
T032. Write manual test plan for device/browser/accessibility validation [P]
T033. Validate all pages for accessibility (WCAG 2.1 AA) and performance [P]
T034. Document update instructions in README.md and quickstart.md [P]

---

**Dependency Notes:**
- Setup tasks (T001-T004) must be completed before any implementation or test tasks.
- Test tasks (T005-T012) can be executed in parallel after setup.
- Core implementation tasks (T013-T031) follow entity and routing dependencies; tasks on different files (T023-T026) can be parallelized.
- Polish tasks (T032-T034) can be parallelized after implementation.

**Task Agent Example:**
- To execute all parallel test tasks: `/task-agent run T005 T006 T007 T008 T009 T010 T011 T012`
- To execute all parallel core tasks: `/task-agent run T023 T024 T025 T026`
- To execute all polish tasks: `/task-agent run T032 T033 T034`
