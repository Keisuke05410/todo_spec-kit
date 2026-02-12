/**
 * UI rendering and event handlers module
 */

import { getAllTasks, toggleTask, deleteTask } from './tasks.js';

/**
 * Render tasks to the DOM
 * @param {Array} tasks - Array of task objects to render
 */
export function renderTasks(tasks) {
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  const taskCount = document.getElementById('task-count');

  // Clear existing tasks
  taskList.innerHTML = '';

  // Show/hide empty state
  if (tasks.length === 0) {
    showEmptyState();
    taskCount.textContent = '';
    return;
  }

  emptyState.hidden = true;

  // Update task count
  const completedCount = tasks.filter(t => t.completed).length;
  taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}, ${completedCount} completed`;

  // Render each task
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;

    if (task.completed) {
      li.classList.add('completed');
    }

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark "${task.description}" as ${task.completed ? 'incomplete' : 'complete'}`);

    // Description
    const description = document.createElement('span');
    description.className = 'task-description';
    description.textContent = task.description; // Use textContent for XSS safety

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.setAttribute('aria-label', `Delete task "${task.description}"`);
    deleteBtn.type = 'button';

    li.appendChild(checkbox);
    li.appendChild(description);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
export function showError(message) {
  const errorContainer = document.getElementById('error-container');

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-toast';
  errorDiv.setAttribute('role', 'alert');
  errorDiv.textContent = message;

  errorContainer.appendChild(errorDiv);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

/**
 * Show empty state message
 */
export function showEmptyState() {
  const emptyState = document.getElementById('empty-state');
  emptyState.hidden = false;
}

/**
 * Update character counter
 * @param {HTMLInputElement} input - Input element
 * @param {HTMLElement} counter - Counter element
 */
function updateCharacterCounter(input, counter) {
  const remaining = 500 - input.value.length;
  counter.textContent = `${remaining} character${remaining !== 1 ? 's' : ''} remaining`;

  if (remaining < 50) {
    counter.style.color = 'var(--danger-color)';
  } else {
    counter.style.color = '';
  }
}

/**
 * Set up event listeners for the application
 * @param {Function} addTaskFn - Function to call when adding a task
 */
export function setupEventListeners(addTaskFn) {
  const form = document.getElementById('add-task-form');
  const input = document.getElementById('task-input');
  const charCounter = document.getElementById('char-counter');
  const taskList = document.getElementById('task-list');

  // Form submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = input.value.trim();

    try {
      const task = addTaskFn(description);

      // Clear input
      input.value = '';
      updateCharacterCounter(input, charCounter);

      // Refresh task list
      const tasks = getAllTasks();
      renderTasks(tasks);
    } catch (error) {
      showError(error.message);
    }
  });

  // Character counter update
  input.addEventListener('input', () => {
    updateCharacterCounter(input, charCounter);
  });

  // Event delegation for checkboxes and delete buttons
  taskList.addEventListener('click', (e) => {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;

    const taskId = taskItem.dataset.id;

    // Handle checkbox toggle
    if (e.target.type === 'checkbox') {
      try {
        toggleTask(taskId);

        // Refresh task list
        const tasks = getAllTasks();
        renderTasks(tasks);
      } catch (error) {
        showError(error.message);
      }
    }

    // Handle delete button
    if (e.target.classList.contains('delete-btn')) {
      try {
        deleteTask(taskId);

        // Refresh task list
        const tasks = getAllTasks();
        renderTasks(tasks);
      } catch (error) {
        showError(error.message);
      }
    }
  });
}
