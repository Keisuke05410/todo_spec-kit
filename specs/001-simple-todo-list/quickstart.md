# Developer Quickstart: Simple Todo List

**Branch**: `001-simple-todo-list` | **Date**: 2026-02-12 | **Spec**: [spec.md](./spec.md)

## Purpose

This guide helps developers set up the simple todo list project, understand the codebase structure, run tests, and follow TDD workflow.

---

## Prerequisites

**Required:**
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Modern browser**: Chrome 119+, Firefox 120+, Safari 17+, or Edge 119+

**Verify installation:**
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

**Recommended:**
- Code editor with JavaScript support (VS Code, WebStorm, etc.)
- Git for version control

---

## Initial Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/Keisuke05410/todo_spec-kit.git
cd todo_spec-kit

# Checkout feature branch
git checkout 001-simple-todo-list
```

### 2. Install Dependencies

```bash
npm install
```

**Expected dependencies:**
```json
{
  "devDependencies": {
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "happy-dom": "^12.0.0",
    "vitest-localstorage-mock": "^0.1.0"
  }
}
```

**Installation time**: ~30-60 seconds (depending on network speed)

### 3. Verify Setup

```bash
# Run empty test suite (should pass)
npm test

# Start dev server (should open browser)
npm run dev
```

**Expected output:**
```
✓ tests/setup.test.js (1)
  ✓ setup test passes

 Test Files  1 passed (1)
      Tests  1 passed (1)
```

---

## Project Structure

```
todo_spec-kit/
├── specs/001-simple-todo-list/    # Feature documentation
│   ├── spec.md                    # Requirements (technology-agnostic)
│   ├── plan.md                    # Technical implementation plan
│   ├── research.md                # Technology decisions & rationale
│   ├── data-model.md              # Data structures & validation
│   ├── contracts/modules.md       # Module API contracts
│   ├── quickstart.md              # This file
│   └── tasks.md                   # Actionable task list (TBD)
│
├── index.html                     # Entry point HTML
├── src/                           # Source code
│   ├── main.js                    # App initialization
│   ├── storage.js                 # localStorage I/O
│   ├── tasks.js                   # Task business logic (CRUD)
│   ├── ui.js                      # DOM manipulation
│   └── utils.js                   # Utility functions (UUID)
│
├── styles/                        # CSS stylesheets
│   └── main.css                   # Application styles
│
├── tests/                         # Test suites
│   ├── setup.js                   # Test configuration
│   ├── unit/                      # Unit tests (per module)
│   │   ├── storage.test.js
│   │   ├── tasks.test.js
│   │   ├── ui.test.js
│   │   └── utils.test.js
│   └── integration/               # Integration tests
│       └── app.test.js            # End-to-end user flows
│
├── vite.config.js                 # Vite configuration
├── package.json                   # Dependencies & scripts
└── README.md                      # Project overview
```

---

## Development Commands

### Start Dev Server

```bash
npm run dev
```

**What it does:**
- Starts Vite dev server on `http://localhost:5173`
- Hot module replacement (HMR) enabled
- Opens browser automatically

**Use when:**
- Developing features
- Testing in browser
- Debugging UI issues

### Run Tests

```bash
# Run all tests once
npm test

# Watch mode (re-run on file changes)
npm test -- --watch

# Run specific test file
npm test -- tests/unit/tasks.test.js

# UI mode (interactive test runner)
npm test -- --ui

# Coverage report
npm test -- --coverage
```

**Test output format:**
```
 ✓ tests/unit/tasks.test.js (5)
   ✓ addTask creates task with correct fields
   ✓ addTask throws error on invalid description
   ...

 Test Files  4 passed (4)
      Tests  32 passed (32)
```

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview
```

**Output:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js     # Minified JS bundle
│   └── index-[hash].css    # Minified CSS
```

**Bundle sizes (expected):**
- JavaScript: ~5-8KB (minified + gzipped)
- CSS: ~2-3KB (minified + gzipped)

---

## TDD Workflow

This project follows **Test-Driven Development (TDD)** as required by the Constitution (Principle II).

### Red-Green-Refactor Cycle

```
┌─────────────────────────────────────┐
│  1. RED: Write failing test         │
│     - Test captures requirement     │
│     - Run test, verify it fails     │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  2. GREEN: Write minimum code       │
│     - Make test pass (simplest way) │
│     - Don't optimize yet            │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  3. REFACTOR: Improve code          │
│     - Clean up implementation       │
│     - Keep tests passing            │
└─────────────┬───────────────────────┘
              │
              └──► Repeat for next requirement
```

### Step-by-Step Example

**Goal**: Implement `addTask()` function (User Story 1)

#### Step 1: Write Test First (RED)

```javascript
// tests/unit/tasks.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { addTask, getAllTasks } from '../../src/tasks.js';

describe('addTask', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates task with correct fields', () => {
    const task = addTask('Buy groceries');

    expect(task.id).toBeDefined();
    expect(task.description).toBe('Buy groceries');
    expect(task.completed).toBe(false);
    expect(task.createdAt).toBeGreaterThan(0);
  });
});
```

