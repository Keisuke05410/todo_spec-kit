# Implementation Plan: Simple Todo List

**Branch**: `001-simple-todo-list` | **Date**: 2026-02-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-simple-todo-list/spec.md`

## Summary

Implement a single-user, browser-based todo list application using vanilla JavaScript, Vite, and localStorage. The application enables users to add tasks, mark them as complete/incomplete, view all tasks, and delete tasks. Data persists across sessions using browser localStorage with a maximum capacity of 100 tasks. This implementation follows a TDD approach with 6 incremental delivery phases aligned with the 4 prioritized user stories.

**Technical Approach**: Vanilla JavaScript (ES2022+) with modular architecture (storage, tasks, ui, utils modules), Vitest for testing, localStorage for persistence, and WCAG 2.2 Level AA accessibility standards.

---

## Technical Context

**Language/Version**: JavaScript ES2022+ (no transpilation)
**Primary Dependencies**: Vite 5.0+ (dev server/bundler), Vitest 1.0+ (testing), Happy-DOM 12.0+ (DOM simulation), vitest-localstorage-mock 0.1+ (localStorage mocking)
**Storage**: localStorage (browser Web Storage API, 5-10MB quota)
**Testing**: Vitest with Happy-DOM environment, TDD workflow (red-green-refactor)
**Target Platform**: Modern browsers (last 2 versions: Chrome 119+, Firefox 120+, Safari 17+, Edge 119+)
**Project Type**: Single-page web application (no backend)
**Performance Goals**:
- Add/toggle/delete operations < 200ms (SC-006)
- Support 100 tasks without degradation (SC-004)
- Initial render < 50ms
- Bundle size < 10KB minified+gzipped

**Constraints**:
- 100 task maximum (storage limit enforcement)
- 500 character task description limit
- Single user, single device (no sync)
- Browser localStorage only (no backend)
- Plain text descriptions (no rich text)

**Scale/Scope**:
- 4 user stories (3×P1, 1×P2)
- 10 functional requirements
- 6 success criteria
- ~600 LOC application code
- ~800 LOC test code
- 4 core modules + 1 entry point

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Specification-First (NON-NEGOTIABLE)

**Status**: PASS

**Evidence**:
- `spec.md` completed before planning phase
- Contains 4 user stories with acceptance scenarios
- 10 functional requirements (FR-001 to FR-010)
- 6 measurable success criteria (SC-001 to SC-006)
- Technology-agnostic (no implementation details in spec)
- Assumptions clearly documented

**Compliance**: Full compliance. Specification written for business stakeholders, not developers.

---

### ✅ II. Test-Driven Development (NON-NEGOTIABLE)

**Status**: PASS

**Evidence**:
- All implementation phases include "write tests first" as first step
- Test files defined in project structure before implementation
- Unit tests (per module) + integration tests (user flows)
- contracts/modules.md includes test cases for each function
- Vitest configured with coverage tracking

**TDD Cycle**:
1. Write test (RED) → 2. Implement minimum code (GREEN) → 3. Refactor

**Test Coverage Target**: 90%+ for business logic (tasks.js, storage.js)

**Compliance**: Full compliance. Tests written before implementation in all phases.

---

### ✅ III. User-Centered Design

**Status**: PASS

**Evidence**:
- 4 user stories prioritized (P1: Add, Complete, View; P2: Delete)
- Each story independently testable
- Each story delivers standalone value (potential MVP at P1)
- Success criteria measurable from user perspective (SC-001 to SC-006)
- Edge cases documented in spec (long descriptions, rapid additions, empty list, 100+ tasks)

**Story Independence**:
- US1 (Add Task): Can ship alone as "capture-only" app
- US2 (Mark Complete): Works independently after US1
- US3 (View All Tasks): Works independently after US1
- US4 (Delete Task): Works independently after US1

**Compliance**: Full compliance. User stories prioritized and independently shippable.

---

### ✅ IV. Incremental Delivery

**Status**: PASS

**Evidence**:
- 6 phases defined: Setup → Foundation → US1 → US2 → US3 → US4 → Polish
- Foundation phase provides shared infrastructure (storage, validation)
- User stories implemented in priority order (P1 stories first)
- Each user story completable independently after Foundation
- Each phase shippable as incremental value

**Phase Breakdown**:
- **Phase 0 (Setup)**: Project structure, dependencies, empty test passes
- **Phase 1 (Foundation)**: Storage layer, validation, UUID generation (blocks all stories)
- **Phase 2 (US1 - Add Task)**: TDD implementation, character counter, validation UI
- **Phase 3 (US2 - Mark Complete)**: TDD implementation, checkbox UI, toggle logic
- **Phase 4 (US3 - View All Tasks)**: TDD implementation, sorting, empty state
- **Phase 5 (US4 - Delete Task)**: TDD implementation, delete button, confirmation
- **Phase 6 (Polish)**: Accessibility audit, error handling, performance verification

**Compliance**: Full compliance. Incremental delivery with independent user stories.

---

### ✅ V. Documentation & Traceability

**Status**: PASS

**Evidence**:
- ✅ `spec.md`: User requirements and acceptance criteria
- ✅ `plan.md`: This document (technical context and strategy)
- ✅ `research.md`: 8 technology decisions with alternatives considered
- ✅ `data-model.md`: Task entity with validation rules and state transitions
- ✅ `contracts/modules.md`: JSDoc interfaces for all 5 modules
- ✅ `quickstart.md`: Developer onboarding guide
- ⬜ `tasks.md`: To be generated by `/speckit.tasks` command
- ⬜ `checklists/`: To be generated by `/speckit.checklist` command (optional)

**Traceability**:
- All functional requirements mapped to data model fields
- All user stories mapped to implementation phases
- All success criteria mapped to verification steps
- All functions traced to user stories in contracts/modules.md

**Compliance**: Full compliance. All required artifacts present or scheduled for generation.

---

### ✅ VI. Simplicity & Pragmatism

**Status**: PASS (with justification)

**Evidence**:
- Vanilla JavaScript chosen over frameworks (React/Vue/Svelte rejected as over-engineering)
- localStorage chosen over IndexedDB (appropriate for 100 task scale)
- Vitest chosen over Jest (simpler ESM support, faster)
- 4-module architecture (minimal separation of concerns)
- No abstractions for hypothetical future needs (no "task factory", no "repository pattern")

**Informed Decisions**:
- Technology stack decisions made with alternatives considered (research.md)
- Max 3 clarification questions per phase (none needed - spec clear)
- Assumptions documented (single user, single device, no sync)

**Pragmatic Choices**:
- UUID v4 via native `crypto.randomUUID()` (no external library)
- Direct DOM manipulation (no virtual DOM)
- Event delegation (performance without framework)

**Complexity Justification**: None needed. No violations of simplicity principle.

**Compliance**: Full compliance. Simplest solution that meets requirements.

---

### ✅ VII. Agent-Assisted Development

**Status**: PASS

**Evidence**:
- `/speckit.plan` command workflow followed (this document)
- Templates guide structured artifact generation
- All outputs machine-readable (Markdown, JSON, JSDoc)
- Agent context file (`agent-claude.md`) will be updated with tech stack
- Constitution principles enforced throughout planning

**Agent Context Update**:
After plan approval, run `.specify/scripts/bash/update-agent-context.sh claude` to update `.specify/memory/agent-claude.md` with:
- Language: Vanilla JavaScript (ES2022+)
- Build Tool: Vite 5.0+
- Testing: Vitest + Happy-DOM
- Storage: localStorage
- Architecture: Modular (storage, tasks, ui, utils)

**Compliance**: Full compliance. Agent-friendly workflow and documentation.

---

### Constitution Check Summary

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Specification-First | ✅ PASS | spec.md complete, technology-agnostic |
| II. Test-Driven Development | ✅ PASS | TDD cycle defined, tests before implementation |
| III. User-Centered Design | ✅ PASS | 4 prioritized stories, independently testable |
| IV. Incremental Delivery | ✅ PASS | 6 phases, stories independent after Foundation |
| V. Documentation & Traceability | ✅ PASS | All artifacts present or scheduled |
| VI. Simplicity & Pragmatism | ✅ PASS | Vanilla JS, localStorage, minimal dependencies |
| VII. Agent-Assisted Development | ✅ PASS | Structured workflow, machine-readable output |

**Overall**: ✅ **PASS** - Ready to proceed to implementation.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-simple-todo-list/
├── spec.md                  # ✅ Feature specification (technology-agnostic)
├── plan.md                  # ✅ This file (technical implementation plan)
├── research.md              # ✅ Technology decisions with rationale
├── data-model.md            # ✅ Task entity schema and validation rules
├── contracts/               # ✅ API contracts directory
│   └── modules.md           # ✅ JSDoc interfaces for all modules
├── quickstart.md            # ✅ Developer setup and TDD workflow guide
└── tasks.md                 # ⬜ To generate via /speckit.tasks command
```

