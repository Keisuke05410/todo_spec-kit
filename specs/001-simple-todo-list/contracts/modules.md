# Module Contracts: Simple Todo List

**Branch**: `001-simple-todo-list` | **Date**: 2026-02-12 | **Spec**: [spec.md](../spec.md)

## Purpose

This document defines the public API contracts for all JavaScript modules in the simple todo list application. Each function signature includes JSDoc type annotations, parameter descriptions, return types, and error conditions.

---

## Module Overview

```
┌─────────────┐
│   main.js   │  (Entry point)
└──────┬──────┘
       │
       ├──► storage.js    (localStorage I/O)
       ├──► tasks.js      (Business logic, depends on storage.js)
       ├──► ui.js         (DOM manipulation, depends on tasks.js)
       └──► utils.js      (Pure functions)
```

**Dependency Rules:**
- `storage.js` has no dependencies (pure I/O layer)
- `tasks.js` depends on `storage.js` only
- `ui.js` depends on `tasks.js` only
- `utils.js` has no dependencies (pure utilities)
- `main.js` imports all modules and initializes app

---

## Type Definitions

### Task

```javascript
/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier (UUID v4)
 * @property {string} description - User-entered task text (1-500 chars, trimmed)
 * @property {boolean} completed - Whether task is marked complete
 * @property {number} createdAt - Unix timestamp in milliseconds
 */
```

---

## Module: storage.js

**Purpose**: Handle all localStorage read/write operations with error handling.

**Exports**: `loadTasks`, `saveTasks`

---

### loadTasks()

Loads all tasks from localStorage. Returns empty array if no data exists or if data is corrupted.

**Signature:**
```javascript
/**
 * Loads tasks from localStorage
 * @returns {Task[]} Array of tasks, or empty array if no data/corrupted
 */
export function loadTasks() { }
```

**Parameters:** None

**Returns:** `Task[]`
- Array of task objects (may be empty)
- Always returns array (never null/undefined)
- Invalid tasks are filtered out during load

**Side Effects:**
- Reads from `localStorage.getItem('todos')`
- Logs errors to console if JSON parsing fails

**Error Handling:**
- **Corrupted JSON**: Returns `[]`, logs error to console
- **Missing data**: Returns `[]` (no error)
- **Not an array**: Returns `[]`, logs warning

**Examples:**

```javascript
// No data in localStorage
loadTasks(); // → []

// Valid data
// localStorage: [{"id":"123","description":"Task","completed":false,"createdAt":1707724800000}]
loadTasks(); // → [{ id: "123", description: "Task", completed: false, createdAt: 1707724800000 }]

// Corrupted data
// localStorage: "not valid json"
loadTasks(); // → [] (logs error)
```

**Test Cases:**
```javascript
describe('loadTasks', () => {
  it('returns empty array when no data exists', () => {
    localStorage.clear();
    expect(loadTasks()).toEqual([]);
  });

  it('parses valid JSON data', () => {
    localStorage.setItem('todos', JSON.stringify([
      { id: '123', description: 'Test', completed: false, createdAt: 1707724800000 }
    ]));
    const tasks = loadTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].description).toBe('Test');
  });

  it('returns empty array on corrupted JSON', () => {
    localStorage.setItem('todos', 'invalid json');
    expect(loadTasks()).toEqual([]);
  });

  it('returns empty array if data is not an array', () => {
    localStorage.setItem('todos', JSON.stringify({ not: 'array' }));
    expect(loadTasks()).toEqual([]);
  });
});
```

---

### saveTasks(tasks)

Saves tasks array to localStorage as JSON string. Throws error if quota exceeded.

**Signature:**
```javascript
/**
 * Saves tasks to localStorage
 * @param {Task[]} tasks - Array of tasks to save
 * @throws {Error} If storage quota exceeded or tasks is not an array
 */
export function saveTasks(tasks) { }
```

**Parameters:**
- `tasks` (Task[]): Array of task objects to persist
  - Must be valid array
  - Tasks should have all required fields (id, description, completed, createdAt)

