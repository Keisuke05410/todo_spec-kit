# Tasks: Simple Todo List

**Input**: Design documents from `/specs/001-simple-todo-list/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/modules.md, quickstart.md

**Tests**: Tests are included in this implementation following TDD (Test-Driven Development) principles as required by the Constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize npm project with package.json
- [ ] T002 Install dependencies: vite, vitest, happy-dom, vitest-localstorage-mock
- [ ] T003 Create project directories: src/, styles/, tests/unit/, tests/integration/
- [ ] T004 Create vite.config.js with Vite and Vitest configuration
- [ ] T005 Create tests/setup.js with localStorage mock import
- [ ] T006 Create index.html with semantic HTML structure
- [ ] T007 [P] Create empty module files: src/main.js, src/storage.js, src/tasks.js, src/ui.js, src/utils.js
- [ ] T008 [P] Create empty styles/main.css file
- [ ] T009 Create tests/setup.test.js with basic setup test
- [ ] T010 Verify setup: Run `npm test` and ensure 1 test passes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Storage Layer (TDD)

- [ ] T011 [P] Write tests for loadTasks() in tests/unit/storage.test.js (test empty, valid JSON, corrupted JSON)
- [ ] T012 [P] Write tests for saveTasks() in tests/unit/storage.test.js (test save empty, save tasks, quota exceeded)
- [ ] T013 Implement loadTasks() in src/storage.js (JSON parse with error handling)
- [ ] T014 Implement saveTasks() in src/storage.js (JSON stringify with QuotaExceededError handling)
- [ ] T015 Verify storage tests pass: Run `npm test -- tests/unit/storage.test.js`

### UUID Utility (TDD)

- [ ] T016 Write tests for generateUUID() in tests/unit/utils.test.js (test format, uniqueness)
- [ ] T017 Implement generateUUID() in src/utils.js using crypto.randomUUID()
- [ ] T018 Verify utils tests pass: Run `npm test -- tests/unit/utils.test.js`

### Task Validation (TDD)

- [ ] T019 Write tests for isValidDescription() in tests/unit/tasks.test.js (test valid, empty, too long)
- [ ] T020 Implement isValidDescription() in src/tasks.js (1-500 chars after trim)
- [ ] T021 Verify validation tests pass: Run `npm test -- tests/unit/tasks.test.js`

### HTML & CSS Foundation

- [ ] T022 [P] Implement semantic HTML structure in index.html (form, input, ul#task-list)
- [ ] T023 [P] Implement basic CSS in styles/main.css (layout, focus styles, accessibility)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add Task (Priority: P1) 🎯 MVP

**Goal**: Enable users to add tasks with validation and persistence

**Independent Test**: Enter a task description, submit form, verify task appears in list and persists after page refresh

### Tests for User Story 1 (TDD - Write FIRST, ensure they FAIL)

- [ ] T024 [P] [US1] Write addTask() unit tests in tests/unit/tasks.test.js (create task, trim, persist, validate, limit)
- [ ] T025 [P] [US1] Write getAllTasks() unit tests in tests/unit/tasks.test.js (empty, all tasks, sorting, filtering)
- [ ] T026 [P] [US1] Write renderTasks() unit tests in tests/unit/ui.test.js (render, empty state, XSS safe)
- [ ] T027 [P] [US1] Write showError() unit tests in tests/unit/ui.test.js (display, alert role, auto-remove)
- [ ] T028 [P] [US1] Write setupEventListeners() unit tests in tests/unit/ui.test.js (form submit, clear input)
- [ ] T029 [US1] Write integration test for add task flow in tests/integration/app.test.js (add, display, clear, errors)

### Implementation for User Story 1

- [ ] T030 [US1] Implement addTask() in src/tasks.js (validate, check limit, create task, persist)
- [ ] T031 [US1] Implement getAllTasks() in src/tasks.js (load, filter invalid, sort by createdAt desc)
- [ ] T032 [US1] Implement renderTasks() in src/ui.js (clear list, create li elements, use textContent)
- [ ] T033 [US1] Implement showError() in src/ui.js (create toast, role="alert", auto-remove after 5s)
- [ ] T034 [US1] Implement showEmptyState() in src/ui.js (display "No tasks yet" message)
- [ ] T035 [US1] Implement setupEventListeners() in src/ui.js (form submit handler, call addTask, catch errors)
- [ ] T036 [US1] Add character counter UI in index.html and src/ui.js (show "500 chars remaining")
- [ ] T037 [US1] Implement main() in src/main.js (browser check, setup listeners, load initial tasks)
- [ ] T038 [US1] Verify all US1 tests pass: Run `npm test`
- [ ] T039 [US1] Manual test: Add tasks via browser, verify persistence after refresh

**Checkpoint**: User Story 1 is fully functional and testable independently - This is the MVP!

---

## Phase 4: User Story 2 - Mark Complete (Priority: P1)

**Goal**: Enable users to toggle task completion status

**Independent Test**: Add a task, click checkbox to mark complete, verify strikethrough appears and persists

### Tests for User Story 2 (TDD - Write FIRST, ensure they FAIL)

- [ ] T040 [P] [US2] Write toggleTask() unit tests in tests/unit/tasks.test.js (toggle incomplete→complete, complete→incomplete, persist, not found, no affect others)
- [ ] T041 [US2] Write integration test for toggle flow in tests/integration/app.test.js (mark complete, strikethrough, unmark)

### Implementation for User Story 2

- [ ] T042 [US2] Implement toggleTask() in src/tasks.js (find task, flip completed, persist)
- [ ] T043 [US2] Update renderTasks() in src/ui.js to include checkbox with checked state
- [ ] T044 [US2] Update setupEventListeners() in src/ui.js to handle checkbox click (event delegation)
- [ ] T045 [US2] Add completed task styles in styles/main.css (strikethrough, opacity, checkbox styles)
- [ ] T046 [US2] Verify all US2 tests pass: Run `npm test`
- [ ] T047 [US2] Manual test: Toggle tasks, verify state persists

**Checkpoint**: User Stories 1 AND 2 both work independently

---

## Phase 5: User Story 3 - View All Tasks (Priority: P1)

**Goal**: Display all tasks with sorting and empty state handling

**Independent Test**: Add multiple tasks, verify all displayed sorted newest first, verify empty state when no tasks

### Tests for User Story 3 (TDD - Write FIRST, ensure they FAIL)

- [ ] T048 [P] [US3] Write getAllTasks() sorting tests in tests/unit/tasks.test.js (verify newest first)
- [ ] T049 [US3] Write integration test for view flow in tests/integration/app.test.js (empty state, all tasks, persistence)

### Implementation for User Story 3

- [ ] T050 [US3] Update getAllTasks() in src/tasks.js to ensure correct sorting (already implemented in Phase 3, verify)
- [ ] T051 [US3] Update renderTasks() in src/ui.js to call showEmptyState() when tasks.length === 0
- [ ] T052 [US3] Add task count indicator in src/ui.js (e.g., "3 tasks, 1 completed")
- [ ] T053 [US3] Verify all US3 tests pass: Run `npm test`
- [ ] T054 [US3] Manual test: Verify empty state, add tasks, refresh browser, verify persistence

**Checkpoint**: All P1 user stories (US1, US2, US3) are independently functional

---

## Phase 6: User Story 4 - Delete Task (Priority: P2)

**Goal**: Enable users to remove tasks permanently

**Independent Test**: Add a task, click delete button, verify task removed from list and storage

### Tests for User Story 4 (TDD - Write FIRST, ensure they FAIL)

- [ ] T055 [P] [US4] Write deleteTask() unit tests in tests/unit/tasks.test.js (remove, not found, no affect others)
- [ ] T056 [US4] Write integration test for delete flow in tests/integration/app.test.js (delete button, UI update)

### Implementation for User Story 4

- [ ] T057 [US4] Implement deleteTask() in src/tasks.js (find task, splice, persist)
- [ ] T058 [US4] Update renderTasks() in src/ui.js to include delete button with aria-label
- [ ] T059 [US4] Update setupEventListeners() in src/ui.js to handle delete button click (event delegation)
- [ ] T060 [US4] Add delete button styles in styles/main.css (hover, accessibility)
- [ ] T061 [US4] Verify all US4 tests pass: Run `npm test`
- [ ] T062 [US4] Manual test: Delete tasks, verify removal persists

**Checkpoint**: All user stories (US1-US4) are independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Accessibility Audit

- [ ] T063 [P] Manual keyboard testing: Verify all elements reachable via Tab, Space/Enter work
- [ ] T064 [P] Screen reader testing with VoiceOver: Verify announcements for task list, checkboxes, buttons
- [ ] T065 Add ARIA attributes in src/ui.js: role="list", aria-live="polite", aria-label on delete button
- [ ] T066 Add focus-visible styles in styles/main.css
- [ ] T067 Run axe DevTools accessibility scan: Target 0 violations
- [ ] T068 Run Lighthouse accessibility audit: Target 100% score

### Error Handling

- [ ] T069 [P] Add browser support check in src/main.js (typeof Storage check, alert if unsupported)
- [ ] T070 [P] Add global error handler in src/main.js (window.addEventListener('error'))
- [ ] T071 Test all error scenarios manually: quota exceeded, corrupted localStorage, invalid task ID

### Performance Verification

- [ ] T072 Create performance test in tests/performance/100-tasks.test.js (create 100 tasks, measure render)
- [ ] T073 Verify SC-004: Run performance test, ensure < 200ms for all operations
- [ ] T074 Manual performance test: Create 100 tasks in browser, verify no degradation
- [ ] T075 Profile with Chrome DevTools Performance tab

### Visual Polish

- [ ] T076 [P] Add CSS transitions in styles/main.css (task fade-in, checkbox scale, toast slide-in)
- [ ] T077 [P] Add hover states in styles/main.css (delete button, task items)
- [ ] T078 Implement responsive design in styles/main.css (mobile touch targets 44×44px, flexible layout)
- [ ] T079 Verify color contrast ratio 4.5:1 with WebAIM Contrast Checker
- [ ] T080 Test with color blindness simulator

### Final Verification

- [ ] T081 Run full test suite: `npm test` - ensure all tests pass
- [ ] T082 Run test coverage: `npm test -- --coverage` - ensure 90%+ coverage for business logic
- [ ] T083 Build production bundle: `npm run build` - verify bundle size < 10KB gzipped
- [ ] T084 Follow quickstart.md validation steps
- [ ] T085 Manual end-to-end testing of all user stories in browser

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) completion
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) completion - Can run in parallel with US1 if staffed
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) completion - Can run in parallel with US1/US2 if staffed
- **User Story 4 (Phase 6)**: Depends on Foundational (Phase 2) completion - Can run in parallel with US1/US2/US3 if staffed
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent after Foundational - MVP candidate
- **User Story 2 (P1)**: Independent after Foundational - Builds on US1 UI but testable separately
- **User Story 3 (P1)**: Independent after Foundational - Uses same rendering as US1
- **User Story 4 (P2)**: Independent after Foundational - Adds delete functionality

### Within Each User Story

**Critical TDD Rule**: Tests MUST be written and FAIL before implementation

1. Write all tests first (marked with [P] can run in parallel)
2. Run tests - ensure they FAIL (red)
3. Implement code to make tests pass (green)
4. Refactor while keeping tests passing
5. Verify story complete before moving to next

### Parallel Opportunities

#### Phase 1 (Setup)
- T007, T008 can run in parallel (different files)

#### Phase 2 (Foundational)
- T011, T012 can run in parallel (different test scopes in same file)
- T022, T023 can run in parallel (HTML and CSS are independent)

#### Phase 3 (User Story 1) - Test Writing
- T024, T025, T026, T027, T028 can all run in parallel (different test files)

#### Phase 4 (User Story 2) - Test Writing
- T040, T041 can run in parallel (different test files)

#### Phase 5 (User Story 3) - Test Writing
- T048, T049 can run in parallel (different test scopes)

#### Phase 6 (User Story 4) - Test Writing
- T055, T056 can run in parallel (different test files)

#### Phase 7 (Polish)
- T063, T064 can run in parallel (manual testing tasks)
- T069, T070 can run in parallel (different features in same file)
- T076, T077 can run in parallel (different CSS features)

#### User Stories (After Foundational Complete)
With multiple developers, all user stories (Phase 3-6) can be worked on in parallel as they are independent after Phase 2 completes.

---

## Parallel Example: User Story 1 Test Writing

```bash
# Launch all US1 test writing tasks together:
Task T024: "Write addTask() unit tests in tests/unit/tasks.test.js"
Task T025: "Write getAllTasks() unit tests in tests/unit/tasks.test.js"
Task T026: "Write renderTasks() unit tests in tests/unit/ui.test.js"
Task T027: "Write showError() unit tests in tests/unit/ui.test.js"
Task T028: "Write setupEventListeners() unit tests in tests/unit/ui.test.js"