### Source Code (repository root)

```text
todo_spec-kit/
├── index.html               # Entry point with semantic HTML
├── src/                     # Application source code
│   ├── main.js             # App initialization (checks browser, loads tasks)
│   ├── storage.js          # localStorage I/O layer (loadTasks, saveTasks)
│   ├── tasks.js            # Business logic (addTask, toggleTask, deleteTask, getAllTasks)
│   ├── ui.js               # DOM manipulation (renderTasks, showError, setupEventListeners)
│   └── utils.js            # Pure utilities (generateUUID)
├── styles/                  # CSS stylesheets
│   └── main.css            # Application styles (accessibility-focused)
├── tests/                   # Test suites
│   ├── setup.js            # Vitest configuration (localStorage mock)
│   ├── unit/               # Unit tests (module isolation)
│   │   ├── storage.test.js # Tests: loadTasks, saveTasks
│   │   ├── tasks.test.js   # Tests: addTask, toggleTask, deleteTask, getAllTasks
│   │   ├── ui.test.js      # Tests: renderTasks, showError, setupEventListeners
│   │   └── utils.test.js   # Tests: generateUUID
│   └── integration/        # Integration tests (user flows)
│       └── app.test.js     # Tests: Full task lifecycle (add→toggle→delete)
├── vite.config.js          # Vite build and test configuration
├── package.json            # Dependencies and scripts
├── .specify/               # Specify framework files
│   ├── memory/
│   │   └── agent-claude.md # Agent context (tech stack info)
│   └── ...
└── README.md               # Project overview
```

