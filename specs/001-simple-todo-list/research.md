# Research & Technical Decisions: Simple Todo List

**Branch**: `001-simple-todo-list` | **Date**: 2026-02-12 | **Spec**: [spec.md](./spec.md)

## Purpose

This document captures all technology research and decision-making for the simple todo list feature. All decisions are justified with alternatives considered and sources cited.

---

## Critical Research Questions

### Q1: What storage mechanism should we use for task persistence?

**Options Considered:**
1. **localStorage** (browser Web Storage API)
2. **IndexedDB** (browser database API)
3. **Server-side database** (PostgreSQL, MongoDB, etc.)

**Decision: localStorage**

**Rationale:**
- **Scale-appropriate**: FR-009 limits descriptions to 500 chars. At 100 tasks (SC-004), this is ~50KB data maximum, well under localStorage's 5-10MB typical limit
- **Zero latency**: No network calls required, instant read/write (SC-006: <200ms state changes)
- **Simple API**: Synchronous `getItem()`/`setItem()` vs IndexedDB's async complexity
- **Browser support**: 97%+ global support (all modern browsers)
- **Offline-first**: Assumption states "Internet connectivity may not always be available"

**Alternatives Rejected:**
- **IndexedDB**: Overkill for 100 tasks. Adds async complexity and ~200 LOC overhead for querying/transactions. Only justified for >10MB data or complex queries.
- **Server-side database**: Violates assumption "single device, no multi-device sync". Requires backend, auth, hosting—massive scope increase.

