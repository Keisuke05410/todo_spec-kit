import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isValidDescription, addTask, getAllTasks, toggleTask, deleteTask } from '../../src/tasks.js';

describe('Tasks Module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('isValidDescription()', () => {
    it('should return true for valid description (1-500 chars)', () => {
      expect(isValidDescription('Valid task')).toBe(true);
      expect(isValidDescription('A')).toBe(true);
      expect(isValidDescription('x'.repeat(500))).toBe(true);
    });

    it('should return false for empty string', () => {
      expect(isValidDescription('')).toBe(false);
    });

    it('should return false for whitespace only', () => {
      expect(isValidDescription('   ')).toBe(false);
      expect(isValidDescription('\t')).toBe(false);
      expect(isValidDescription('\n')).toBe(false);
      expect(isValidDescription('  \n  \t  ')).toBe(false);
    });

    it('should return false for description longer than 500 chars', () => {
      expect(isValidDescription('x'.repeat(501))).toBe(false);
      expect(isValidDescription('x'.repeat(1000))).toBe(false);
    });

    it('should trim whitespace before validating', () => {
      expect(isValidDescription('  Valid task  ')).toBe(true);
      expect(isValidDescription('\n Valid task \n')).toBe(true);
    });

    it('should return false for null or undefined', () => {
      expect(isValidDescription(null)).toBe(false);
      expect(isValidDescription(undefined)).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isValidDescription(123)).toBe(false);
      expect(isValidDescription({})).toBe(false);
      expect(isValidDescription([])).toBe(false);
    });
  });

  describe('addTask()', () => {
    it('should create a new task with valid description', () => {
      const task = addTask('Buy groceries');

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.description).toBe('Buy groceries');
      expect(task.completed).toBe(false);
      expect(task.createdAt).toBeDefined();
      expect(typeof task.createdAt).toBe('number');
    });

    it('should trim whitespace from description', () => {
      const task = addTask('  Trim me  ');
      expect(task.description).toBe('Trim me');
    });

    it('should persist task to storage', () => {
      addTask('Persistent task');

      const stored = JSON.parse(localStorage.getItem('tasks'));
      expect(stored).toHaveLength(1);
      expect(stored[0].description).toBe('Persistent task');
    });

    it('should throw error for invalid description', () => {
      expect(() => addTask('')).toThrow('Description must be 1-500 characters');
      expect(() => addTask('   ')).toThrow('Description must be 1-500 characters');
      expect(() => addTask('x'.repeat(501))).toThrow('Description must be 1-500 characters');
    });

    it('should throw error when task limit (100) is reached', () => {
      // Add 100 tasks
      for (let i = 0; i < 100; i++) {
        addTask(`Task ${i + 1}`);
      }

      // 101st task should fail
      expect(() => addTask('Task 101')).toThrow('Task limit (100) reached');
    });

    it('should generate unique IDs for each task', () => {
      const task1 = addTask('Task 1');
      const task2 = addTask('Task 2');

      expect(task1.id).not.toBe(task2.id);
    });

    it('should add multiple tasks in order', () => {
      addTask('First');
      addTask('Second');
      addTask('Third');

      const tasks = getAllTasks();
      expect(tasks).toHaveLength(3);
    });
  });

  describe('getAllTasks()', () => {
    it('should return empty array when no tasks exist', () => {
      const tasks = getAllTasks();
      expect(tasks).toEqual([]);
    });

    it('should return all tasks from storage', () => {
      addTask('Task 1');
      addTask('Task 2');
      addTask('Task 3');

      const tasks = getAllTasks();
      expect(tasks).toHaveLength(3);
    });

    it('should return tasks sorted by createdAt descending (newest first)', async () => {
      const task1 = addTask('First');
      // Add small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 5));
      const task2 = addTask('Second');
      await new Promise(resolve => setTimeout(resolve, 5));
      const task3 = addTask('Third');

      const tasks = getAllTasks();
      expect(tasks[0].description).toBe('Third');
      expect(tasks[1].description).toBe('Second');
      expect(tasks[2].description).toBe('First');
    });

    it('should filter out invalid tasks (missing required fields)', () => {
      // Manually add invalid task to storage with explicit timestamps
      const now = Date.now();
      localStorage.setItem('tasks', JSON.stringify([
        { id: '1', description: 'Valid', completed: false, createdAt: now },
        { id: '2', description: 'Missing completed field', createdAt: now + 10 },
        { id: '3', completed: false, createdAt: now + 20 }, // Missing description
        { id: '4', description: 'Valid 2', completed: false, createdAt: now + 30 }
      ]));

      const tasks = getAllTasks();
      expect(tasks).toHaveLength(2);
      // Should be sorted newest first
      expect(tasks[0].description).toBe('Valid 2');
      expect(tasks[1].description).toBe('Valid');
    });

    it('should handle empty localStorage gracefully', () => {
      localStorage.clear();
      const tasks = getAllTasks();
      expect(tasks).toEqual([]);
    });
  });

  describe('toggleTask()', () => {
    it('should toggle incomplete task to complete', () => {
      const task = addTask('Test task');
      expect(task.completed).toBe(false);

      const toggledTask = toggleTask(task.id);
      expect(toggledTask.completed).toBe(true);

      // Verify persistence
      const tasks = getAllTasks();
      expect(tasks[0].completed).toBe(true);
    });

    it('should toggle complete task to incomplete', () => {
      const task = addTask('Test task');
      toggleTask(task.id); // Make it complete

      const toggledTask = toggleTask(task.id); // Toggle back
      expect(toggledTask.completed).toBe(false);

      // Verify persistence
      const tasks = getAllTasks();
      expect(tasks[0].completed).toBe(false);
    });

    it('should persist toggle to storage', () => {
      const task = addTask('Test task');
      toggleTask(task.id);

      // Verify by loading fresh from storage
      const tasks = getAllTasks();
      expect(tasks[0].completed).toBe(true);
    });

    it('should throw error if task not found', () => {
      expect(() => toggleTask('non-existent-id')).toThrow('Task not found');
    });

    it('should not affect other tasks when toggling', () => {
      const task1 = addTask('Task 1');
      const task2 = addTask('Task 2');
      const task3 = addTask('Task 3');

      toggleTask(task2.id);

      const tasks = getAllTasks();
      expect(tasks.find(t => t.id === task1.id).completed).toBe(false);
      expect(tasks.find(t => t.id === task2.id).completed).toBe(true);
      expect(tasks.find(t => t.id === task3.id).completed).toBe(false);
    });
  });

  describe('deleteTask()', () => {
    it('should remove task from storage', () => {
      const task = addTask('Test task');
      expect(getAllTasks()).toHaveLength(1);

      deleteTask(task.id);

      const tasks = getAllTasks();
      expect(tasks).toHaveLength(0);
      expect(tasks.find(t => t.id === task.id)).toBeUndefined();
    });

    it('should throw error if task not found', () => {
      expect(() => deleteTask('non-existent-id')).toThrow('Task not found');
    });

    it('should not affect other tasks when deleting', () => {
      const task1 = addTask('Task 1');
      const task2 = addTask('Task 2');
      const task3 = addTask('Task 3');

      deleteTask(task2.id);

      const tasks = getAllTasks();
      expect(tasks).toHaveLength(2);
      expect(tasks.find(t => t.id === task1.id)).toBeDefined();
      expect(tasks.find(t => t.id === task2.id)).toBeUndefined();
      expect(tasks.find(t => t.id === task3.id)).toBeDefined();
    });

    it('should persist deletion to storage', () => {
      const task1 = addTask('Task 1');
      const task2 = addTask('Task 2');

      deleteTask(task1.id);

      // Verify by loading fresh from storage
      const tasks = getAllTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe(task2.id);
    });
  });
});