**Structure Decision**: Single project structure selected. This is a frontend-only application with no backend component. All source code lives in `src/` with clear module separation:
- `storage.js`: No dependencies (pure I/O)
- `tasks.js`: Depends on storage.js (business logic)
- `ui.js`: Depends on tasks.js (presentation)
- `utils.js`: No dependencies (pure functions)
- `main.js`: Entry point, imports all modules

This structure supports TDD by allowing each module to be tested in isolation with mocked dependencies.

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: ✅ No violations

This plan has zero complexity violations. All design decisions align with Constitution Principle VI (Simplicity & Pragmatism):
- Vanilla JavaScript (no framework overhead)
- localStorage (appropriate for scale)
- 4 modules (minimal separation)
- No premature abstractions
- No speculative features

---

## Detailed Implementation Phases

### Phase 0: Setup (Blocks all phases)

**Goal**: Initialize project structure, install dependencies, verify environment.

**Tasks**:
1. Initialize npm project (`npm init -y`)
2. Install dependencies:
   - `npm install -D vite vitest happy-dom vitest-localstorage-mock`
3. Create project directories:
   - `mkdir -p src styles tests/unit tests/integration`
4. Create configuration files:
   - `vite.config.js` (Vite + Vitest config)
   - `tests/setup.js` (localStorage mock import)
5. Create `package.json` scripts:
   - `"dev": "vite"`
   - `"build": "vite build"`
   - `"preview": "vite preview"`
   - `"test": "vitest"`
6. Create empty `index.html` (semantic structure)
7. Create empty module files:
   - `src/main.js`, `src/storage.js`, `src/tasks.js`, `src/ui.js`, `src/utils.js`
8. Write basic setup test (`tests/setup.test.js`)
9. Verify: `npm test` passes (1 setup test)

**Definition of Done**:
- ✅ All dependencies installed
- ✅ Project structure created
- ✅ `npm run dev` starts Vite server
- ✅ `npm test` runs 1 passing test

**Estimated LOC**: ~50 (config files, setup test)

---

### Phase 1: Foundation (Blocks all user stories)

**Goal**: Implement shared infrastructure needed by all user stories.

**Sub-Phase 1A: Storage Layer (TDD)**

**Tests First**:
```javascript
// tests/unit/storage.test.js
describe('loadTasks', () => {
  it('returns empty array when no data exists');
  it('parses valid JSON data');
  it('returns empty array on corrupted JSON');
});

describe('saveTasks', () => {
  it('saves empty array');
  it('saves tasks as JSON');
  it('throws error on quota exceeded');
});
```

**Implementation**:
- `src/storage.js`: `loadTasks()`, `saveTasks(tasks)`
- Error handling for QuotaExceededError
- JSON parse error recovery (return empty array)

**Sub-Phase 1B: UUID Utility (TDD)**