**Returns:** `void`

**Side Effects:**
- Writes to `localStorage.setItem('todos', JSON.stringify(tasks))`

**Throws:**
- `Error('Storage full. Please delete some tasks.')` if `QuotaExceededError`
- `TypeError` if `tasks` is not an array

**Examples:**

```javascript
// Save empty array
saveTasks([]); // localStorage.getItem('todos') → "[]"

// Save tasks
saveTasks([
  { id: '123', description: 'Task 1', completed: false, createdAt: 1707724800000 }
]);
// localStorage.getItem('todos') → '[{"id":"123",...}]'

// Error: Quota exceeded
saveTasks(veryLargeArray); // throws Error('Storage full...')
```

**Test Cases:**
```javascript
describe('saveTasks', () => {
  it('saves empty array', () => {
    saveTasks([]);
    expect(localStorage.getItem('todos')).toBe('[]');
  });

  it('saves tasks as JSON', () => {
    const tasks = [
      { id: '123', description: 'Test', completed: false, createdAt: 1707724800000 }
    ];
    saveTasks(tasks);
    const saved = JSON.parse(localStorage.getItem('todos'));
    expect(saved).toEqual(tasks);
  });

  it('throws error on quota exceeded', () => {
    // Mock localStorage.setItem to throw QuotaExceededError
    const error = new DOMException('Quota exceeded', 'QuotaExceededError');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw error; });

    expect(() => saveTasks([])).toThrow('Storage full');
  });
});
```

---

## Module: tasks.js

**Purpose**: Business logic for task CRUD operations. Depends on storage.js.

**Exports**: `addTask`, `toggleTask`, `deleteTask`, `getAllTasks`, `isValidDescription`

---

### isValidDescription(description)

Validates task description format (1-500 characters after trimming).

**Signature:**
```javascript
/**
 * Validates task description
 * @param {string} description - Raw user input
 * @returns {boolean} True if valid (1-500 chars after trim), false otherwise
 */
export function isValidDescription(description) { }
```

**Parameters:**
- `description` (string): User input to validate

**Returns:** `boolean`
- `true` if description is 1-500 characters after trimming
- `false` otherwise

**Validation Logic:**
1. Check if input is string type
2. Trim whitespace
3. Check length is between 1 and 500 (inclusive)

**Examples:**

```javascript
isValidDescription('Buy groceries'); // → true
isValidDescription('  Task  '); // → true (trimmed to "Task")
isValidDescription(''); // → false (empty)
isValidDescription('   '); // → false (empty after trim)
isValidDescription('a'.repeat(500)); // → true (at limit)
isValidDescription('a'.repeat(501)); // → false (exceeds limit)
isValidDescription(null); // → false (not string)
isValidDescription(123); // → false (not string)
```

**Test Cases:**
```javascript
describe('isValidDescription', () => {
  it('accepts valid descriptions', () => {
    expect(isValidDescription('Buy groceries')).toBe(true);
    expect(isValidDescription('a')).toBe(true);
    expect(isValidDescription('a'.repeat(500))).toBe(true);
  });

  it('trims whitespace before validating', () => {
    expect(isValidDescription('  Task  ')).toBe(true);
  });

  it('rejects empty descriptions', () => {
    expect(isValidDescription('')).toBe(false);
    expect(isValidDescription('   ')).toBe(false);
  });

  it('rejects descriptions over 500 chars', () => {
    expect(isValidDescription('a'.repeat(501))).toBe(false);
  });

  it('rejects non-string types', () => {
    expect(isValidDescription(null)).toBe(false);
    expect(isValidDescription(undefined)).toBe(false);
    expect(isValidDescription(123)).toBe(false);
  });
});
```

---

### addTask(description)

Creates a new task and persists it to localStorage. Validates description and enforces 100-task limit.

**Signature:**
```javascript
/**
 * Creates a new task
 * @param {string} description - User-entered task description
 * @returns {Task} The created task
 * @throws {Error} If description invalid or task limit (100) reached
 */
export function addTask(description) { }
```