**Run test:**
```bash
npm test -- tests/unit/tasks.test.js
```

**Expected**: Test fails (function doesn't exist yet)

#### Step 2: Implement Minimum Code (GREEN)

```javascript
// src/tasks.js
import { generateUUID } from './utils.js';
import { loadTasks, saveTasks } from './storage.js';

export function addTask(description) {
  const task = {
    id: generateUUID(),
    description: description,
    completed: false,
    createdAt: Date.now()
  };

  const tasks = loadTasks();
  tasks.push(task);
  saveTasks(tasks);

  return task;
}
```

**Run test:**
```bash
npm test -- tests/unit/tasks.test.js
```

**Expected**: Test passes ✅

#### Step 3: Refactor (if needed)

Add validation, trim description, etc.

```javascript
export function addTask(description) {
  if (!isValidDescription(description)) {
    throw new Error('Task description must be 1-500 characters');
  }

  const task = {
    id: generateUUID(),
    description: description.trim(), // Refactor: trim whitespace
    completed: false,
    createdAt: Date.now()
  };

  const tasks = loadTasks();
  tasks.push(task);
  saveTasks(tasks);

  return task;
}
```

**Run test again:**
```bash
npm test
```

**Expected**: All tests still pass ✅

---

## Testing Strategy

### Unit Tests

**Purpose**: Test individual modules in isolation

**Location**: `tests/unit/`

**Characteristics:**
- Fast execution (<1ms per test)
- No DOM or localStorage (mocked)
- Pure function testing

**Example:**
```javascript
// tests/unit/utils.test.js
import { describe, it, expect } from 'vitest';
import { generateUUID } from '../../src/utils.js';

describe('generateUUID', () => {
  it('returns UUID v4 format', () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('generates unique IDs', () => {
    const id1 = generateUUID();
    const id2 = generateUUID();
    expect(id1).not.toBe(id2);
  });
});
```

### Integration Tests

**Purpose**: Test user flows end-to-end

**Location**: `tests/integration/`

**Characteristics:**
- Tests multiple modules together
- Uses Happy-DOM for DOM simulation
- Tests localStorage persistence

**Example:**
```javascript
// tests/integration/app.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { addTask, toggleTask, getAllTasks } from '../../src/tasks.js';

describe('Todo App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('completes full task lifecycle', () => {
    // Add task
    const task = addTask('Buy groceries');
    expect(getAllTasks()).toHaveLength(1);

    // Toggle task
    toggleTask(task.id);
    expect(getAllTasks()[0].completed).toBe(true);

    // Delete task
    deleteTask(task.id);
    expect(getAllTasks()).toHaveLength(0);
  });
});
```

### Test Coverage Goals

**Target**: 90%+ line coverage for business logic

**Check coverage:**
```bash
npm test -- --coverage
```

**Expected output:**
```
File             | % Stmts | % Branch | % Funcs | % Lines |
-----------------|---------|----------|---------|---------|
src/storage.js   | 100     | 100      | 100     | 100     |
src/tasks.js     | 95.5    | 92.3     | 100     | 95.5    |
src/ui.js        | 88.2    | 75.0     | 100     | 88.2    |
src/utils.js     | 100     | 100      | 100     | 100     |
```

**What to test:**
- ✅ Business logic (tasks.js)
- ✅ Storage operations (storage.js)
- ✅ Validation functions
- ✅ Error handling
- ❌ Simple getters/setters (low value)
- ❌ Third-party libraries (Vite, crypto API)

---

## localStorage Testing

### Mock Setup

```javascript
// tests/setup.js
import 'vitest-localstorage-mock';

// This mock is automatically applied to all tests
// No need to manually mock in each test file
```

### Using localStorage in Tests

```javascript
import { beforeEach } from 'vitest';

describe('My Test Suite', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('saves data to localStorage', () => {
    localStorage.setItem('key', 'value');
    expect(localStorage.getItem('key')).toBe('value');
  });
});
```

### Mocking Storage Errors

```javascript
import { vi } from 'vitest';

it('handles quota exceeded error', () => {
  // Mock localStorage.setItem to throw error
  const error = new DOMException('Quota exceeded', 'QuotaExceededError');
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw error;
  });

  expect(() => saveTasks(tasks)).toThrow('Storage full');

  // Restore original implementation
  vi.restoreAllMocks();
});
```

---

## Accessibility Testing

### Manual Keyboard Testing

**Required checks:**

1. **Tab Navigation**
   - Press `Tab` → Input field focused
   - Press `Tab` → Checkbox focused (first task)
   - Press `Tab` → Delete button focused
   - Press `Tab` → Next task checkbox
   - All interactive elements reachable

2. **Keyboard Actions**
   - Input field: Type text, press `Enter` → Task added
   - Checkbox: Press `Space` → Task toggled
   - Delete button: Press `Enter` or `Space` → Task deleted

3. **Focus Visibility**
   - All focused elements have visible outline
   - `:focus-visible` styles applied

**Test script:**
```bash
# Open app in browser
npm run dev

# Unplug mouse
# Navigate using only keyboard
# Verify all actions work
```

### Screen Reader Testing

**macOS (VoiceOver):**
```bash
# Enable VoiceOver
Command + F5

# Navigate with VoiceOver keys
Control + Option + Arrow keys
```

**Expected announcements:**
- "Task list, 3 items"
- "Buy groceries, unchecked checkbox"
- "Delete task, button"
- "Task added, alert" (when adding task)

### Automated Accessibility

**Tools:**
- [axe DevTools](https://www.deque.com/axe/devtools/) browser extension
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/) accessibility audit

**Run Lighthouse:**
```bash
# Build production bundle
npm run build

# Open in Chrome DevTools
# Navigate to Lighthouse tab
# Run "Accessibility" audit
# Target: 100% score
```

---

## Common Development Tasks

### Add a New Feature

1. **Read spec**: Review `specs/001-simple-todo-list/spec.md`
2. **Write test**: Create test file in `tests/unit/`
3. **Run test**: `npm test -- --watch` (watch mode)
4. **Implement**: Write code in `src/`
5. **Verify**: Ensure test passes
6. **Refactor**: Clean up code
7. **Manual test**: Test in browser (`npm run dev`)

### Debug a Failing Test

```bash
# Run single test file
npm test -- tests/unit/tasks.test.js

# Add console.log in source code
# Re-run test to see output

# Use Vitest UI for interactive debugging
npm test -- --ui
```

### Debug Browser Issues

```bash
# Start dev server
npm run dev

# Open browser DevTools (F12)
# Check Console tab for errors
# Use Sources tab for breakpoints
```

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install vite@latest
```

---

## Performance Verification

### SC-004: 100 Tasks Without Degradation

**Test script:**
```javascript
// tests/performance/100-tasks.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { addTask, getAllTasks } from '../../src/tasks.js';

describe('Performance: 100 Tasks', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders 100 tasks in under 200ms', () => {
    // Create 100 tasks
    for (let i = 0; i < 100; i++) {
      addTask(`Task ${i + 1}`);
    }

    // Measure render time
    const start = performance.now();
    const tasks = getAllTasks(); // Load from storage
    const end = performance.now();

    expect(tasks).toHaveLength(100);
    expect(end - start).toBeLessThan(200); // < 200ms (SC-006)
  });
});
```

**Run:**
```bash
npm test -- tests/performance/100-tasks.test.js
```

### Manual Performance Testing

```bash
# Open browser DevTools
npm run dev