**Tests First**:
```javascript
// tests/unit/utils.test.js
describe('generateUUID', () => {
  it('returns UUID v4 format');
  it('generates unique IDs');
});
```

**Implementation**:
- `src/utils.js`: `generateUUID()` (uses `crypto.randomUUID()`)

**Sub-Phase 1C: Task Validation (TDD)**

**Tests First**:
```javascript
// tests/unit/tasks.test.js
describe('isValidDescription', () => {
  it('accepts valid descriptions');
  it('trims whitespace before validating');
  it('rejects empty descriptions');
  it('rejects descriptions over 500 chars');
});
```

**Implementation**:
- `src/tasks.js`: `isValidDescription(description)` function

**Sub-Phase 1D: HTML Skeleton & CSS Structure**

**Implementation**:
- `index.html`: Semantic HTML structure
  ```html
  <main>
    <h1>Todo List</h1>
    <form id="task-form">
      <input id="task-input" type="text" maxlength="500" required>
      <button type="submit">Add Task</button>
    </form>
    <ul id="task-list" role="list"></ul>
  </main>
  ```
- `styles/main.css`: Basic layout, accessibility focus styles, responsive design

**Definition of Done**:
- ✅ All unit tests pass (storage, utils, validation)
- ✅ HTML structure valid and semantic
- ✅ CSS applied, focus styles visible
- ✅ No integration with UI yet (just infrastructure)

**Estimated LOC**: ~200 (storage: 50, utils: 10, validation: 20, HTML: 30, CSS: 90)

---

### Phase 2: User Story 1 - Add Task (P1, MVP)

**Goal**: Enable users to add tasks with validation and persistence.

**Tests First** (TDD):
```javascript
// tests/unit/tasks.test.js
describe('addTask', () => {
  it('creates task with correct fields');
  it('trims description before saving');
  it('persists task to storage');
  it('throws error on invalid description');
  it('throws error when limit reached (100 tasks)');
});

// tests/integration/app.test.js
describe('Add Task Flow', () => {
  it('adds task when form submitted');
  it('displays task in list after adding');
  it('clears input after successful add');
  it('shows error for empty input');
  it('shows error for >500 char input');
});
```

**Implementation**:
1. **Business Logic**:
   - `src/tasks.js`: `addTask(description)` function
   - Validate description (call `isValidDescription`)
   - Check 100 task limit
   - Generate UUID, create task object
   - Persist via `saveTasks()`

2. **UI Layer**:
   - `src/ui.js`: `renderTasks(tasks)` function
     - Clear existing list
     - Create `<li>` for each task
     - Use `textContent` (XSS safe)
   - `src/ui.js`: `showError(message)` function
     - Toast notification with `role="alert"`
     - Auto-remove after 5 seconds
   - `src/ui.js`: `setupEventListeners()` function
     - Form submit handler
     - Prevent default, get input value
     - Call `addTask()`, catch errors, show via `showError()`
     - Re-render tasks on success

3. **UI Enhancements**:
   - Character counter (`500 chars remaining`)
   - Disable submit button when input empty
   - Focus input after successful add

4. **App Initialization**:
   - `src/main.js`: Browser support check, setup listeners, load initial tasks

**Acceptance Criteria (from spec)**:
- ✅ User can enter "Buy groceries" and it appears in list
- ✅ Multiple tasks can be added sequentially
- ✅ Empty tasks rejected with validation message

**Definition of Done**:
- ✅ All tests pass (unit + integration)
- ✅ User can add tasks via form
- ✅ Tasks persist across page refreshes
- ✅ Validation errors displayed to user
- ✅ 100 task limit enforced

**Estimated LOC**: ~250 (tasks.js: 60, ui.js: 120, main.js: 30, tests: 40)

---

### Phase 3: User Story 2 - Mark Complete (P1)

**Goal**: Enable users to toggle task completion status.

**Tests First** (TDD):
```javascript
// tests/unit/tasks.test.js
describe('toggleTask', () => {
  it('toggles incomplete task to complete');
  it('toggles complete task to incomplete');
  it('persists toggle to storage');
  it('throws error if task not found');
  it('does not affect other tasks');
});

// tests/integration/app.test.js
describe('Toggle Task Flow', () => {
  it('marks task as complete when checkbox clicked');
  it('applies strikethrough style to completed tasks');
  it('unmarks task when checkbox clicked again');
});
```