**Parameters:**
- `description` (string): User input for task description
  - Will be trimmed before storage
  - Must be 1-500 characters after trimming

**Returns:** `Task`
- Newly created task object with:
  - `id`: Generated UUID v4
  - `description`: Trimmed input
  - `completed`: false
  - `createdAt`: Current timestamp

**Side Effects:**
- Generates UUID via `utils.generateUUID()`
- Loads existing tasks via `storage.loadTasks()`
- Saves updated tasks via `storage.saveTasks()`

**Throws:**
- `Error('Task description must be 1-500 characters')` if validation fails
- `Error('Task limit reached (100 tasks maximum)')` if >= 100 tasks exist

**Examples:**

```javascript
// Valid task
const task = addTask('Buy groceries');
// → { id: "550e8400-...", description: "Buy groceries", completed: false, createdAt: 1707724800000 }

// Trimmed input
const task2 = addTask('  Task  ');
// → { id: "...", description: "Task", completed: false, createdAt: ... }

// Error: Empty
addTask(''); // throws Error('Task description must be 1-500 characters')

// Error: Too long
addTask('a'.repeat(501)); // throws Error('Task description must be 1-500 characters')

// Error: Limit reached
// (when 100 tasks already exist)
addTask('Task 101'); // throws Error('Task limit reached (100 tasks maximum)')
```

**Test Cases:**
```javascript
describe('addTask', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates task with correct fields', () => {
    const task = addTask('Buy groceries');
    expect(task.id).toMatch(/^[0-9a-f-]{36}$/); // UUID format
    expect(task.description).toBe('Buy groceries');
    expect(task.completed).toBe(false);
    expect(task.createdAt).toBeGreaterThan(0);
  });

  it('trims description before saving', () => {
    const task = addTask('  Task  ');
    expect(task.description).toBe('Task');
  });

  it('persists task to storage', () => {
    addTask('Task 1');
    const tasks = loadTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].description).toBe('Task 1');
  });

  it('throws error on invalid description', () => {
    expect(() => addTask('')).toThrow('Task description must be 1-500 characters');
    expect(() => addTask('a'.repeat(501))).toThrow('Task description must be 1-500 characters');
  });

  it('throws error when limit reached', () => {
    // Create 100 tasks
    for (let i = 0; i < 100; i++) {
      addTask(`Task ${i + 1}`);
    }
    expect(() => addTask('Task 101')).toThrow('Task limit reached');
  });
});
```

---

### toggleTask(taskId)

Toggles task completion status (false → true, true → false).

**Signature:**
```javascript
/**
 * Toggles task completion status
 * @param {string} taskId - UUID of task to toggle
 * @returns {Task} The updated task
 * @throws {Error} If task not found
 */
export function toggleTask(taskId) { }
```

**Parameters:**
- `taskId` (string): UUID of task to toggle

**Returns:** `Task`
- Updated task object with toggled `completed` field
- All other fields unchanged

**Side Effects:**
- Loads tasks via `storage.loadTasks()`
- Modifies task's `completed` field
- Saves updated tasks via `storage.saveTasks()`

**Throws:**
- `Error('Task not found: {taskId}')` if no task with given ID exists

**Examples:**

```javascript
// Toggle incomplete → complete
const task = addTask('Buy groceries'); // completed: false
const updated = toggleTask(task.id);
// → { ...task, completed: true }

// Toggle complete → incomplete
const updated2 = toggleTask(task.id);
// → { ...task, completed: false }

// Error: Task not found
toggleTask('nonexistent-id'); // throws Error('Task not found: nonexistent-id')
```

