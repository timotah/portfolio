# Tasks: Routing Finalization

**Input**: Design documents from `/specs/003-routing-finalization/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/

**Tech Stack**: JavaScript ES6+, Node.js (Express backend), Vite build tool
**Dependencies**: Express.js, Vite (dev), no additional runtime libraries
**Constraints**: 14kb bundle size limit, WCAG 2.1 AA compliance

## Phase 3.1: Setup

## Phase 3.1: Setup
- [ ] T001 Verify current implementation state and document baseline in /home/timotah/src/portfolio/
- [ ] T002 [P] Setup test framework (if not exists) and verify npm test works
- [ ] T003 [P] Configure test directory structure under tests/

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Contract test Router.navigateTo() in tests/contract/test_router_navigate.js  
- [ ] T005 [P] Contract test Router.getCurrentRoute() in tests/contract/test_router_current.js
- [ ] T006 [P] Contract test BaseComponent.activate() in tests/contract/test_component_activate.js
- [ ] T007 [P] Contract test BaseComponent.destroy() in tests/contract/test_component_destroy.js  
- [ ] T008 [P] Contract test Server fallback routes in tests/contract/test_server_fallback.js
- [ ] T009 [P] Integration test SPA navigation in tests/integration/test_spa_navigation.js
- [ ] T010 [P] Integration test component caching in tests/integration/test_component_cache.js
- [ ] T011 [P] Integration test route discovery in tests/integration/test_route_discovery.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T012 [P] Router entity with componentCache Map in src/js/router.js
- [ ] T013 [P] Component entity with lifecycle state in src/js/BaseComponent.js
- [ ] T014 [P] Route discovery service in src/js/router.js
- [ ] T015 Implement Router.navigateTo() method
- [ ] T016 Implement Router.getCurrentRoute() method  
- [ ] T017 Implement BaseComponent.activate() method
- [ ] T018 Implement BaseComponent.deactivate() method
- [ ] T019 Implement BaseComponent.destroy() method
- [ ] T020 Update existing components with lifecycle methods
- [ ] T021 Implement HTML fragment injection
- [ ] T022 Implement dynamic CSS loading
- [ ] T023 Verify server-side fallback configuration in server.js

## Phase 3.4: Integration
- [ ] T024 Connect component cache to navigation flow
- [ ] T025 Integrate lifecycle methods with router navigation
- [ ] T026 Setup error handling and logging
- [ ] T027 Verify progressive enhancement works

## Phase 3.5: Polish
- [ ] T028 [P] Performance validation (<2s load, <100ms navigation)
- [ ] T029 [P] Bundle size validation (<14kb) 
- [ ] T030 [P] Accessibility testing (WCAG 2.1 AA)
- [ ] T031 [P] Cross-browser testing
- [ ] T032 Execute all quickstart scenarios from quickstart.md
- [ ] T033 Update code documentation with JSDoc

## Dependencies
- Tests (T004-T011) before implementation (T012-T023)
- T012-T014 before T015-T023
- T020 depends on T017-T019
- T024-T025 depend on T015-T022
- Implementation before polish (T028-T033)

## Parallel Example
```
# Launch contract tests T004-T008 together:
Task: "Contract test Router.navigateTo() in tests/contract/test_router_navigate.js"
Task: "Contract test BaseComponent.activate() in tests/contract/test_component_activate.js"  
Task: "Contract test Server fallback routes in tests/contract/test_server_fallback.js"
```

## Validation Checklist
- [x] All contracts have corresponding tests (T004-T008)
- [x] All entities have model tasks (T012-T014)
- [x] All tests come before implementation
- [x] Parallel tasks truly independent ([P] marked)
- [x] Each task specifies exact file path
- [x] TDD order maintained (tests fail first)