**Implementation**:
1. **Business Logic**:
   - `src/tasks.js`: `toggleTask(taskId)` function
   - Find task by ID
   - Flip `completed` boolean
   - Persist via `saveTasks()`

2. **UI Layer**:
   - Update `renderTasks()` to include checkbox:
     ```html
     <li data-task-id="{task.id}">
       <input type="checkbox" class="task-checkbox" checked="{task.completed}">
       <span class="task-description {task.completed ? 'completed' : ''}">
         {task.description}
       </span>
     </li>
     ```
   - Update `setupEventListeners()` to handle checkbox click:
     - Event delegation on `#task-list`
     - Get task ID from `data-task-id`
     - Call `toggleTask(taskId)`
     - Re-render tasks

3. **CSS Enhancements**:
   - `.task-description.completed { text-decoration: line-through; opacity: 0.6; }`
   - Checkbox styles (larger hit area for accessibility)

**Acceptance Criteria (from spec)**:
- ✅ Task "Buy groceries" visually indicated when marked complete
- ✅ Completed task returns to incomplete when toggled again
- ✅ Only specific task changes state when multiple tasks exist

**Definition of Done**:
- ✅ All tests pass
- ✅ Checkbox interaction works
- ✅ Completed tasks visually differentiated
- ✅ State persists across refreshes
- ✅ Unlimited toggles supported

**Estimated LOC**: ~100 (tasks.js: 30, ui.js: 40, CSS: 20, tests: 10)

---

### Phase 4: User Story 3 - View All Tasks (P1)

**Goal**: Display all tasks with sorting and empty state handling.

**Tests First** (TDD):
```javascript
// tests/unit/tasks.test.js
describe('getAllTasks', () => {
  it('returns empty array when no tasks exist');
  it('returns all tasks');
  it('sorts tasks by createdAt descending');
  it('filters out invalid tasks');
});

// tests/integration/app.test.js
describe('View Tasks Flow', () => {
  it('shows empty state when no tasks exist');
  it('displays all tasks with correct states');
  it('persists tasks across page refreshes');
});
```

**Implementation**:
1. **Business Logic**:
   - `src/tasks.js`: `getAllTasks()` function
   - Load via `loadTasks()`
   - Filter invalid tasks
   - Sort by `createdAt` descending

2. **UI Layer**:
   - `src/ui.js`: `showEmptyState()` function
     - Display "No tasks yet. Add your first task above!"
   - Update `renderTasks()` to call `showEmptyState()` when `tasks.length === 0`
   - Task count indicator (e.g., "3 tasks, 1 completed")

3. **Persistence Verification**:
   - Integration test: Add tasks, reload page, verify tasks still present
   - Manual test: Add tasks, close browser, reopen, verify tasks exist

**Acceptance Criteria (from spec)**:
- ✅ Empty state with guidance when no tasks
- ✅ All tasks displayed with completion status
- ✅ Tasks persist across app reopens

**Definition of Done**:
- ✅ All tests pass
- ✅ Empty state displayed when appropriate
- ✅ Tasks sorted newest first
- ✅ Task count displayed
- ✅ Persistence verified

**Estimated LOC**: ~60 (tasks.js: 20, ui.js: 30, tests: 10)

---

### Phase 5: User Story 4 - Delete Task (P2)

**Goal**: Enable users to remove tasks permanently.

**Tests First** (TDD):
```javascript
// tests/unit/tasks.test.js
describe('deleteTask', () => {
  it('removes task from storage');
  it('throws error if task not found');
  it('does not affect other tasks');
});

// tests/integration/app.test.js
describe('Delete Task Flow', () => {
  it('removes task when delete button clicked');
  it('shows confirmation before deleting'); // Optional
  it('updates UI after deletion');
});
```

**Implementation**:
1. **Business Logic**:
   - `src/tasks.js`: `deleteTask(taskId)` function
   - Find task by ID
   - Remove from array (`splice`)
   - Persist via `saveTasks()`

2. **UI Layer**:
   - Update `renderTasks()` to include delete button:
     ```html
     <button class="task-delete" aria-label="Delete task">🗑️</button>
     ```
   - Update `setupEventListeners()` to handle delete button click:
     - Event delegation on `#task-list`
     - Get task ID from parent `data-task-id`
     - Call `deleteTask(taskId)`
     - Re-render tasks

3. **UI Enhancements** (optional):
   - Confirmation dialog before delete (can be skipped for MVP)
   - Fade-out animation (CSS transition)

