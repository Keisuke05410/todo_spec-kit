/**
 * Utility functions
 */

/**
 * Generate a unique identifier using crypto.randomUUID()
 * @returns {string} UUID v4 string
 */
export function generateUUID() {
  return crypto.randomUUID();
}
