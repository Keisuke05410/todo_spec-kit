/**
 * Storage module for localStorage operations
 */

const STORAGE_KEY = 'tasks';

/**
 * Load tasks from localStorage
 * @returns {Array} Array of task objects, or empty array if none found or error
 */
export function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    // Validate that parsed data is an array
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    // Return empty array on any error (invalid JSON, etc.)
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
}

/**
 * Save tasks to localStorage
 * @param {Array} tasks - Array of task objects to save
 * @throws {Error} If storage quota is exceeded
 */
export function saveTasks(tasks) {
  try {
    const json = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded');
    }
    throw error;
  }
}