**Acceptance Criteria (from spec)**:
- ✅ Task removed from list when deleted
- ✅ Only specific task removed when multiple exist
- ✅ Deletion is permanent (no undo)

**Definition of Done**:
- ✅ All tests pass
- ✅ Delete button interaction works
- ✅ Task removed from storage
- ✅ UI updates after deletion
- ✅ ARIA label for accessibility

**Estimated LOC**: ~80 (tasks.js: 20, ui.js: 40, CSS: 10, tests: 10)

---

### Phase 6: Polish (Cross-cutting improvements)

**Goal**: Accessibility audit, error handling, performance verification, visual polish.

**Sub-Phase 6A: Accessibility Audit**

**Tasks**:
1. Manual keyboard testing:
   - All interactive elements reachable via Tab
   - Form submission via Enter
   - Checkbox toggle via Space
   - Delete button activation via Enter/Space
   - Focus visible (`:focus-visible` styles)
2. Screen reader testing (VoiceOver):
   - Task list announced as "list, X items"
   - Checkbox states announced
   - Dynamic updates announced (aria-live)
3. Automated testing:
   - axe DevTools scan (0 violations)
   - Lighthouse accessibility audit (100% score)
4. ARIA fixes:
   - `role="list"` on `<ul>`
   - `role="listitem"` on `<li>` (if needed)
   - `aria-live="polite"` on task list for dynamic updates
   - `aria-label` on icon-only delete button

**Sub-Phase 6B: Error Handling**

**Tasks**:
1. Add browser support check in `main.js`:
   ```javascript
   if (typeof Storage === 'undefined') {
     alert('Browser not supported. Please use a modern browser.');
     return;
   }
   ```
2. Add global error handler:
   ```javascript
   window.addEventListener('error', (event) => {
     console.error('Unhandled error:', event.error);
     showError('Something went wrong. Please refresh the page.');
   });
   ```
3. Test all error scenarios:
   - Quota exceeded (mock in test)
   - Corrupted localStorage (manually test)
   - Invalid task ID (unit test)

**Sub-Phase 6C: Performance Verification**

**Tasks**:
1. Create 100 test tasks:
   ```javascript
   for (let i = 0; i < 100; i++) {
     addTask(`Test task ${i + 1}`);
   }
   ```
2. Measure operations:
   - Add task: < 10ms ✅
   - Toggle task: < 5ms ✅
   - Delete task: < 10ms ✅
   - Render 100 tasks: < 50ms ✅
3. Verify SC-004: No degradation at 100 tasks
4. Profile with Chrome DevTools Performance tab

**Sub-Phase 6D: Visual Polish**

**Tasks**:
1. CSS transitions:
   - Task list fade-in animation
   - Checkbox scale animation on click
   - Toast slide-in animation
2. Hover states:
   - Delete button color change
   - Task item background highlight
3. Responsive design:
   - Mobile-friendly touch targets (min 44×44px)
   - Flexible layout (flexbox/grid)
4. Color scheme:
   - Ensure 4.5:1 contrast ratio (WCAG AA)
   - Test with color blindness simulator

**Definition of Done**:
- ✅ All accessibility checks pass
- ✅ All error scenarios handled
- ✅ Performance verified at 100 tasks
- ✅ Visual polish applied
- ✅ Manual testing complete

**Estimated LOC**: ~100 (CSS: 50, error handling: 30, performance tests: 20)

---

## Implementation Phases Summary

| Phase | User Story | Priority | LOC | Tests | Blocking |
|-------|------------|----------|-----|-------|----------|
| 0 | Setup | - | 50 | 1 | All phases |
| 1 | Foundation | - | 200 | 15 | All user stories |
| 2 | US1 - Add Task | P1 | 250 | 20 | None (after Phase 1) |
| 3 | US2 - Mark Complete | P1 | 100 | 10 | None (after Phase 1) |
| 4 | US3 - View All Tasks | P1 | 60 | 8 | None (after Phase 1) |
| 5 | US4 - Delete Task | P2 | 80 | 8 | None (after Phase 1) |
| 6 | Polish | - | 100 | 5 | All user stories |
| **Total** | | | **~840** | **~67** | |

**Estimated Development Time**: 3-5 days (single developer, following TDD)

---

## Critical Files to Create/Modify

### Phase 0 (Setup)
- ✅ `package.json` - Dependencies and scripts
- ✅ `vite.config.js` - Vite and Vitest configuration
- ✅ `tests/setup.js` - localStorage mock import
- ✅ `index.html` - Semantic HTML skeleton
- ✅ Empty module files: `src/main.js`, `src/storage.js`, `src/tasks.js`, `src/ui.js`, `src/utils.js`

