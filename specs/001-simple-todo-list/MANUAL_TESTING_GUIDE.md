# Manual Testing Guide: Simple Todo List

**Date**: 2026-02-12
**Branch**: `001-simple-todo-list`
**Purpose**: Complete remaining manual verification tasks (T063-T064, T071, T074-T075, T079-T080, T084-T085)

---

## Overview

This guide covers all manual testing tasks that cannot be automated. Complete these tests to verify the application is production-ready.

**Automated tests completed**: ✅ 79 tests passing
**Coverage**: ✅ 90%+ for business logic
**Bundle size**: ✅ 3.60 KB gzipped (under 10KB target)
**Performance tests**: ✅ All operations < 1ms (under 200ms target)

---

## Section 1: Accessibility Testing (T063-T068)

### T063: Manual Keyboard Testing ⌨️

**Objective**: Verify all functionality is accessible via keyboard only.

**Instructions**:

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Disconnect your mouse** (or simply don't use it)

3. **Test Tab Navigation**:
   - Press `Tab` → Input field should be focused (visible outline)
   - Type a task description
   - Press `Tab` → "Add Task" button should be focused
   - Press `Enter` → Task should be added
   - Press `Tab` → First task's checkbox should be focused
   - Press `Space` → Task should toggle complete/incomplete
   - Press `Tab` → Delete button should be focused
   - Press `Enter` or `Space` → Task should be deleted
   - Continue tabbing through all tasks

4. **Verify Focus Order**:
   - Focus moves logically: input → button → checkboxes → delete buttons
   - No keyboard traps (you can tab through everything and back)
   - All focused elements have visible outline (3px blue outline)

5. **Test All Actions**:
   - ✅ Add task via Enter key
   - ✅ Toggle task via Space on checkbox
   - ✅ Delete task via Enter/Space on delete button
   - ✅ Navigate entire interface with keyboard only

**Pass Criteria**:
- [ ] All interactive elements reachable via Tab
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] All actions work with keyboard (Enter/Space)
- [ ] Focus visible on all elements (3px outline)
- [ ] No keyboard traps

---

### T064: Screen Reader Testing 🔊

**Objective**: Verify task states are announced correctly by screen readers.

**macOS VoiceOver Instructions**:

1. **Enable VoiceOver**:
   - Press `Cmd + F5` (or System Settings → Accessibility → VoiceOver)

2. **Start the app**:
   ```bash
   npm run dev
   ```

3. **Test Announcements**:
   - Navigate with `Control + Option + Arrow Keys`
   - Listen for these announcements:

   **Expected Announcements**:
   - Input field: "Task Description, edit text"
   - Character counter: "500 characters remaining" (updates live)
   - Add button: "Add Task, button"
   - Task count: "3 tasks, 1 completed" (updates live)
   - Task list: "Task list, list, 3 items"
   - Checkbox: "Mark 'Buy groceries' as complete, unchecked, checkbox"
   - Completed checkbox: "Mark 'Buy groceries' as incomplete, checked, checkbox"
   - Delete button: "Delete task 'Buy groceries', button"
   - Empty state: "No tasks yet. Add one above to get started!"
   - Error toast: "Description must be 1-500 characters, alert" (when error occurs)

4. **Test Dynamic Updates**:
   - Add a task → Hear task count update
   - Toggle task → Hear checkbox state change
   - Delete task → Hear task count update
   - Clear all tasks → Hear empty state message

5. **Disable VoiceOver**: `Cmd + F5`

**Windows NVDA/JAWS** (if available):
- Similar testing flow
- Use `Insert + Down Arrow` to navigate

**Pass Criteria**:
- [ ] All form fields announced correctly
- [ ] Task list announced with item count
- [ ] Checkbox states announced (checked/unchecked)
- [ ] Delete button purpose clear
- [ ] Dynamic updates announced (aria-live regions work)
- [ ] Error messages announced immediately

---

### T067: axe DevTools Accessibility Scan 🔍

**Objective**: Automated accessibility scan with 0 violations.

**Instructions**:

