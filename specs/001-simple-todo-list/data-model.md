# Data Model: Simple Todo List

**Branch**: `001-simple-todo-list` | **Date**: 2026-02-12 | **Spec**: [spec.md](./spec.md)

## Purpose

This document defines all data structures, validation rules, and state transitions for the simple todo list feature.

---

## Entities

### Task

Represents a single todo item with description, completion status, and metadata.

**Interface (JSDoc):**
```javascript
/**
 * @typedef {Object} Task
 * @property {string} id - Unique identifier (UUID v4)
 * @property {string} description - User-entered task text (1-500 chars)
 * @property {boolean} completed - Whether task is marked complete
 * @property {number} createdAt - Unix timestamp in milliseconds
 */
```

**TypeScript Equivalent (for reference only):**
```typescript
interface Task {
  id: string;           // UUID v4 format
  description: string;  // User-entered text
  completed: boolean;   // Completion state
  createdAt: number;    // Unix timestamp (ms)
}
```

---

## Field Specifications

### Task.id

**Type**: `string`
**Format**: UUID v4 (e.g., `"550e8400-e29b-41d4-a716-446655440000"`)
**Required**: Yes (auto-generated)
**Mutable**: No (immutable after creation)

**Validation Rules:**
- MUST be a valid UUID v4 string (36 characters, 8-4-4-4-12 hexadecimal format)
- MUST be unique across all tasks
- MUST NOT be empty or null

**Generation:**
```javascript
import { generateUUID } from './utils.js';

const id = generateUUID(); // Uses crypto.randomUUID()
```

**Uniqueness Guarantee:**
- UUID v4 provides cryptographic randomness
- Collision probability: ~1 in 10^36 (negligible for 100 tasks)
- No database coordination required

**Edge Cases:**
- If `crypto.randomUUID()` unavailable (old browser), fallback to error state
- If duplicate ID somehow occurs (malicious edit), reject in validation

---

### Task.description

**Type**: `string`
**Length**: 1-500 characters (after trimming whitespace)
**Required**: Yes
**Mutable**: No (tasks are immutable; edit = delete + create new)

**Validation Rules:**
- MUST contain at least 1 non-whitespace character after trimming
- MUST NOT exceed 500 characters after trimming
- MUST be plain text (no HTML, no markdown)
- Leading/trailing whitespace MUST be trimmed before storage

**Validation Function:**
```javascript
/**
 * Validates task description
 * @param {string} description - Raw user input
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidDescription(description) {
  if (typeof description !== 'string') return false;
  const trimmed = description.trim();
  return trimmed.length >= 1 && trimmed.length <= 500;
}
```

**Examples:**

| Input | Trimmed | Valid? | Reason |
|-------|---------|--------|--------|
| `"Buy groceries"` | `"Buy groceries"` | ✅ Yes | 1-500 chars |
| `"  \n  "` | `""` | ❌ No | Empty after trim |
| `"a".repeat(500)` | (500 chars) | ✅ Yes | At limit |
| `"a".repeat(501)` | (501 chars) | ❌ No | Exceeds limit |
| `" Task "` | `"Task"` | ✅ Yes | Trimmed valid |
| `null` | N/A | ❌ No | Not a string |

**Edge Cases:**
- **Unicode characters**: Count each character as 1 (includes emoji, e.g., "📝 Task" = 7 chars)
- **Newlines**: Allowed within 500 char limit (e.g., "Line 1\nLine 2")
- **Special characters**: Allowed (e.g., "<script>", "&nbsp;") - rendered as plain text (XSS safe)

**Error Messages:**
- Empty: `"Task description cannot be empty"`
- Too long: `"Task description must be 500 characters or less (currently: {count})"`

---

### Task.completed

**Type**: `boolean`
**Required**: Yes
**Mutable**: Yes (via toggle action)
**Default**: `false` (new tasks are incomplete)

**Validation Rules:**
- MUST be exactly `true` or `false` (not truthy/falsy values)
- No null or undefined allowed

**State Transitions:**
```
┌─────────────────┐
│  completed:     │
│     false       │  ──┐
│  (Incomplete)   │    │ User clicks checkbox/toggle button
└─────────────────┘    │
         ▲             │
         │             │
         │             ▼
         │     ┌─────────────────┐
         │     │  completed:     │
         └─────│     true        │
   User clicks│  (Complete)     │
    checkbox  └─────────────────┘
```

**Toggle Logic:**
```javascript
/**
 * Toggles task completion status
 * @param {string} taskId - ID of task to toggle
 * @returns {Task} Updated task
 */
export function toggleTask(taskId) {
  const tasks = getAllTasks();
  const task = tasks.find(t => t.id === taskId);
  if (!task) throw new Error('Task not found');

  task.completed = !task.completed; // Boolean flip
  saveTasks(tasks);
  return task;
}
```

