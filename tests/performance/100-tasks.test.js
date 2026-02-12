/**
 * Performance tests for handling 100 tasks
 * Verifies SC-006: All operations complete in under 200ms
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { addTask, getAllTasks, toggleTask, deleteTask } from '../../src/tasks.js';

describe('Performance: 100 Tasks', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates 100 tasks without degradation', () => {
    for (let i = 0; i < 100; i++) {
      addTask(`Task ${i + 1}`);
    }
    expect(getAllTasks()).toHaveLength(100);
  });

  it('getAllTasks completes in under 200ms with 100 tasks (SC-006)', () => {
    // Create 100 tasks
    for (let i = 0; i < 100; i++) {
      addTask(`Task ${i + 1}`);
    }

    // Measure execution time
    const start = performance.now();
    const tasks = getAllTasks();
    const end = performance.now();
    const duration = end - start;

    console.log(`getAllTasks() with 100 tasks: ${duration.toFixed(2)}ms`);

    expect(tasks).toHaveLength(100);
    expect(duration).toBeLessThan(200);
  });

  it('addTask completes in under 200ms with 99 existing tasks', () => {
    // Create 99 tasks
    for (let i = 0; i < 99; i++) {
      addTask(`Task ${i + 1}`);
    }

    // Measure execution time for adding 100th task
    const start = performance.now();
    addTask('Task 100');
    const end = performance.now();
    const duration = end - start;

    console.log(`addTask() with 99 existing tasks: ${duration.toFixed(2)}ms`);

    expect(duration).toBeLessThan(200);
    expect(getAllTasks()).toHaveLength(100);
  });

  it('toggleTask completes in under 200ms with 100 tasks', () => {
    // Create 100 tasks
    for (let i = 0; i < 100; i++) {
      addTask(`Task ${i + 1}`);
    }

    const tasks = getAllTasks();
    const middleTaskId = tasks[50].id;

    // Measure execution time
    const start = performance.now();
    toggleTask(middleTaskId);
    const end = performance.now();
    const duration = end - start;

    console.log(`toggleTask() with 100 tasks: ${duration.toFixed(2)}ms`);

    expect(duration).toBeLessThan(200);
  });

  it('deleteTask completes in under 200ms with 100 tasks', () => {
    // Create 100 tasks
    for (let i = 0; i < 100; i++) {
      addTask(`Task ${i + 1}`);
    }

    const tasks = getAllTasks();
    const middleTaskId = tasks[50].id;

    // Measure execution time
    const start = performance.now();
    deleteTask(middleTaskId);
    const end = performance.now();
    const duration = end - start;

    console.log(`deleteTask() with 100 tasks: ${duration.toFixed(2)}ms`);

    expect(duration).toBeLessThan(200);
    expect(getAllTasks()).toHaveLength(99);
  });

  it('all CRUD operations on 100 tasks complete in reasonable time', () => {
    // Create 100 tasks and measure total time
    const startCreate = performance.now();
    for (let i = 0; i < 100; i++) {
      addTask(`Task ${i + 1}`);
    }
    const endCreate = performance.now();
    const createDuration = endCreate - startCreate;

    // Toggle 50 tasks
    const tasks = getAllTasks();
    const startToggle = performance.now();
    for (let i = 0; i < 50; i++) {
      toggleTask(tasks[i].id);
    }
    const endToggle = performance.now();
    const toggleDuration = endToggle - startToggle;

    // Delete 25 tasks
    const startDelete = performance.now();
    for (let i = 0; i < 25; i++) {
      deleteTask(tasks[i].id);
    }
    const endDelete = performance.now();
    const deleteDuration = endDelete - startDelete;

    console.log(`Create 100 tasks: ${createDuration.toFixed(2)}ms`);
    console.log(`Toggle 50 tasks: ${toggleDuration.toFixed(2)}ms`);
    console.log(`Delete 25 tasks: ${deleteDuration.toFixed(2)}ms`);

    // Verify final state
    const finalTasks = getAllTasks();
    expect(finalTasks).toHaveLength(75);

    // Overall performance should be reasonable (< 1 second for all operations)
    const totalDuration = createDuration + toggleDuration + deleteDuration;
    console.log(`Total time for 175 operations: ${totalDuration.toFixed(2)}ms`);
    expect(totalDuration).toBeLessThan(1000);
  });
});
