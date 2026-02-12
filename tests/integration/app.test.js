import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addTask, getAllTasks, toggleTask, deleteTask } from '../../src/tasks.js';
import { renderTasks, showError, setupEventListeners } from '../../src/ui.js';

describe('Integration: Add Task Flow', () => {
  beforeEach(() => {
    localStorage.clear();

    // Set up DOM
    document.body.innerHTML = `
      <div id="task-list"></div>
      <div id="empty-state" hidden>
        <p>No tasks yet. Add one above to get started!</p>
      </div>
      <div id="error-container"></div>
      <div id="task-count"></div>
      <form id="add-task-form">
        <input type="text" id="task-input" maxlength="500" />
        <span id="char-counter">500 characters remaining</span>
        <button type="submit">Add Task</button>
      </form>
    `;
  });

  it('should complete full add task workflow', () => {
    // Add a task
    const task = addTask('Buy groceries');

    // Verify task structure
    expect(task).toBeDefined();
    expect(task.id).toBeDefined();
    expect(task.description).toBe('Buy groceries');
    expect(task.completed).toBe(false);

    // Verify task is persisted
    const tasks = getAllTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].description).toBe('Buy groceries');

    // Render tasks to DOM
    renderTasks(tasks);

    // Verify DOM update
    const taskList = document.getElementById('task-list');
    expect(taskList.children.length).toBe(1);
    expect(taskList.textContent).toContain('Buy groceries');
  });

  it('should show empty state when no tasks exist', () => {
    const tasks = getAllTasks();
    expect(tasks).toHaveLength(0);

    renderTasks(tasks);

    const emptyState = document.getElementById('empty-state');
    expect(emptyState.hidden).toBe(false);
  });

  it('should hide empty state when tasks are added', () => {
    // Initially empty
    renderTasks([]);
    const emptyState = document.getElementById('empty-state');
    expect(emptyState.hidden).toBe(false);

    // Add task
    const task = addTask('New task');
    const tasks = getAllTasks();
    renderTasks(tasks);

    // Empty state should be hidden
    expect(emptyState.hidden).toBe(true);
  });

  it('should handle form submission and update UI', () => {
    setupEventListeners(addTask);

    const form = document.getElementById('add-task-form');
    const input = document.getElementById('task-input');

    // Enter task description
    input.value = 'Submit via form';

    // Submit form
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    // Verify task was added
    const tasks = getAllTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].description).toBe('Submit via form');

    // Verify input was cleared
    expect(input.value).toBe('');
  });

  it('should display error for invalid input', () => {
    try {
      addTask(''); // Empty description
    } catch (error) {
      showError(error.message);
    }

    const errorContainer = document.getElementById('error-container');
    expect(errorContainer.children.length).toBeGreaterThan(0);
    expect(errorContainer.textContent).toContain('Description must be 1-500 characters');
  });

  it('should maintain tasks across multiple operations', async () => {
    // Add multiple tasks with small delays
    addTask('Task 1');
    await new Promise(resolve => setTimeout(resolve, 5));
    addTask('Task 2');
    await new Promise(resolve => setTimeout(resolve, 5));
    addTask('Task 3');

    // Get all tasks
    const tasks = getAllTasks();
    expect(tasks).toHaveLength(3);

    // Verify order (newest first)
    expect(tasks[0].description).toBe('Task 3');
    expect(tasks[1].description).toBe('Task 2');
    expect(tasks[2].description).toBe('Task 1');

    // Render all tasks
    renderTasks(tasks);

    const taskList = document.getElementById('task-list');
    expect(taskList.children.length).toBe(3);
  });

  it('should persist tasks in localStorage', () => {
    // Add tasks
    addTask('Persistent 1');
    addTask('Persistent 2');

    // Verify localStorage
    const stored = localStorage.getItem('tasks');
    expect(stored).toBeDefined();

    const parsed = JSON.parse(stored);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].description).toBe('Persistent 1');
    expect(parsed[1].description).toBe('Persistent 2');
  });

  it('should handle character counter updates', () => {
    setupEventListeners(addTask);

    const input = document.getElementById('task-input');
    const charCounter = document.getElementById('char-counter');

    // Type in input
    input.value = 'Hello World';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    // Check counter updates
    expect(charCounter.textContent).toContain('489'); // 500 - 11 = 489
  });

  it('should reject tasks exceeding 100 limit', () => {
    // Add 100 tasks
    for (let i = 0; i < 100; i++) {
      addTask(`Task ${i + 1}`);
    }

    // 101st task should fail
    expect(() => addTask('Task 101')).toThrow('Task limit (100) reached');

    const tasks = getAllTasks();
    expect(tasks).toHaveLength(100);
  });

  it('should toggle task completion via checkbox', () => {
    setupEventListeners(addTask);

    const task = addTask('Test task');
    renderTasks(getAllTasks());

    const taskList = document.getElementById('task-list');
    const checkbox = taskList.querySelector('input[type="checkbox"]');
    const taskItem = checkbox.closest('.task-item');

    // Initially incomplete
    expect(checkbox.checked).toBe(false);
    expect(taskItem.classList.contains('completed')).toBe(false);

    // Click checkbox
    checkbox.click();

    // Re-render after toggle
    renderTasks(getAllTasks());

    // Get fresh references after re-render
    const updatedCheckbox = document.querySelector('input[type="checkbox"]');
    const updatedTaskItem = updatedCheckbox.closest('.task-item');

    // Should be completed
    expect(updatedCheckbox.checked).toBe(true);
    expect(updatedTaskItem.classList.contains('completed')).toBe(true);

    // Click again to unmark
    updatedCheckbox.click();
    renderTasks(getAllTasks());

    const finalCheckbox = document.querySelector('input[type="checkbox"]');
    const finalTaskItem = finalCheckbox.closest('.task-item');

    // Should be incomplete again
    expect(finalCheckbox.checked).toBe(false);
    expect(finalTaskItem.classList.contains('completed')).toBe(false);
  });

  it('should persist task completion after page reload', () => {
    const task = addTask('Test task');
    toggleTask(task.id);

    // Simulate page reload by getting fresh data
    const tasks = getAllTasks();
    renderTasks(tasks);

    const checkbox = document.querySelector('input[type="checkbox"]');
    const taskItem = checkbox.closest('.task-item');

    expect(checkbox.checked).toBe(true);
    expect(taskItem.classList.contains('completed')).toBe(true);
  });

  it('should delete task when delete button is clicked', () => {
    setupEventListeners(addTask);

    addTask('Task 1');
    addTask('Task 2');

    let tasks = getAllTasks();
    renderTasks(tasks);

    const taskList = document.getElementById('task-list');
    const initialItems = taskList.querySelectorAll('.task-item');
    expect(initialItems).toHaveLength(2);

    // Get the first task item (Task 2, since sorted newest first)
    const firstTaskItem = initialItems[0];
    const firstTaskDesc = firstTaskItem.querySelector('.task-description').textContent;
    const firstDeleteBtn = firstTaskItem.querySelector('.delete-btn');

    // Click the delete button for the first task
    firstDeleteBtn.click();

    // Get updated tasks after deletion
    tasks = getAllTasks();
    expect(tasks).toHaveLength(1);

    // Re-render and verify
    renderTasks(tasks);
    const updatedItems = taskList.querySelectorAll('.task-item');
    expect(updatedItems).toHaveLength(1);

    // The task that was NOT in the first position should remain
    const remainingTaskDesc = updatedItems[0].querySelector('.task-description').textContent;
    expect(remainingTaskDesc).not.toBe(firstTaskDesc);
  });

  it('should persist task deletion after page reload', () => {
    const task1 = addTask('Task 1');
    const task2 = addTask('Task 2');

    deleteTask(task2.id);

    // Simulate page reload
    const tasks = getAllTasks();
    renderTasks(tasks);

    const taskItems = document.querySelectorAll('.task-item');
    expect(taskItems).toHaveLength(1);

    const taskDesc = taskItems[0].querySelector('.task-description');
    expect(taskDesc.textContent).toBe('Task 1');
  });
});