**Test Cases:**
```javascript
describe('toggleTask', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('toggles incomplete task to complete', () => {
    const task = addTask('Task 1');
    expect(task.completed).toBe(false);

    const updated = toggleTask(task.id);
    expect(updated.completed).toBe(true);
  });

  it('toggles complete task to incomplete', () => {
    const task = addTask('Task 1');
    toggleTask(task.id); // → complete
    const updated = toggleTask(task.id); // → incomplete
    expect(updated.completed).toBe(false);
  });

  it('persists toggle to storage', () => {
    const task = addTask('Task 1');
    toggleTask(task.id);

    const tasks = loadTasks();
    expect(tasks[0].completed).toBe(true);
  });

  it('throws error if task not found', () => {
    expect(() => toggleTask('nonexistent')).toThrow('Task not found: nonexistent');
  });

  it('does not affect other tasks', () => {
    const task1 = addTask('Task 1');
    const task2 = addTask('Task 2');

    toggleTask(task1.id);

    const tasks = getAllTasks();
    expect(tasks.find(t => t.id === task1.id).completed).toBe(true);
    expect(tasks.find(t => t.id === task2.id).completed).toBe(false);
  });
});
```

---

### deleteTask(taskId)

Deletes a task permanently from storage.

**Signature:**
```javascript
/**
 * Deletes a task
 * @param {string} taskId - UUID of task to delete
 * @throws {Error} If task not found
 */
export function deleteTask(taskId) { }
```

**Parameters:**
- `taskId` (string): UUID of task to delete

**Returns:** `void`

**Side Effects:**
- Loads tasks via `storage.loadTasks()`
- Removes task from array
- Saves updated tasks via `storage.saveTasks()`

**Throws:**
- `Error('Task not found: {taskId}')` if no task with given ID exists

**Examples:**

```javascript
// Delete existing task
const task = addTask('Buy groceries');
deleteTask(task.id); // Task removed from storage

// Error: Task not found
deleteTask('nonexistent-id'); // throws Error('Task not found: nonexistent-id')
```

**Test Cases:**
```javascript
describe('deleteTask', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('removes task from storage', () => {
    const task = addTask('Task 1');
    expect(getAllTasks()).toHaveLength(1);

    deleteTask(task.id);
    expect(getAllTasks()).toHaveLength(0);
  });

  it('throws error if task not found', () => {
    expect(() => deleteTask('nonexistent')).toThrow('Task not found: nonexistent');
  });

  it('does not affect other tasks', () => {
    const task1 = addTask('Task 1');
    const task2 = addTask('Task 2');

    deleteTask(task1.id);

    const tasks = getAllTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe(task2.id);
  });
});
```

---

### getAllTasks()

Retrieves all tasks sorted by creation date (newest first).

**Signature:**
```javascript
/**
 * Gets all tasks sorted by creation date (newest first)
 * @returns {Task[]} Array of tasks in descending createdAt order
 */
export function getAllTasks() { }
```

**Parameters:** None

**Returns:** `Task[]`
- Array of all tasks
- Sorted by `createdAt` descending (newest first)
- May be empty array
- Invalid tasks filtered out

**Side Effects:**
- Loads tasks via `storage.loadTasks()`

**Sorting:**
```javascript
tasks.sort((a, b) => b.createdAt - a.createdAt); // Descending
```

**Examples:**

```javascript
// No tasks
getAllTasks(); // → []

// Multiple tasks
addTask('Task 1'); // createdAt: 1707724800000
addTask('Task 2'); // createdAt: 1707724900000
addTask('Task 3'); // createdAt: 1707725000000

getAllTasks();
// → [
//     { ..., description: "Task 3", createdAt: 1707725000000 }, // Newest
//     { ..., description: "Task 2", createdAt: 1707724900000 },
//     { ..., description: "Task 1", createdAt: 1707724800000 }  // Oldest
//   ]
```

