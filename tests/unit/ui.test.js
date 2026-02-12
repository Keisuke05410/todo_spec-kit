import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderTasks, showError, showEmptyState, setupEventListeners } from '../../src/ui.js';

describe('UI Module', () => {
  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <div id="task-list"></div>
      <div id="empty-state" hidden></div>
      <div id="error-container"></div>
      <div id="task-count"></div>
      <form id="add-task-form">
        <input type="text" id="task-input" />
        <span id="char-counter"></span>
        <button type="submit">Add Task</button>
      </form>
    `;
  });

  describe('renderTasks()', () => {
    it('should render tasks to DOM', () => {
      const tasks = [
        { id: '1', description: 'Task 1', completed: false, createdAt: Date.now() },
        { id: '2', description: 'Task 2', completed: true, createdAt: Date.now() }
      ];

      renderTasks(tasks);

      const taskList = document.getElementById('task-list');
      expect(taskList.children.length).toBe(2);
    });

    it('should use textContent for XSS safety', () => {
      const tasks = [
        { id: '1', description: '<script>alert("xss")</script>', completed: false, createdAt: Date.now() }
      ];

      renderTasks(tasks);

      const taskList = document.getElementById('task-list');
      expect(taskList.textContent).toContain('<script>');
      expect(taskList.querySelector('script')).toBeNull();
    });

    it('should render empty list when tasks array is empty', () => {
      renderTasks([]);

      const taskList = document.getElementById('task-list');
      expect(taskList.children.length).toBe(0);
    });

    it('should clear existing tasks before rendering', () => {
      // Add initial tasks
      renderTasks([
        { id: '1', description: 'Task 1', completed: false, createdAt: Date.now() }
      ]);

      // Render new set of tasks
      renderTasks([
        { id: '2', description: 'Task 2', completed: false, createdAt: Date.now() },
        { id: '3', description: 'Task 3', completed: false, createdAt: Date.now() }
      ]);

      const taskList = document.getElementById('task-list');
      expect(taskList.children.length).toBe(2);
    });

    it('should apply completed class to completed tasks', () => {
      const tasks = [
        { id: '1', description: 'Completed', completed: true, createdAt: Date.now() }
      ];

      renderTasks(tasks);

      const taskList = document.getElementById('task-list');
      const taskItem = taskList.children[0];
      expect(taskItem.classList.contains('completed')).toBe(true);
    });

    it('should show empty state when tasks array is empty', () => {
      renderTasks([]);

      const emptyState = document.getElementById('empty-state');
      expect(emptyState.hidden).toBe(false);

      const taskList = document.getElementById('task-list');
      expect(taskList.children.length).toBe(0);
    });
  });

  describe('showError()', () => {
    it('should display error message in error container', () => {
      showError('Test error message');

      const errorContainer = document.getElementById('error-container');
      expect(errorContainer.textContent).toContain('Test error message');
    });

    it('should add role="alert" for screen readers', () => {
      showError('Test error');

      const errorContainer = document.getElementById('error-container');
      const errorElement = errorContainer.firstElementChild;
      expect(errorElement.getAttribute('role')).toBe('alert');
    });

    it('should auto-remove error after 5 seconds', () => {
      vi.useFakeTimers();

      showError('Temporary error');

      const errorContainer = document.getElementById('error-container');
      expect(errorContainer.children.length).toBe(1);

      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000);

      expect(errorContainer.children.length).toBe(0);

      vi.useRealTimers();
    });

    it('should handle multiple errors', () => {
      showError('Error 1');
      showError('Error 2');

      const errorContainer = document.getElementById('error-container');
      expect(errorContainer.children.length).toBe(2);
    });
  });

  describe('showEmptyState()', () => {
    it('should show empty state message', () => {
      showEmptyState();

      const emptyState = document.getElementById('empty-state');
      expect(emptyState.hidden).toBe(false);
    });

    it('should hide task list when showing empty state', () => {
      showEmptyState();

      const taskList = document.getElementById('task-list');
      expect(taskList.children.length).toBe(0);
    });
  });

  describe('setupEventListeners()', () => {
    it('should handle form submit event', () => {
      const mockAddTask = vi.fn();
      setupEventListeners(mockAddTask);

      const form = document.getElementById('add-task-form');
      const input = document.getElementById('task-input');
      input.value = 'New task';

      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      // Form submission should be prevented (no page reload)
      expect(mockAddTask).toHaveBeenCalled();
    });

    it('should clear input after successful task addition', () => {
      const mockAddTask = vi.fn(() => ({ id: '1', description: 'Test', completed: false, createdAt: Date.now() }));
      setupEventListeners(mockAddTask);

      const form = document.getElementById('add-task-form');
      const input = document.getElementById('task-input');
      input.value = 'New task';

      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      expect(input.value).toBe('');
    });

    it('should update character counter on input', () => {
      setupEventListeners();

      const input = document.getElementById('task-input');
      const charCounter = document.getElementById('char-counter');

      input.value = 'Hello';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(charCounter.textContent).toContain('495');
    });

    it('should display error message when task creation fails', () => {
      const mockAddTask = vi.fn(() => {
        throw new Error('Validation error');
      });
      setupEventListeners(mockAddTask);

      const form = document.getElementById('add-task-form');
      const input = document.getElementById('task-input');
      input.value = '';

      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      const errorContainer = document.getElementById('error-container');
      expect(errorContainer.children.length).toBeGreaterThan(0);
    });
  });
});
