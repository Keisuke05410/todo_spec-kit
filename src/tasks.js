/**
 * Task business logic module
 */

import { loadTasks, saveTasks } from './storage.js';
import { generateUUID } from './utils.js';

const MAX_TASKS = 100;

/**
 * Validate task description
 * @param {string} description - Task description to validate
 * @returns {boolean} True if valid (1-500 chars after trim), false otherwise
 */
export function isValidDescription(description) {
  // Check if description is a string
  if (typeof description !== 'string') {
    return false;
  }

  // Trim whitespace and check length
  const trimmed = description.trim();
  return trimmed.length >= 1 && trimmed.length <= 500;
}

/**
 * Add a new task
 * @param {string} description - Task description
 * @returns {Object} Created task object
 * @throws {Error} If description is invalid or task limit reached
 */
export function addTask(description) {
  // Validate description
  if (!isValidDescription(description)) {
    throw new Error('Description must be 1-500 characters');
  }

  // Check task limit
  const existingTasks = loadTasks();
  if (existingTasks.length >= MAX_TASKS) {
    throw new Error(`Task limit (${MAX_TASKS}) reached`);
  }

  // Create new task
  const task = {
    id: generateUUID(),
    description: description.trim(),
    completed: false,
    createdAt: Date.now()
  };

  // Persist to storage
  existingTasks.push(task);
  saveTasks(existingTasks);

  return task;
}

/**
 * Get all tasks sorted by creation date (newest first)
 * @returns {Array} Array of valid task objects
 */
export function getAllTasks() {
  const tasks = loadTasks();

  // Filter out invalid tasks (missing required fields)
  const validTasks = tasks.filter(task =>
    task &&
    typeof task.id === 'string' &&
    typeof task.description === 'string' &&
    typeof task.completed === 'boolean' &&
    typeof task.createdAt === 'number'
  );

  // Sort by createdAt descending (newest first)
  return validTasks.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Toggle task completion status
 * @param {string} taskId - ID of task to toggle
 * @returns {Object} Updated task object
 * @throws {Error} If task not found
 */
export function toggleTask(taskId) {
  const tasks = loadTasks();

  // Find task by ID
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    throw new Error('Task not found');
  }

  // Flip completed status
  task.completed = !task.completed;

  // Persist to storage
  saveTasks(tasks);

  return task;
}

/**
 * Delete a task
 * @param {string} taskId - ID of task to delete
 * @throws {Error} If task not found
 */
export function deleteTask(taskId) {
  const tasks = loadTasks();

  // Find task index
  const index = tasks.findIndex(t => t.id === taskId);

  if (index === -1) {
    throw new Error('Task not found');
  }

  // Remove task from array
  tasks.splice(index, 1);

  // Persist to storage
  saveTasks(tasks);
}