**UI Representation:**
- `completed: false` → Empty checkbox, normal text
- `completed: true` → Checked checkbox, strikethrough text

**Unlimited Toggles:**
- User can toggle between states any number of times
- No history tracking (only current state persisted)
- Each toggle triggers localStorage save

---

### Task.createdAt

**Type**: `number`
**Format**: Unix timestamp in milliseconds (e.g., `1707724800000`)
**Required**: Yes (auto-generated)
**Mutable**: No (immutable after creation)

**Validation Rules:**
- MUST be a positive integer
- MUST represent a valid past timestamp (not future)
- MUST be generated server-side equivalent (client time)

**Generation:**
```javascript
const createdAt = Date.now(); // Current time in ms
```

**Purpose:**
- Sort tasks chronologically (newest first)
- Display "Created X minutes ago" (future enhancement)
- Audit trail (when was task added)

**Sorting:**
```javascript
// Descending order (newest first)
tasks.sort((a, b) => b.createdAt - a.createdAt);
```

**Edge Cases:**
- If system clock is wrong, timestamp may be inaccurate (acceptable limitation)
- No timezone handling needed (timestamp is absolute)

---

## State Transitions

### Task Lifecycle

```
┌──────────┐
│  START   │
└────┬─────┘
     │
     │ User clicks "Add Task"
     ▼
┌─────────────────────────────┐
│  Task Created               │
│  - Generate UUID            │
│  - Validate description     │
│  - Set completed = false    │
│  - Set createdAt = now()    │
└─────────┬───────────────────┘
          │
          │ Save to localStorage
          ▼
┌─────────────────────────────┐
│  Task Persisted             │
│  State: Incomplete          │
└─────────┬───────────────────┘
          │
          ├──► Toggle Complete ──┐
          │                      │
          │                      ▼
          │              ┌─────────────────┐
          │              │ State: Complete │
          │              └────────┬────────┘
          │                       │
          │                       │ Toggle Incomplete
          │    ◄──────────────────┘
          │
          │ User clicks "Delete"
          ▼
┌─────────────────────────────┐
│  Task Deleted               │
│  - Remove from localStorage │
│  - Remove from UI           │
└─────────────────────────────┘
          │
          ▼
     ┌──────┐
     │  END │
     └──────┘
```

### Valid State Transitions

| From State | Action | To State | Reversible? |
|------------|--------|----------|-------------|
| (none) | Add Task | Incomplete | No (new task) |
| Incomplete | Toggle | Complete | Yes |
| Complete | Toggle | Incomplete | Yes |
| Incomplete | Delete | (deleted) | No |
| Complete | Delete | (deleted) | No |

### Invalid State Transitions

- ❌ Cannot edit description (immutable)
- ❌ Cannot change `createdAt` (immutable)
- ❌ Cannot change `id` (immutable)
- ❌ Cannot un-delete task (no trash/undo)

---

## Storage Schema

### localStorage Key

**Key**: `"todos"`
**Value**: JSON string (array of Task objects)

### JSON Structure

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "description": "Buy groceries",
    "completed": false,
    "createdAt": 1707724800000
  },
  {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "description": "Call dentist",
    "completed": true,
    "createdAt": 1707724700000
  }
]
```

### Empty State

```json
[]
```

### Size Calculation

**Per Task:**
- `id`: 36 chars (UUID) = 36 bytes
- `description`: 1-500 chars = 1-500 bytes (ASCII) or 1-2000 bytes (Unicode)
- `completed`: 4-5 chars (`true`/`false`) = 4-5 bytes
- `createdAt`: 13 chars (timestamp) = 13 bytes
- JSON overhead (quotes, commas, braces): ~20 bytes

**Total per task**: ~75-575 bytes (average ~325 bytes)

**100 tasks**: ~32.5KB (well under 5MB localStorage limit)

**Maximum description storage**: 500 chars × 100 tasks = 50,000 chars (~50KB)

---

## Validation Rules Summary

### On Task Creation

```javascript
/**
 * Creates a new task
 * @param {string} description - User input
 * @returns {Task} Created task
 * @throws {Error} If validation fails or limit reached
 */
export function addTask(description) {
  // Validation 1: Description format
  if (!isValidDescription(description)) {
    throw new Error('Task description must be 1-500 characters');
  }

  // Validation 2: Task limit (SC-004)
  const tasks = getAllTasks();
  if (tasks.length >= 100) {
    throw new Error('Task limit reached (100 tasks maximum)');
  }

  // Create task
  const task = {
    id: generateUUID(),
    description: description.trim(),
    completed: false,
    createdAt: Date.now()
  };

  // Persist
  tasks.push(task);
  saveTasks(tasks);

  return task;
}
```

### On Task Toggle

```javascript
/**
 * Toggles task completion
 * @param {string} taskId - Task UUID
 * @returns {Task} Updated task
 * @throws {Error} If task not found
 */