**Test Cases:**
```javascript
describe('getAllTasks', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array when no tasks exist', () => {
    expect(getAllTasks()).toEqual([]);
  });

  it('returns all tasks', () => {
    addTask('Task 1');
    addTask('Task 2');
    expect(getAllTasks()).toHaveLength(2);
  });

  it('sorts tasks by createdAt descending', () => {
    const task1 = addTask('Task 1'); // Older
    // Wait to ensure different timestamp
    const task2 = addTask('Task 2'); // Newer

    const tasks = getAllTasks();
    expect(tasks[0].id).toBe(task2.id); // Newer first
    expect(tasks[1].id).toBe(task1.id); // Older second
  });

  it('filters out invalid tasks', () => {
    // Manually corrupt storage
    localStorage.setItem('todos', JSON.stringify([
      { id: '123', description: 'Valid', completed: false, createdAt: 1707724800000 },
      { id: '456', description: 'Invalid', completed: 'not-boolean', createdAt: 1707724700000 }
    ]));

    const tasks = getAllTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].description).toBe('Valid');
  });
});
```

---

## Module: ui.js

**Purpose**: DOM manipulation and event handling. Depends on tasks.js.

**Exports**: `renderTasks`, `showError`, `showEmptyState`, `setupEventListeners`

---

### renderTasks(tasks)

Renders task list to DOM, replacing existing content.

**Signature:**
```javascript
/**
 * Renders tasks to the DOM
 * @param {Task[]} tasks - Array of tasks to display
 */
export function renderTasks(tasks) { }
```

**Parameters:**
- `tasks` (Task[]): Array of task objects to render

**Returns:** `void`

**Side Effects:**
- Clears existing task list (`#task-list`)
- Creates DOM elements for each task
- Attaches event listeners (delegated)

**DOM Structure (per task):**
```html
<li class="task-item" data-task-id="{task.id}">
  <input type="checkbox" class="task-checkbox" checked="{task.completed}">
  <span class="task-description {task.completed ? 'completed' : ''}">{task.description}</span>
  <button class="task-delete" aria-label="Delete task">🗑️</button>
</li>
```

**Empty State:**
If `tasks.length === 0`, calls `showEmptyState()` instead

**XSS Safety:**
- Uses `textContent` (not `innerHTML`) for task description
- Auto-escapes user input

**Examples:**

```javascript
// Render empty list
renderTasks([]); // Calls showEmptyState()

// Render tasks
renderTasks([
  { id: '123', description: 'Task 1', completed: false, createdAt: 1707724800000 },
  { id: '456', description: 'Task 2', completed: true, createdAt: 1707724700000 }
]);
// DOM updates with 2 <li> elements
```

**Test Cases:**
```javascript
describe('renderTasks', () => {
  beforeEach(() => {
    document.body.innerHTML = '<ul id="task-list"></ul>';
  });

  it('renders tasks to DOM', () => {
    const tasks = [
      { id: '123', description: 'Task 1', completed: false, createdAt: 1707724800000 }
    ];
    renderTasks(tasks);

    const items = document.querySelectorAll('.task-item');
    expect(items).toHaveLength(1);
    expect(items[0].querySelector('.task-description').textContent).toBe('Task 1');
  });

  it('shows completed state', () => {
    const tasks = [
      { id: '123', description: 'Task 1', completed: true, createdAt: 1707724800000 }
    ];
    renderTasks(tasks);

    const checkbox = document.querySelector('.task-checkbox');
    expect(checkbox.checked).toBe(true);
  });

  it('shows empty state when no tasks', () => {
    renderTasks([]);
    // Verify empty state message displayed
    expect(document.querySelector('#task-list').textContent).toContain('No tasks yet');
  });

  it('escapes user input (XSS safe)', () => {
    const tasks = [
      { id: '123', description: '<script>alert("xss")</script>', completed: false, createdAt: 1707724800000 }
    ];
    renderTasks(tasks);

    const desc = document.querySelector('.task-description').textContent;
    expect(desc).toBe('<script>alert("xss")</script>'); // Rendered as text
    expect(document.querySelectorAll('script')).toHaveLength(0); // No script tag created
  });
});
```

---

### showError(message)

Displays error message to user as temporary toast notification.

**Signature:**
```javascript
/**
 * Shows error message to user
 * @param {string} message - Error message to display
 */
export function showError(message) { }
```

