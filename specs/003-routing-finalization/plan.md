
# Implementation Plan: Routing Finalization

**Branch**: `003-routing-finalization` | **Date**: October 11, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-routing-finalization/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Complete SPA routing with file-based route discovery and component caching. Implement BaseComponent lifecycle methods (destroy/activate) for proper event listener management. Create HTML fragment injection with CSS loading. Maintain server-side fallback for accessibility and SEO.

## Technical Context
**Language/Version**: JavaScript ES6+, Node.js (Express backend), Vite build tool  
**Primary Dependencies**: Express.js, Vite (dev), no additional runtime libraries  
**Storage**: File-based routing via folder structure, in-memory component cache  
**Testing**: Manual testing, browser compatibility testing  
**Target Platform**: Modern browsers with progressive enhancement for legacy/no-JS  
**Project Type**: web - frontend SPA with backend fallback  
**Performance Goals**: <2s page load on 3G, <100ms JS execution, instant SPA navigation  
**Constraints**: 14kb total bundle size limit, WCAG 2.1 AA compliance, no external libraries  
**Scale/Scope**: Portfolio site with 5 main routes, component caching for performance

**Implementation Details from User**: 
- SPA routing attempts first via Vite-style file path based routes
- File-based path routing implementation in router.js
- Component cache for already instantiated components
- BaseComponent class needs destroy() and activate() methods for event listener management
- HTML fragment injection into main content area
- Component .js activation and .css style loading on route change
- Server-side fallback serves files statically based on folder path names

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Size Budget Compliance**: ✅ No external libraries added, component caching optimizes existing code  
**Quality Code**: ✅ BaseComponent lifecycle methods improve maintainability  
**Minimal Dependencies**: ✅ Uses existing Vite and Express, no new dependencies  
**Web Accessibility**: ✅ Server-side fallback ensures WCAG compliance without JS  
**Performance First**: ✅ Component caching improves navigation speed, file-based routing reduces overhead  

**Potential Concerns**:
- Component cache may increase memory usage - mitigated by destroy() lifecycle method
- File-based routing complexity - justified by Vite convention alignment and maintainability

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── js/
│   ├── BaseComponent.js     # Enhanced with destroy/activate methods
│   ├── router.js           # File-based routing with component cache
│   └── routes.js           # May be eliminated in favor of file discovery
├── pages/
│   ├── home/
│   │   ├── home.html       # HTML fragments for injection
│   │   ├── home.js         # Component with lifecycle methods
│   │   └── home.css        # Dynamically loaded styles
│   ├── aboutme/
│   ├── projects/
│   ├── learning/
│   └── contact/
└── index.html              # SPA shell with router outlet

static/                     # Static assets (resume.pdf, etc.)
server.js                  # Express server with fallback routing
dist/                      # Vite build output
```

**Structure Decision**: Web application structure with enhanced SPA routing. Existing src/pages/ 
structure aligns perfectly with file-based routing requirements. BaseComponent and router.js 
require enhancements for lifecycle management and caching.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh opencode`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [ ] Phase 0: Research complete (/plan command)
- [ ] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
