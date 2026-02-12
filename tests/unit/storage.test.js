import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadTasks, saveTasks } from '../../src/storage.js';

describe('Storage Module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadTasks()', () => {
    it('should return empty array when localStorage is empty', () => {
      const tasks = loadTasks();
      expect(tasks).toEqual([]);
    });

    it('should return parsed tasks from localStorage', () => {
      const mockTasks = [
        { id: '1', description: 'Test task', completed: false, createdAt: Date.now() }
      ];
      localStorage.setItem('tasks', JSON.stringify(mockTasks));

      const tasks = loadTasks();
      expect(tasks).toEqual(mockTasks);
    });

    it('should return empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('tasks', 'invalid json{]');

      const tasks = loadTasks();
      expect(tasks).toEqual([]);
    });

    it('should return empty array when localStorage contains null', () => {
      localStorage.setItem('tasks', 'null');

      const tasks = loadTasks();
      expect(tasks).toEqual([]);
    });

    it('should return empty array when localStorage value is not an array', () => {
      localStorage.setItem('tasks', JSON.stringify({ tasks: [] }));

      const tasks = loadTasks();
      expect(tasks).toEqual([]);
    });
  });

  describe('saveTasks()', () => {
    it('should save empty array to localStorage', () => {
      saveTasks([]);

      const stored = localStorage.getItem('tasks');
      expect(stored).toBe('[]');
    });

    it('should save tasks array to localStorage', () => {
      const tasks = [
        { id: '1', description: 'Test task', completed: false, createdAt: Date.now() }
      ];

      saveTasks(tasks);

      const stored = JSON.parse(localStorage.getItem('tasks'));
      expect(stored).toEqual(tasks);
    });

    it('should overwrite existing tasks in localStorage', () => {
      localStorage.setItem('tasks', JSON.stringify([{ id: '1' }]));

      const newTasks = [
        { id: '2', description: 'New task', completed: false, createdAt: Date.now() }
      ];
      saveTasks(newTasks);

      const stored = JSON.parse(localStorage.getItem('tasks'));
      expect(stored).toEqual(newTasks);
    });

    it('should handle multiple tasks', () => {
      const tasks = [
        { id: '1', description: 'Task 1', completed: false, createdAt: Date.now() },
        { id: '2', description: 'Task 2', completed: true, createdAt: Date.now() },
        { id: '3', description: 'Task 3', completed: false, createdAt: Date.now() }
      ];

      saveTasks(tasks);

      const stored = JSON.parse(localStorage.getItem('tasks'));
      expect(stored).toEqual(tasks);
      expect(stored).toHaveLength(3);
    });

    // Note: QuotaExceededError testing is deferred to integration/manual testing
    // as localStorage mock doesn't support error simulation
  });
});