# Then after all tests written and failing:
Task T029: "Write integration test for add task flow"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T023) - **CRITICAL BLOCKER**
3. Complete Phase 3: User Story 1 (T024-T039)
4. **STOP and VALIDATE**: Test US1 independently in browser
5. Deploy/demo if ready - Users can now add and view tasks!

### Incremental Delivery

1. **Foundation**: Complete Setup + Foundational → Infrastructure ready
2. **MVP (US1)**: Add Task functionality → Test independently → Deploy/Demo
3. **Enhancement (US2)**: Add completion tracking → Test independently → Deploy/Demo
4. **Enhancement (US3)**: Add view/sorting → Test independently → Deploy/Demo
5. **Enhancement (US4)**: Add delete → Test independently → Deploy/Demo
6. **Polish**: Accessibility + Performance → Final release

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers after Foundational phase (T023):

- **Developer A**: User Story 1 (T024-T039)
- **Developer B**: User Story 2 (T040-T047) - waits until US1 UI ready or works in parallel
- **Developer C**: User Story 3 (T048-T054)
- **Developer D**: User Story 4 (T055-T062)

Stories integrate seamlessly as they share the same storage and UI infrastructure.

---

## TDD Workflow Reminder

**Red-Green-Refactor Cycle** (from quickstart.md):

