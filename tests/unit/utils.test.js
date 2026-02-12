import { describe, it, expect } from 'vitest';
import { generateUUID } from '../../src/utils.js';

describe('Utils Module', () => {
  describe('generateUUID()', () => {
    it('should generate a valid UUID v4 format', () => {
      const uuid = generateUUID();

      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();

      expect(uuid1).not.toBe(uuid2);
    });

    it('should return a string', () => {
      const uuid = generateUUID();
      expect(typeof uuid).toBe('string');
    });

    it('should generate UUIDs with correct length (36 characters)', () => {
      const uuid = generateUUID();
      expect(uuid).toHaveLength(36);
    });
  });
});