# Performance tab → Record
# Add 100 tasks programmatically in Console:
for (let i = 0; i < 100; i++) {
  document.querySelector('#task-input').value = `Task ${i + 1}`;
  document.querySelector('#task-form').dispatchEvent(new Event('submit'));
}

# Stop recording
# Verify render time < 50ms per operation
```

---

## Troubleshooting

### Issue: Tests Fail with "localStorage is not defined"

**Solution**: Ensure `vitest-localstorage-mock` is imported in `tests/setup.js`:

```javascript
// tests/setup.js
import 'vitest-localstorage-mock';
```

And configured in `vite.config.js`:
```javascript
export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.js'],
  },
});
```

### Issue: Dev Server Port Already in Use

**Solution**: Kill process on port 5173 or use different port:

```bash
# Kill process on port 5173
kill -9 $(lsof -t -i:5173)

# Or use different port
npm run dev -- --port 5174
```

### Issue: HMR Not Working (Changes Don't Reflect)

**Solution**:
1. Hard refresh browser (`Cmd+Shift+R` or `Ctrl+Shift+R`)
2. Clear browser cache
3. Restart dev server

### Issue: UUID Generation Fails in Tests

**Solution**: Ensure `crypto.randomUUID()` is available in test environment. If not, mock it:

```javascript
// tests/setup.js
if (typeof crypto === 'undefined') {
  global.crypto = {
    randomUUID: () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  };
}
```

---

## Additional Resources

**Documentation:**
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Documentation](https://vitest.dev/)
- [MDN Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

**Project Documentation:**
- [Feature Specification](./spec.md) - Requirements
- [Implementation Plan](./plan.md) - Technical approach
- [Research Decisions](./research.md) - Technology choices
- [Data Model](./data-model.md) - Entity schemas
- [Module Contracts](./contracts/modules.md) - API interfaces

**Community:**
- [GitHub Issues](https://github.com/Keisuke05410/todo_spec-kit/issues)
- [Stack Overflow: Vitest](https://stackoverflow.com/questions/tagged/vitest)

---

## Next Steps

After setup, proceed to implementation:

1. **Review artifacts**: Read all `specs/001-simple-todo-list/` documentation
2. **Run `/speckit.tasks`**: Generate actionable task breakdown
3. **Follow TDD workflow**: Write tests first, implement incrementally
4. **Run `/speckit.implement`**: Execute task-by-task implementation

**Constitution Compliance**: Ensure all 7 principles followed throughout development.

---

## Version History

- **v1.0.0** (2026-02-12): Initial quickstart guide for simple todo list feature