```
1. RED: Write test → Run test → Verify it FAILS
2. GREEN: Write minimum code → Run test → Verify it PASSES
3. REFACTOR: Clean up code → Run test → Verify still PASSES
4. Repeat for next requirement
```

**Example for addTask():**
1. Write test T024 → Run `npm test` → See failure ❌
2. Implement addTask() (T030) → Run `npm test` → See success ✅
3. Refactor if needed → Run `npm test` → Still success ✅

---

## Success Criteria Verification

From spec.md - verify these after completion:

- **SC-001**: Users can add a new task in under 5 seconds → Manual timing test
- **SC-002**: Single interaction to toggle → Verify one click on checkbox
- **SC-003**: 100% persistence reliability → Integration test + manual refresh test
- **SC-004**: 100 tasks no degradation → Performance test T072-T074
- **SC-005**: 95% user completion without help → Post-launch user testing (deferred)
- **SC-006**: State changes < 200ms → Performance test T072-T074

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] labels**: Map tasks to user stories for traceability (US1, US2, US3, US4)
- **TDD mandatory**: All tests MUST be written BEFORE implementation (Constitution Principle II)
- **Independent stories**: Each user story should be fully testable on its own
- **Commit strategy**: Commit after each completed task or logical group
- **Stop at checkpoints**: Validate stories independently before moving to next priority
- **Avoid**: Vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Total Task Count Summary

- **Phase 1 (Setup)**: 10 tasks
- **Phase 2 (Foundational)**: 13 tasks (BLOCKS all user stories)
- **Phase 3 (User Story 1)**: 16 tasks (MVP)
- **Phase 4 (User Story 2)**: 8 tasks
- **Phase 5 (User Story 3)**: 7 tasks
- **Phase 6 (User Story 4)**: 8 tasks
- **Phase 7 (Polish)**: 23 tasks

**Total**: 85 tasks

**Test tasks**: 28 (33% of total - reflects TDD approach)
**Parallel opportunities**: 20+ tasks marked [P]
**Independent test criteria**: Each user story has dedicated integration tests

**MVP scope**: Phases 1-3 only (39 tasks) delivers working todo list with add/view functionality