**Sources:**
- [MDN Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Can I Use: localStorage](https://caniuse.com/namevalue-storage)
- [IndexedDB vs localStorage performance](https://hacks.mozilla.org/2012/03/there-is-no-simple-solution-to-storage/)

**Risk Mitigation:**
- Wrap all storage operations in try-catch for quota exceeded errors
- Enforce 100 task limit in code (prevents unbounded growth)
- Document browser data clearing risk in UI

---

### Q2: Should we use a JavaScript framework (React, Vue, Svelte) or vanilla JavaScript?

**Options Considered:**
1. **Vanilla JavaScript** (ES2022+ with JSDoc)
2. **React** (popular framework)
3. **Vue** (progressive framework)
4. **Svelte** (compile-time framework)

**Decision: Vanilla JavaScript (ES2022+)**

**Rationale:**
- **Constitution VI (Simplicity)**: 4 user stories with 10 requirements do not justify framework complexity
- **Zero dependencies**: No build pipeline beyond Vite (dev server only)
- **Fast load time**: ~5KB minified app code vs ~40KB+ React runtime
- **Direct DOM control**: Simple `document.createElement()` for 100 tasks renders in <10ms (no virtual DOM overhead)
- **Easy testing**: Pure functions testable without framework-specific tooling

**Framework value proposition analysis:**
- React excels at: Complex state management, component reuse, large teams
- This app requires: 1 list component, 1 input, 3 buttons, localStorage state
- **Verdict**: Framework overhead (learning curve, bundle size, build complexity) outweighs benefits

**Alternatives Rejected:**
- **React**: 145KB minified bundle (react + react-dom), requires JSX transform, hooks mental model. Not justified for 4 stories.
- **Vue**: 85KB minified, template syntax learning curve. Simpler than React but still unnecessary.
- **Svelte**: 15KB output (best of frameworks) but adds compiler step. Vanilla JS is even simpler.

**Sources:**
- [You Might Not Need a Framework](https://www.domaindriven.dev/blog/you-might-not-need-a-framework)
- [Vanilla JS performance benchmarks](https://krausest.github.io/js-framework-benchmark/)
- [React bundle size analysis](https://bundlephobia.com/package/react@18.2.0)

**Type Safety Strategy:**
- Use JSDoc type annotations for IDE support and inline documentation
- No TypeScript compilation step (aligns with simplicity principle)

---

### Q3: What testing framework should we use?

**Options Considered:**
1. **Vitest** (Vite-native test runner)
2. **Jest** (most popular JS test framework)
3. **Mocha + Chai** (traditional BDD framework)
4. **No framework** (pure assert statements)

**Decision: Vitest + Happy-DOM**

**Rationale:**
- **Native ESM support**: Works seamlessly with Vite's dev server (no transpilation)
- **Fast execution**: 2-5x faster than Jest for small projects (<1000 tests)
- **localStorage testing**: `vitest-localstorage-mock` package provides clean localStorage mocking
- **Jest-compatible API**: Uses same `describe`, `it`, `expect` syntax (low learning curve)
- **Built-in coverage**: `v8` coverage reports with zero config

**Happy-DOM vs jsdom:**
- Happy-DOM is 3x faster for DOM operations
- Better localStorage API emulation
- Sufficient for our DOM manipulation needs (no complex browser APIs)

**Alternatives Rejected:**
- **Jest**: Requires Babel for ESM, slower test runs, heavy config. Vitest is "Jest for Vite projects."
- **Mocha + Chai**: Requires manual assertion library setup, no built-in mocking. More config overhead.
- **No framework**: Would need manual test runner, no assertions, no mocking. Not pragmatic for TDD.

**Sources:**
- [Vitest vs Jest benchmark](https://vitest.dev/guide/comparisons.html)
- [Happy-DOM vs jsdom performance](https://github.com/capricorn86/happy-dom#performance)
- [Vitest localStorage guide](https://vitest.dev/guide/mocking.html#localstorage)

---

### Q4: How should we structure the codebase?

**Options Considered:**
1. **Monolith** (single `app.js` file)
2. **Module separation** (storage, tasks, ui, utils)
3. **MVC pattern** (model, view, controller directories)

**Decision: Module separation (storage, tasks, ui, utils)**

**Rationale:**
- **Testability**: Each module can be unit tested in isolation (TDD requirement)
- **Separation of concerns**:
  - `storage.js`: localStorage I/O only
  - `tasks.js`: Business logic (CRUD, validation)
  - `ui.js`: DOM manipulation only
  - `utils.js`: Pure functions (UUID generation)
- **Constitution II (TDD)**: Modules enable mocking (e.g., mock storage for task tests)
- **Low complexity**: 4 modules ~100-150 LOC each, still easy to understand

**Alternatives Rejected:**
- **Monolith**: 600+ LOC in one file. Hard to test (must test through UI). Violates TDD.
- **MVC**: Adds abstraction layers (Model classes, Controller orchestration). Overkill for 1 entity type.

**Module Dependency Graph:**
```
main.js
  ├─→ storage.js (no dependencies)
  ├─→ tasks.js (depends on storage.js)
  ├─→ ui.js (depends on tasks.js)
  └─→ utils.js (no dependencies)
```

**Sources:**
- [JavaScript Module Design Patterns](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Testing Modular JavaScript](https://martinfowler.com/articles/mocksArentStubs.html)

---

### Q5: What accessibility standards should we target?

**Standard: WCAG 2.2 Level AA**

**Required Patterns:**
1. **Keyboard Navigation**
   - All interactive elements focusable with `Tab`
   - Form submission with `Enter`
   - Task actions with `Space` or `Enter`
   - Focus visible (CSS `:focus-visible` styles)

2. **ARIA Attributes**
   - `role="list"` and `role="listitem"` for task list
   - `aria-label` for icon-only buttons (e.g., delete button)
   - `aria-live="polite"` for dynamic task list updates
   - `aria-checked` for checkbox state

3. **Semantic HTML**
   - `<button>` for all actions (not `<div>` with click handlers)
   - `<input type="checkbox">` for completion status
   - `<ul>` / `<li>` for task list structure
   - `<form>` for task input

4. **Color Contrast**
   - 4.5:1 contrast ratio for normal text
   - 3:1 for large text and UI components

**Testing Tools:**
- Manual keyboard testing (all actions without mouse)
- [axe DevTools](https://www.deque.com/axe/devtools/) browser extension
- Screen reader testing (VoiceOver on macOS)

**Sources:**
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [ARIA Authoring Practices: To-Do List](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

### Q6: How should we handle errors?

**Strategy: Defensive localStorage + User-friendly messages**

**Error Scenarios:**
1. **Quota exceeded** (`DOMException: QuotaExceededError`)
   - Catch in `storage.saveTasks()`
   - Display: "Storage full. Please delete some tasks."
   - Prevention: Enforce 100 task limit

2. **Malformed JSON** (corrupted localStorage data)
   - Catch in `storage.loadTasks()`
   - Fallback: Return empty array `[]`
   - Log error to console for debugging

3. **Validation errors** (empty description, >500 chars)
   - Check before adding task
   - Display: "Task description must be 1-500 characters"

4. **Browser incompatibility** (no localStorage support)
   - Check `typeof Storage !== 'undefined'` on app init
   - Display: "Browser not supported. Please use a modern browser."

**Error UI Pattern:**
```javascript
// Toast-style temporary message
showError(message) {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-toast';
  errorEl.textContent = message;
  errorEl.setAttribute('role', 'alert');
  document.body.appendChild(errorEl);
  setTimeout(() => errorEl.remove(), 5000);
}
```

**Sources:**
- [Error Handling Best Practices](https://humanwhocodes.com/blog/2009/03/10/the-art-of-throwing-javascript-errors/)
- [localStorage Error Handling](https://developer.mozilla.org/en-US/docs/Web/API/Storage#exceptions)

---

### Q7: How should we implement task IDs?

**Decision: UUID v4**

**Rationale:**
- **Uniqueness guarantee**: Cryptographically random, collision probability negligible
- **No server required**: Can generate client-side without coordination
- **Standard format**: Recognized pattern (e.g., `550e8400-e29b-41d4-a716-446655440000`)

**Implementation:**
```javascript
// src/utils.js
export function generateUUID() {
  return crypto.randomUUID(); // Native Web Crypto API
}
```

**Browser Support:**
- `crypto.randomUUID()` supported in all modern browsers (Chrome 92+, Firefox 95+, Safari 15.4+)
- Target platform aligns (last 2 versions requirement)

**Alternatives Rejected:**
- **Incremental integers**: Requires state management for counter. Risk of ID reuse if localStorage cleared.
- **Timestamps**: Collision risk if two tasks added in same millisecond.
- **nanoid**: External dependency. UUID v4 is built-in.

**Sources:**
- [MDN Crypto.randomUUID()](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)
- [Can I Use: crypto.randomUUID](https://caniuse.com/mdn-api_crypto_randomuuid)

---

### Q8: How should we order tasks in the list?

**Decision: Newest first (descending createdAt)**

**Rationale:**
- **Assumption stated in spec**: "Tasks are displayed in chronological order (newest first) by default"
- **User expectation**: Recently added tasks appear at top (inbox model)
- **Implementation**: Sort by `createdAt` timestamp in descending order

**Implementation:**
```javascript
export function getAllTasks() {
  const tasks = loadTasks();
  return tasks.sort((a, b) => b.createdAt - a.createdAt);
}
```

**Out of Scope:**
- Custom sorting (alphabetical, priority)
- Manual reordering (drag-and-drop)
- Completed tasks at bottom

**Sources:**
- [UX Research: Todo List Patterns](https://www.nngroup.com/articles/todo-list-ux/)

---

## Performance Considerations

### Target: 100 tasks (SC-004)

**Benchmarks (expected):**
- Initial render: <50ms (100 DOM elements)
- Add task: <10ms (1 createElement + localStorage write)
- Toggle task: <5ms (1 className change + localStorage write)
- Delete task: <10ms (1 removeChild + localStorage write)

**Optimizations:**
1. **Event delegation**: Single click handler on `<ul>` for all task actions
2. **CSS containment**: `contain: layout style` on task items (isolates reflow)
3. **Batch writes**: Single `saveTasks()` call per user action (no redundant writes)

**NOT needed (premature optimization):**
- Virtual scrolling (100 items render instantly)
- Web Workers (no heavy computation)
- Debouncing/throttling (user actions already discrete)

**Sources:**
- [High Performance Browser Networking](https://hpbn.co/)
- [CSS Containment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment)

---

## Security Considerations

### Threat Model

**In Scope:**
- XSS prevention (user-generated task descriptions)

**Out of Scope:**
- Authentication (single user, local device)
- SQL injection (no database)
- CSRF (no server)

### XSS Prevention

**Strategy: DOM APIs (not innerHTML)**

```javascript
// SAFE: Uses textContent (auto-escapes)
taskElement.textContent = task.description;

// UNSAFE: Would allow script injection
// taskElement.innerHTML = task.description; // ❌ NEVER DO THIS
```

**No sanitization library needed**: Native DOM APIs provide safe defaults.

**Sources:**
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [DOM-based XSS](https://owasp.org/www-community/attacks/DOM_Based_XSS)

---

## Build & Development Tools

### Vite Configuration

**Purpose**: Dev server + production bundler

**Configuration** (`vite.config.js`):
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Relative paths for easy deployment
  build: {
    outDir: 'dist',
    sourcemap: true, // For debugging
    minify: 'terser', // Smaller bundles than esbuild
  },
  test: {
    globals: true, // describe/it/expect without imports
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.js'], // localStorage mock
  },
});
```

**Dependencies** (package.json):
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

**Sources:**
- [Vite Guide](https://vitejs.dev/guide/)
- [Vitest Configuration](https://vitest.dev/config/)

---

## Browser Compatibility

**Target**: Last 2 versions of major browsers

**Required APIs:**
- localStorage (2009+ support)
- ES2022 syntax (2022+ support)
- `crypto.randomUUID()` (2021+ support)
- CSS Grid (2017+ support)

**Supported Browsers:**
- Chrome 119+
- Firefox 120+
- Safari 17+
- Edge 119+

**NOT Supported:**
- Internet Explorer (all versions)
- Legacy Edge (<79)
- Browsers with JavaScript disabled

**Sources:**
- [Can I Use: Feature Support](https://caniuse.com/)
- [MDN Browser Compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#browser_compatibility)

---

## Open Questions (None)

All research questions resolved. Ready to proceed to data model and contract design.

---

## Version History

- **v1.0.0** (2026-02-12): Initial research for simple todo list feature