### Phase 1 (Foundation)
- 📝 `src/storage.js` - loadTasks, saveTasks
- 📝 `src/utils.js` - generateUUID
- 📝 `src/tasks.js` - isValidDescription
- 📝 `styles/main.css` - Basic layout and focus styles
- 📝 `tests/unit/storage.test.js` - Storage tests
- 📝 `tests/unit/utils.test.js` - UUID tests

### Phase 2 (US1 - Add Task)
- 📝 `src/tasks.js` - addTask, getAllTasks
- 📝 `src/ui.js` - renderTasks, showError, setupEventListeners
- 📝 `src/main.js` - App initialization
- 📝 `tests/unit/tasks.test.js` - Task business logic tests
- 📝 `tests/unit/ui.test.js` - UI rendering tests
- 📝 `tests/integration/app.test.js` - Add task flow

### Phase 3 (US2 - Mark Complete)
- 📝 `src/tasks.js` - toggleTask (add function)
- 📝 `src/ui.js` - Update renderTasks, setupEventListeners
- 📝 `styles/main.css` - Completed task styles
- 📝 `tests/unit/tasks.test.js` - Toggle tests (add)
- 📝 `tests/integration/app.test.js` - Toggle flow (add)

### Phase 4 (US3 - View All Tasks)
- 📝 `src/ui.js` - showEmptyState (add function)
- 📝 `tests/unit/tasks.test.js` - getAllTasks tests (add)
- 📝 `tests/integration/app.test.js` - View flow (add)

### Phase 5 (US4 - Delete Task)
- 📝 `src/tasks.js` - deleteTask (add function)
- 📝 `src/ui.js` - Update renderTasks, setupEventListeners
- 📝 `styles/main.css` - Delete button styles
- 📝 `tests/unit/tasks.test.js` - Delete tests (add)
- 📝 `tests/integration/app.test.js` - Delete flow (add)

### Phase 6 (Polish)
- 📝 `src/main.js` - Browser support check, global error handler
- 📝 `styles/main.css` - Animations, transitions, responsive design
- 📝 `tests/performance/100-tasks.test.js` - Performance verification

**Legend**: ✅ Created in phase | 📝 Modified/created in phase

---

## Risk Mitigation

### Risk 1: Storage Quota Exceeded
**Likelihood**: Low (100 tasks ~50KB, limit 5-10MB)
**Impact**: High (cannot save new tasks)

**Mitigation**:
- Enforce 100 task limit in `addTask()` (prevents unbounded growth)
- Wrap `saveTasks()` in try-catch for QuotaExceededError
- Display user-friendly error: "Storage full. Please delete some tasks."
- Document limitation in UI (task counter: "50/100 tasks")

**Verification**: Manual test by filling localStorage to near-capacity

---

### Risk 2: Browser Data Cleared
**Likelihood**: Medium (user action or browser auto-clear)
**Impact**: High (permanent data loss)

**Mitigation**:
- Document limitation prominently in UI
- Future enhancement: Export/import JSON (out of scope for MVP)
- Accept as known limitation (aligns with assumptions)

**Verification**: Manual test by clearing browser data

---

### Risk 3: Accessibility Gaps
**Likelihood**: Medium (easy to miss without testing)
**Impact**: High (excludes users with disabilities)

**Mitigation**:
- WCAG 2.2 Level AA checklist (Phase 6A)
- Manual keyboard testing (all interactions)
- Screen reader testing (VoiceOver)
- Automated tools (axe DevTools, Lighthouse)
- ARIA attributes for all dynamic content

**Verification**: Phase 6A accessibility audit (axe DevTools 0 violations, Lighthouse 100%)

---

### Risk 4: Performance Degradation at 100 Tasks
**Likelihood**: Low (vanilla JS fast, 100 items trivial)
**Impact**: Medium (violates SC-004)

**Mitigation**:
- Event delegation (single handler for all tasks)
- CSS containment (`contain: layout style` on list items)
- Profile with Chrome DevTools Performance tab
- Performance test suite (100 tasks render < 50ms)

**Verification**: Phase 6C performance testing (create 100 tasks, measure operations)

---

### Risk 5: XSS Vulnerability
**Likelihood**: Low (controlled input, no external data)
**Impact**: Critical (security vulnerability)

