/**
 * Application entry point
 */

import { addTask, getAllTasks } from './tasks.js';
import { renderTasks, setupEventListeners } from './ui.js';

/**
 * Check browser support for required features
 * @returns {boolean} True if browser is supported
 */
function checkBrowserSupport() {
  // Check for localStorage
  if (typeof Storage === 'undefined') {
    alert('Your browser does not support localStorage. This application requires localStorage to function.');
    return false;
  }

  // Check for crypto.randomUUID
  if (!crypto || typeof crypto.randomUUID !== 'function') {
    alert('Your browser does not support crypto.randomUUID(). Please use a modern browser (Chrome 92+, Firefox 95+, Safari 15.4+).');
    return false;
  }

  return true;
}

/**
 * Initialize the application
 */
function main() {
  // Check browser support
  if (!checkBrowserSupport()) {
    return;
  }

  // Set up event listeners
  setupEventListeners(addTask);

  // Load and render initial tasks
  const tasks = getAllTasks();
  renderTasks(tasks);

  console.log('Todo app initialized');
}

// Global error handler to catch unhandled exceptions
window.addEventListener('error', (event) => {
  console.error('Unhandled error:', event.error);
  // Prevent app crash by catching the error
  // Log for debugging purposes
});

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