1. **Install axe DevTools**:
   - Chrome: [axe DevTools Extension](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
   - Firefox: [axe DevTools Extension](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/)

2. **Run the app**:
   ```bash
   npm run dev
   ```

3. **Open DevTools**:
   - Press `F12` or `Cmd + Option + I`
   - Navigate to "axe DevTools" tab

4. **Run Scan**:
   - Click "Scan ALL of my page"
   - Wait for results

5. **Review Results**:
   - Target: **0 violations**
   - If violations found, review and fix

**Common Issues to Check**:
- Color contrast ratios
- Missing ARIA labels
- Improper heading structure
- Missing alt text (not applicable for this app)

**Pass Criteria**:
- [ ] 0 Critical violations
- [ ] 0 Serious violations
- [ ] 0 Moderate violations
- [ ] Optional: 0 Minor violations

---

### T068: Lighthouse Accessibility Audit 💡

**Objective**: Achieve 100% Lighthouse accessibility score.

**Instructions**:

1. **Build production version**:
   ```bash
   npm run build
   npm run preview
   ```
   - Note the preview URL (usually `http://localhost:4173`)

2. **Open Chrome DevTools**:
   - Press `F12`
   - Navigate to "Lighthouse" tab

3. **Configure Audit**:
   - Mode: Navigation
   - Device: Desktop (or Mobile for mobile testing)
   - Categories: ✅ Accessibility only (uncheck others for faster scan)
   - Click "Analyze page load"

4. **Review Results**:
   - Target: **100% Accessibility score**
   - Review detailed diagnostics
   - Check passed audits and opportunities

5. **Common Checks**:
   - ARIA attributes valid
   - Color contrast sufficient
   - Form elements have labels
   - Buttons have accessible names
   - Lists are properly structured

**Pass Criteria**:
- [ ] Accessibility score: 100%
- [ ] All audits passed
- [ ] No manual checks needed

---

## Section 2: Error Handling Testing (T071)

### T071: Error Scenario Testing 🚨

**Objective**: Verify all error scenarios handled gracefully.

**Instructions**:

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Test 1: Corrupted localStorage**:
   - Open DevTools → Application tab → Local Storage
   - Find key `todos`
   - Double-click value and change to: `{invalid json}`
   - Refresh page
   - **Expected**: App loads with empty task list (corrupted data ignored)
   - **Expected**: Console shows: "Error loading tasks from localStorage"

3. **Test 2: Invalid Task Operations**:
   - Open Console tab
   - Try deleting non-existent task:
     ```javascript
     import { deleteTask } from '/src/tasks.js';
     deleteTask('non-existent-id');
     ```
   - **Expected**: Error toast: "Task not found"
   - **Expected**: No app crash

4. **Test 3: Empty Description**:
   - Leave input field empty
   - Click "Add Task"
   - **Expected**: Error toast: "Description must be 1-500 characters"

5. **Test 4: Description Too Long**:
   - Type 501 characters (but input maxlength prevents this)
   - **Expected**: Input stops at 500 characters

6. **Test 5: Task Limit**:
   - Add 100 tasks (use console script):
     ```javascript
     for (let i = 0; i < 100; i++) {
       document.querySelector('#task-input').value = `Task ${i + 1}`;
       document.querySelector('#add-task-form').dispatchEvent(new Event('submit'));
     }
     ```
   - Try adding 101st task
   - **Expected**: Error toast: "Task limit (100) reached"

7. **Test 6: Unsupported Browser** (manual simulation):
   - Open Console
   - Type: `delete window.crypto`
   - Refresh page
   - **Expected**: Alert: "Your browser does not support crypto.randomUUID()"
   - **Expected**: App does not load

8. **Test 7: Global Error Handler**:
   - Open Console
   - Type: `throw new Error('Test error')`
   - **Expected**: Error logged to console
   - **Expected**: App continues working (no crash)

**Pass Criteria**:
- [ ] Corrupted localStorage handled gracefully
- [ ] Invalid operations show error messages
- [ ] Browser support checks prevent app load on unsupported browsers
- [ ] Global error handler prevents crashes
- [ ] All errors logged to console for debugging
- [ ] User sees helpful error messages (not technical jargon)

---

## Section 3: Performance Testing (T074-T075)

### T074: Manual Browser Performance Test ⚡

**Objective**: Verify UI remains responsive with 100 tasks.

**Instructions**:

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Clear existing tasks**: Delete all tasks

3. **Add 100 tasks programmatically**:
   - Open Console tab
   - Paste and run:
     ```javascript
     for (let i = 0; i < 100; i++) {
       document.querySelector('#task-input').value = `Task ${i + 1}`;
       document.querySelector('#add-task-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
     }
     ```

4. **Test UI Responsiveness**:
   - Scroll through task list → Should be smooth
   - Toggle several tasks → Immediate visual feedback
   - Delete several tasks → Immediate removal
   - Add more tasks → Instant rendering
   - Refresh browser → Fast load (< 1 second)

5. **Observe Performance**:
   - No lag or stuttering
   - Animations smooth
   - No "janky" scrolling
   - Fast interactions

**Pass Criteria**:
- [ ] 100 tasks render without noticeable delay
- [ ] UI remains responsive (no lag)
- [ ] Smooth scrolling
- [ ] Instant feedback on all actions
- [ ] Page refresh loads quickly

---

### T075: Chrome DevTools Performance Profiling 📊

**Objective**: Profile app performance and verify no bottlenecks.

**Instructions**:

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Open DevTools Performance Tab**:
   - Press `F12` → Performance tab
   - Click "Record" button (●)

3. **Perform Actions**:
   - Add 5 tasks manually
   - Toggle 3 tasks
   - Delete 2 tasks
   - Stop recording (●)

4. **Analyze Flame Graph**:
   - Look for long tasks (yellow/red bars)
   - Check "Main" thread for bottlenecks
   - Verify render times < 50ms per operation

5. **Check Metrics**:
   - **Scripting**: Should be minimal (< 10ms per action)
   - **Rendering**: Should be fast (< 20ms per render)
   - **Painting**: Should be quick (< 10ms)
   - **Total**: < 50ms per user action

6. **Advanced: Test with 100 Tasks**:
   - Clear tasks
   - Click "Record"
   - Run console script to add 100 tasks:
     ```javascript
     const start = performance.now();
     for (let i = 0; i < 100; i++) {
       document.querySelector('#task-input').value = `Task ${i + 1}`;
       document.querySelector('#add-task-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
     }
     const end = performance.now();
     console.log(`Total time: ${end - start}ms`);
     ```
   - Stop recording
   - Verify no red/yellow long tasks

**Pass Criteria**:
- [ ] No long tasks (> 50ms) in flame graph
- [ ] Render time < 50ms per operation
- [ ] No forced reflows or layout thrashing
- [ ] Smooth 60fps animations

---

## Section 4: Visual & Color Testing (T079-T080)

### T079: Color Contrast Verification 🎨

**Objective**: Verify all text meets WCAG 2.2 AA contrast ratio (4.5:1).

**Instructions**:

1. **Use WebAIM Contrast Checker**:
   - Open: https://webaim.org/resources/contrastchecker/

2. **Test Primary Colors**:

   **Test 1: Primary Button**
   - Foreground: `#FFFFFF` (white text)
   - Background: `#007BFF` (blue button)
   - **Expected Ratio**: ≥ 4.5:1 for normal text
   - **Result**: ___ : 1 (pass/fail)

   **Test 2: Delete Button**
   - Foreground: `#DC3545` (red text)
   - Background: `#FFFFFF` (white background)
   - **Expected Ratio**: ≥ 4.5:1
   - **Result**: ___ : 1 (pass/fail)

   **Test 3: Body Text**
   - Foreground: `#333333` (dark gray)
   - Background: `#FFFFFF` (white)
   - **Expected Ratio**: ≥ 4.5:1
   - **Result**: ___ : 1 (pass/fail)

   **Test 4: Character Counter (Low)**
   - Foreground: `#DC3545` (red - when < 50 chars)
   - Background: `#FFFFFF` (white)
   - **Expected Ratio**: ≥ 4.5:1
   - **Result**: ___ : 1 (pass/fail)

   **Test 5: Empty State Text**
   - Foreground: `#666666` (gray)
   - Background: `#FFFFFF` (white)
   - **Expected Ratio**: ≥ 4.5:1
   - **Result**: ___ : 1 (pass/fail)

3. **Alternative: Use Browser DevTools**:
   - Inspect element
   - Check "Accessibility" pane
   - Look for contrast warnings

**Pass Criteria**:
- [ ] All contrast ratios ≥ 4.5:1 (AA standard)
- [ ] No contrast warnings in browser DevTools
- [ ] Text readable on all backgrounds

---

### T080: Color Blindness Testing 👁️

**Objective**: Verify app is usable for users with color vision deficiencies.

**Instructions**:

1. **Open App**:
   ```bash
   npm run dev
   ```

2. **Open Chrome DevTools**:
   - Press `F12`
   - Click "⋮" (three dots) → More tools → Rendering

3. **Test Vision Deficiencies**:

   **Test 1: Protanopia (Red-Blind)**
   - Rendering tab → Emulate vision deficiencies → Protanopia
   - **Check**:
     - [ ] Delete button still visible (not relying on red color alone)
     - [ ] Error messages readable
     - [ ] Task states distinguishable (completed vs incomplete)

   **Test 2: Deuteranopia (Green-Blind)**
   - Emulate vision deficiencies → Deuteranopia
   - **Check**:
     - [ ] All UI elements visible
     - [ ] No information conveyed by color alone
     - [ ] Buttons distinguishable by shape/text

   **Test 3: Tritanopia (Blue-Blind)**
   - Emulate vision deficiencies → Tritanopia
   - **Check**:
     - [ ] Primary button still visible
     - [ ] Links/buttons distinguishable
     - [ ] Task list readable

   **Test 4: Achromatopsia (No Color)**
   - Emulate vision deficiencies → Achromatopsia
   - **Check**:
     - [ ] All functionality works in grayscale
     - [ ] Completed tasks distinguishable (strikethrough helps)
     - [ ] Buttons have sufficient contrast

4. **Key Principle**: Information should NOT rely on color alone
   - ✅ Completed tasks: Strikethrough + checkbox (not just color)
   - ✅ Delete button: "×" symbol + label (not just red color)
   - ✅ Errors: Toast + icon + text (not just background color)

**Pass Criteria**:
- [ ] App fully functional in all 4 vision deficiency modes
- [ ] No information conveyed by color alone
- [ ] Text/icons provide redundant cues
- [ ] All interactive elements identifiable

---

## Section 5: Final Validation (T084-T085)

### T084: Quickstart.md Validation ✅

**Objective**: Verify quickstart guide instructions are accurate.

**Instructions**:

1. **Follow each step in `quickstart.md`**:
   - Verify prerequisites section is accurate
   - Test all commands in "Development Commands" section
   - Ensure expected outputs match actual outputs
   - Check TDD workflow example is correct

2. **Test All Commands**:
   ```bash
   # Verify these work
   npm test
   npm test -- --watch
   npm test -- tests/unit/tasks.test.js
   npm run test:coverage
   npm run dev
   npm run build
   npm run preview
   ```

3. **Check Documentation Links**:
   - All internal links work (spec.md, plan.md, etc.)
   - No broken references

4. **Update if Needed**:
   - If any commands changed, update quickstart.md
   - If new commands added, document them

**Pass Criteria**:
- [ ] All commands in quickstart.md work correctly
- [ ] Expected outputs match actual outputs
- [ ] No broken links
- [ ] Documentation is up-to-date

---

### T085: End-to-End Manual Testing 🎯

**Objective**: Verify all user stories work end-to-end in the browser.

**Instructions**:

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Test User Story 1: Add Task**:
   - [ ] Type "Buy groceries" in input
   - [ ] Click "Add Task"
   - [ ] **Verify**: Task appears in list
   - [ ] **Verify**: Input is cleared
   - [ ] **Verify**: Character counter resets to "500 characters remaining"
   - [ ] **Verify**: Task count shows "1 task, 0 completed"

3. **Test User Story 2: Mark Complete**:
   - [ ] Click checkbox on "Buy groceries"
   - [ ] **Verify**: Task has strikethrough
   - [ ] **Verify**: Checkbox is checked
   - [ ] **Verify**: Task count shows "1 task, 1 completed"
   - [ ] Click checkbox again
   - [ ] **Verify**: Strikethrough removed
   - [ ] **Verify**: Task count shows "1 task, 0 completed"

4. **Test User Story 3: View All Tasks**:
   - [ ] Add 3 more tasks: "Walk dog", "Read book", "Cook dinner"
   - [ ] **Verify**: All 4 tasks visible
   - [ ] **Verify**: Newest task appears first (Cook dinner → Read book → Walk dog → Buy groceries)
   - [ ] **Verify**: Task count shows "4 tasks, 0 completed"
   - [ ] Toggle 2 tasks complete
   - [ ] **Verify**: Task count shows "4 tasks, 2 completed"

5. **Test User Story 4: Delete Task**:
   - [ ] Click delete button (×) on "Read book"
   - [ ] **Verify**: Task removed from list
   - [ ] **Verify**: Task count shows "3 tasks, X completed"
   - [ ] Delete all remaining tasks
   - [ ] **Verify**: Empty state appears: "No tasks yet. Add one above to get started!"
   - [ ] **Verify**: Task count is hidden

6. **Test Persistence**:
   - [ ] Add 3 tasks
   - [ ] Toggle 1 task complete
   - [ ] Refresh browser (F5)
   - [ ] **Verify**: All 3 tasks still present
   - [ ] **Verify**: Completed task still checked
   - [ ] **Verify**: Task order preserved (newest first)

7. **Test Edge Cases**:
   - [ ] Try submitting empty task → Error: "Description must be 1-500 characters"
   - [ ] Type 500 characters → Character counter: "0 characters remaining" (red)
   - [ ] Type 501st character → Input stops at 500 (maxlength)
   - [ ] Whitespace-only task → Error: "Description must be 1-500 characters"

8. **Test Visual Polish**:
   - [ ] Add task → Task fades in smoothly
   - [ ] Toggle checkbox → Checkbox scales up briefly
   - [ ] Error message → Toast slides in from right
   - [ ] Hover over task → Background changes to light gray
   - [ ] Hover over delete button → Background turns red, text turns white

9. **Test Responsive Design** (resize browser):
   - [ ] Resize to mobile width (< 600px)
   - [ ] **Verify**: Touch targets ≥ 44×44px (checkboxes, delete buttons)
   - [ ] **Verify**: Layout adjusts properly
   - [ ] **Verify**: Text wraps correctly

**Pass Criteria**:
- [ ] All user stories work correctly
- [ ] Persistence works after refresh
- [ ] Edge cases handled properly
- [ ] Visual polish present (animations, hover states)
- [ ] Responsive design works
- [ ] No console errors

---

## Section 6: Production Build Verification

**Final Check Before Release** 🚀

1. **Run Full Test Suite**:
   ```bash
   npm test
   ```
   - **Expected**: 79 tests pass

2. **Generate Coverage Report**:
   ```bash
   npm run test:coverage
   ```
   - **Expected**: 90%+ coverage for tasks.js, storage.js

3. **Build Production Bundle**:
   ```bash
   npm run build
   ```
   - **Expected**: dist/ folder created
   - **Expected**: Total gzipped size < 10KB (currently ~3.6KB)

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```
   - Test all functionality in production build
   - Verify no errors in console

5. **Check Bundle Contents**:
   ```bash
   ls -lh dist/assets/
   ```
   - Verify files are minified (hash in filename)
   - Verify reasonable file sizes

---

## Completion Checklist

Mark each section as you complete it:

### Accessibility
- [ ] T063: Manual keyboard testing complete
- [ ] T064: Screen reader testing complete
- [ ] T067: axe DevTools scan passed (0 violations)
- [ ] T068: Lighthouse accessibility score 100%

### Error Handling
- [ ] T071: All error scenarios tested

### Performance
- [ ] T074: Manual browser performance test passed
- [ ] T075: Chrome DevTools profiling complete

### Visual & Color
- [ ] T079: Color contrast verification passed (all ≥ 4.5:1)
- [ ] T080: Color blindness testing passed

### Final Validation
- [ ] T084: Quickstart.md validated
- [ ] T085: End-to-end manual testing complete

### Production Build
- [ ] Full test suite passes
- [ ] Coverage ≥ 90%
- [ ] Production build successful
- [ ] Bundle size < 10KB gzipped

---

## Results Summary

**Date Completed**: ___________

**Tester Name**: ___________

**Overall Status**: ☐ Pass  ☐ Fail

**Issues Found**: (List any issues discovered during testing)

1. _______________________________
2. _______________________________
3. _______________________________

**Notes**:
___________________________________________
___________________________________________
___________________________________________

---

## Next Steps After Testing

Once all tests pass:

1. **Update tasks.md**: Mark all manual tasks as [X] complete
2. **Commit changes**:
   ```bash
   git add .
   git commit -m "Complete manual testing - all tasks verified"
   ```
3. **Create completion report** (optional)
4. **Merge to main** or **deploy to production**

---

**Questions?** Refer to [quickstart.md](./quickstart.md) for troubleshooting.