**Mitigation**:
- Use `textContent` exclusively (never `innerHTML`)
- No eval or dynamic script execution
- Native DOM APIs provide auto-escaping
- Security audit in Phase 6

**Verification**: Manual XSS test (add task with `<script>alert('xss')</script>`, verify renders as text)

---

## Success Criteria Verification Plan

| Success Criterion | Verification Method | Target | Phase |
|-------------------|---------------------|--------|-------|
| SC-001: Add task < 5 seconds | Manual timing (stopwatch) | < 5s | Phase 2 |
| SC-002: Single interaction to toggle | Count clicks (1 click = pass) | 1 click | Phase 3 |
| SC-003: 100% persistence reliability | Integration test (add, refresh, verify) | 100% | Phase 4 |
| SC-004: 100 tasks no degradation | Performance test (create 100, measure) | < 200ms ops | Phase 6C |
| SC-005: 95% user completion without help | User testing (5 users, 4-5 succeed) | 95% | Post-launch |
| SC-006: State changes < 200ms | Performance test (measure all operations) | < 200ms | Phase 6C |

**SC-005 Note**: User testing deferred to post-launch. MVP focuses on technical implementation. User research recommended after initial deployment.

---

## Next Command

After this plan execution completes and all artifacts verified:

```bash
/speckit.tasks
```

This will generate `tasks.md` with actionable, dependency-ordered tasks based on the 6 implementation phases defined in this plan.

---

## Traceability Matrix

### Functional Requirements → Implementation Phases

| FR | Requirement | Phase | Module | Function |
|----|-------------|-------|--------|----------|
| FR-001 | Add tasks | Phase 2 | tasks.js | addTask() |
| FR-002 | Prevent empty | Phase 1 | tasks.js | isValidDescription() |
| FR-003 | Display all | Phase 4 | tasks.js, ui.js | getAllTasks(), renderTasks() |
| FR-004 | Mark complete | Phase 3 | tasks.js | toggleTask() |
| FR-005 | Visual differentiation | Phase 3 | ui.js | CSS .completed class |
| FR-006 | Delete tasks | Phase 5 | tasks.js | deleteTask() |
| FR-007 | Persist tasks | Phase 1 | storage.js | saveTasks(), loadTasks() |
| FR-008 | Empty message | Phase 4 | ui.js | showEmptyState() |
| FR-009 | 500 char limit | Phase 1 | tasks.js | isValidDescription() |
| FR-010 | Toggle multiple times | Phase 3 | tasks.js | toggleTask() (unlimited) |

### User Stories → Implementation Phases

| User Story | Priority | Phase | Depends On |
|------------|----------|-------|------------|
| US1: Add Task | P1 | Phase 2 | Phase 1 (Foundation) |
| US2: Mark Complete | P1 | Phase 3 | Phase 1 (Foundation) |
| US3: View All Tasks | P1 | Phase 4 | Phase 1 (Foundation) |
| US4: Delete Task | P2 | Phase 5 | Phase 1 (Foundation) |

**Note**: After Phase 1 (Foundation), all user stories can be implemented in parallel (independent).

---

## Agent Context Update

After plan approval, run:

```bash
./.specify/scripts/bash/update-agent-context.sh claude
```

This updates `.specify/memory/agent-claude.md` with tech stack information:

```markdown
# Tech Stack: 001-simple-todo-list

- **Language**: Vanilla JavaScript (ES2022+)
- **Build Tool**: Vite 5.0+ (dev server + bundler)
- **Testing**: Vitest 1.0+ with Happy-DOM
- **Storage**: localStorage (browser Web Storage API)
- **Architecture**: Modular (storage, tasks, ui, utils)
- **Target Platform**: Modern browsers (Chrome 119+, Firefox 120+, Safari 17+, Edge 119+)
- **Dependencies**: vite, vitest, happy-dom, vitest-localstorage-mock (all devDependencies)
```

**Preserve manual additions**: Script preserves content between `<!-- BEGIN MANUAL ADDITIONS -->` and `<!-- END MANUAL ADDITIONS -->` markers.

---

## Version History

- **v1.0.0** (2026-02-12): Initial implementation plan for simple todo list feature
  - 6 phases defined (Setup → Foundation → US1-4 → Polish)
  - Technology stack: Vanilla JS + Vite + Vitest + localStorage
  - Constitution compliance: All 7 principles verified ✅
  - TDD workflow documented for each phase
  - Risk mitigation strategies defined
  - Traceability matrix completed