**Parameters:**
- `message` (string): Error message text

**Returns:** `void`

**Side Effects:**
- Creates temporary toast element
- Appends to document.body
- Auto-removes after 5 seconds

**DOM Structure:**
```html
<div class="error-toast" role="alert">
  {message}
</div>
```

**CSS (suggested):**
```css
.error-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #f44336;
  color: white;
  padding: 16px;
  border-radius: 4px;
  z-index: 1000;
}
```

**Accessibility:**
- `role="alert"` for screen reader announcement

**Examples:**

```javascript
showError('Task description cannot be empty');
// → Red toast appears for 5 seconds

showError('Storage full. Please delete some tasks.');
// → Red toast appears for 5 seconds
```

**Test Cases:**
```javascript
describe('showError', () => {
  it('displays error message', () => {
    showError('Test error');
    const toast = document.querySelector('.error-toast');
    expect(toast).toBeTruthy();
    expect(toast.textContent).toBe('Test error');
  });

  it('has alert role for accessibility', () => {
    showError('Test error');
    const toast = document.querySelector('.error-toast');
    expect(toast.getAttribute('role')).toBe('alert');
  });

  it('removes toast after 5 seconds', async () => {
    vi.useFakeTimers();
    showError('Test error');

    expect(document.querySelector('.error-toast')).toBeTruthy();
    vi.advanceTimersByTime(5000);
    expect(document.querySelector('.error-toast')).toBeFalsy();

    vi.useRealTimers();
  });
});
```

---

### showEmptyState()

Displays message when task list is empty.

**Signature:**
```javascript
/**
 * Shows empty state message
 */
export function showEmptyState() { }
```

**Parameters:** None

**Returns:** `void`

**Side Effects:**
- Updates `#task-list` with empty state message

**DOM Structure:**
```html
<div class="empty-state">
  <p>No tasks yet. Add your first task above!</p>
</div>
```

**Examples:**

```javascript
showEmptyState();
// → "No tasks yet" message displayed
```

**Test Cases:**
```javascript
describe('showEmptyState', () => {
  it('displays empty state message', () => {
    showEmptyState();
    expect(document.querySelector('.empty-state')).toBeTruthy();
  });
});
```

---

### setupEventListeners()

Initializes all event handlers for the application.

**Signature:**
```javascript
/**
 * Sets up event listeners for the application
 */
export function setupEventListeners() { }
```

**Parameters:** None

**Returns:** `void`

**Side Effects:**
- Attaches submit handler to `#task-form`
- Attaches delegated click handlers to `#task-list` (checkbox, delete button)

**Event Handlers:**

1. **Add Task (form submit)**
   - Prevents default form submission
   - Gets value from `#task-input`
   - Calls `addTask(description)`
   - Clears input on success
   - Calls `showError()` on validation error
   - Re-renders tasks

2. **Toggle Task (checkbox click)**
   - Gets task ID from `data-task-id` attribute
   - Calls `toggleTask(taskId)`
   - Re-renders tasks

3. **Delete Task (delete button click)**
   - Gets task ID from parent `data-task-id` attribute
   - Calls `deleteTask(taskId)`
   - Re-renders tasks

**Event Delegation:**
- Single click handler on `#task-list` for all tasks
- Improves performance (no per-task handlers)

**Examples:**

```javascript
setupEventListeners();
// All event handlers now active
```