export function toggleTask(taskId) {
  const tasks = getAllTasks();
  const task = tasks.find(t => t.id === taskId);

  // Validation: Task exists
  if (!task) {
    throw new Error(`Task not found: ${taskId}`);
  }

  // Toggle
  task.completed = !task.completed;
  saveTasks(tasks);

  return task;
}
```

### On Task Deletion

```javascript
/**
 * Deletes a task
 * @param {string} taskId - Task UUID
 * @throws {Error} If task not found
 */
export function deleteTask(taskId) {
  const tasks = getAllTasks();
  const index = tasks.findIndex(t => t.id === taskId);

  // Validation: Task exists
  if (index === -1) {
    throw new Error(`Task not found: ${taskId}`);
  }

  // Delete
  tasks.splice(index, 1);
  saveTasks(tasks);
}
```

---

## Edge Cases & Error Handling

### Corrupted localStorage Data

**Scenario**: User manually edits localStorage, breaks JSON format

**Handling**:
```javascript
export function loadTasks() {
  try {
    const data = localStorage.getItem('todos');
    if (!data) return [];
    const tasks = JSON.parse(data);
    // Validate array structure
    if (!Array.isArray(tasks)) {
      console.error('Invalid tasks data: not an array');
      return [];
    }
    return tasks;
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return []; // Fallback to empty
  }
}
```

### Missing Required Fields

**Scenario**: Loaded task missing `id`, `description`, `completed`, or `createdAt`

**Handling**: Skip invalid tasks during load
```javascript
export function getAllTasks() {
  const tasks = loadTasks();
  // Filter out invalid tasks
  return tasks.filter(task =>
    task.id &&
    typeof task.description === 'string' &&
    typeof task.completed === 'boolean' &&
    typeof task.createdAt === 'number'
  );
}
```

### Storage Quota Exceeded

**Scenario**: localStorage is full (5-10MB limit reached)

**Handling**:
```javascript
export function saveTasks(tasks) {
  try {
    localStorage.setItem('todos', JSON.stringify(tasks));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage full. Please delete some tasks.');
    }
    throw error;
  }
}
```

---

## Testing Data Sets

### Minimal (Empty List)

```json
[]
```

### Typical (Mixed States)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "description": "Buy groceries",
    "completed": false,
    "createdAt": 1707724800000
  },
  {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "description": "Call dentist",
    "completed": true,
    "createdAt": 1707724700000
  },
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "description": "Finish report",
    "completed": false,
    "createdAt": 1707724600000
  }
]
```

### Maximum (100 Tasks)

```javascript
// Generate 100 tasks programmatically
const testData = Array.from({ length: 100 }, (_, i) => ({
  id: crypto.randomUUID(),
  description: `Test task ${i + 1}`,
  completed: i % 3 === 0, // Every 3rd task complete
  createdAt: Date.now() - (i * 1000) // 1 second apart
}));
```

### Edge Cases

```json
[
  {
    "id": "a1b2c3d4-e5f6-4789-a012-3456789abcde",
    "description": "a",
    "completed": false,
    "createdAt": 1707724800000
  },
  {
    "id": "b2c3d4e5-f6a7-4890-b123-456789abcdef",
    "description": "x".repeat(500),
    "completed": true,
    "createdAt": 1707724700000
  },
  {
    "id": "c3d4e5f6-a7b8-4901-c234-56789abcdef0",
    "description": "Task with\nnewlines\nand special chars: <>&\"'",
    "completed": false,
    "createdAt": 1707724600000
  }
]
```

---

## Traceability Matrix

| Functional Requirement | Data Model Element | Validation Rule |
|------------------------|-------------------|-----------------|
| FR-001: Add tasks | `Task` entity, `addTask()` | Description 1-500 chars |
| FR-002: Prevent empty | `isValidDescription()` | `trimmed.length >= 1` |
| FR-003: Display all | `getAllTasks()` | Return sorted array |
| FR-004: Mark complete | `completed` field | Boolean toggle |
| FR-005: Visual differentiation | `completed` field | true/false state |
| FR-006: Delete tasks | `deleteTask()` | Remove from array |
| FR-007: Persist tasks | localStorage schema | JSON serialization |
| FR-008: Empty message | Empty array check | `tasks.length === 0` |
| FR-009: 500 char limit | `description` validation | `length <= 500` |
| FR-010: Toggle completion | `completed` field | Unlimited toggles |

---

## Version History

- **v1.0.0** (2026-02-12): Initial data model for simple todo list feature