**Test Cases:**
```javascript
describe('setupEventListeners', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="task-form">
        <input id="task-input" type="text">
      </form>
      <ul id="task-list"></ul>
    `;
    setupEventListeners();
  });

  it('handles task addition on form submit', () => {
    const input = document.querySelector('#task-input');
    const form = document.querySelector('#task-form');

    input.value = 'New task';
    form.dispatchEvent(new Event('submit'));

    expect(getAllTasks()).toHaveLength(1);
    expect(getAllTasks()[0].description).toBe('New task');
    expect(input.value).toBe(''); // Input cleared
  });

  it('handles task toggle on checkbox click', () => {
    const task = addTask('Task 1');
    renderTasks(getAllTasks());

    const checkbox = document.querySelector('.task-checkbox');
    checkbox.click();

    expect(getAllTasks()[0].completed).toBe(true);
  });

  it('handles task deletion on delete button click', () => {
    addTask('Task 1');
    renderTasks(getAllTasks());

    const deleteBtn = document.querySelector('.task-delete');
    deleteBtn.click();

    expect(getAllTasks()).toHaveLength(0);
  });
});
```

---

## Module: utils.js

**Purpose**: Pure utility functions with no side effects.

**Exports**: `generateUUID`

---

### generateUUID()

Generates a random UUID v4 using Web Crypto API.

**Signature:**
```javascript
/**
 * Generates a UUID v4
 * @returns {string} UUID in format "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
 */
export function generateUUID() { }
```

**Parameters:** None

**Returns:** `string`
- UUID v4 format (36 characters)
- Example: `"550e8400-e29b-41d4-a716-446655440000"`

**Implementation:**
```javascript
export function generateUUID() {
  return crypto.randomUUID(); // Native browser API
}
```

**Browser Support:**
- Chrome 92+, Firefox 95+, Safari 15.4+
- Matches target platform (last 2 versions)

**Examples:**

```javascript
generateUUID(); // → "550e8400-e29b-41d4-a716-446655440000"
generateUUID(); // → "7c9e6679-7425-40de-944b-e07fc1f90ae7" (different)
```

**Test Cases:**
```javascript
describe('generateUUID', () => {
  it('returns string', () => {
    expect(typeof generateUUID()).toBe('string');
  });

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

---

## Module: main.js

**Purpose**: Application entry point. Initializes app on page load.

**Exports**: None (executes immediately)

---

### main()

Initializes application on DOM ready.

**Pseudocode:**
```javascript
import { getAllTasks } from './tasks.js';
import { renderTasks, setupEventListeners } from './ui.js';

/**
 * Initializes the application
 */
function main() {
  // Check browser support
  if (typeof Storage === 'undefined') {
    alert('Browser not supported. Please use a modern browser.');
    return;
  }

  // Setup event handlers
  setupEventListeners();

  // Load and render initial tasks
  const tasks = getAllTasks();
  renderTasks(tasks);
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
```

**Side Effects:**
- Checks localStorage support
- Initializes event listeners
- Renders initial task list

---

## Error Handling Summary

| Module | Function | Error Type | Handling |
|--------|----------|------------|----------|
| storage.js | `loadTasks()` | JSON parse error | Return `[]`, log error |
| storage.js | `saveTasks()` | QuotaExceededError | Throw Error('Storage full...') |
| tasks.js | `addTask()` | Invalid description | Throw Error('Task description must be...') |
| tasks.js | `addTask()` | Limit reached | Throw Error('Task limit reached...') |
| tasks.js | `toggleTask()` | Task not found | Throw Error('Task not found: {id}') |
| tasks.js | `deleteTask()` | Task not found | Throw Error('Task not found: {id}') |
| ui.js | Any task operation | Catch exceptions | Call `showError(message)` |
| main.js | App init | No localStorage | Alert user, disable app |

---

## Traceability Matrix

| User Story | Modules Involved | Key Functions |
|------------|------------------|---------------|
| US1: Add Task | tasks.js, ui.js, storage.js | `addTask()`, `renderTasks()`, `saveTasks()` |
| US2: Mark Complete | tasks.js, ui.js, storage.js | `toggleTask()`, `renderTasks()`, `saveTasks()` |
| US3: View All Tasks | tasks.js, ui.js, storage.js | `getAllTasks()`, `renderTasks()`, `loadTasks()` |
| US4: Delete Task | tasks.js, ui.js, storage.js | `deleteTask()`, `renderTasks()`, `saveTasks()` |

---

## Version History

- **v1.0.0** (2026-02-12): Initial module contracts for simple todo list feature
