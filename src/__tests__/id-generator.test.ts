import { describe, it, expect, beforeEach } from 'vitest';
import { nextId, nextPrefixedId, generateIds, resetIdCounter } from '../utils/id-generator.js';

describe('id-generator', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  it('should start from 2 (0 and 1 reserved)', () => {
    expect(nextId()).toBe('2');
  });

  it('should increment sequentially', () => {
    expect(nextId()).toBe('2');
    expect(nextId()).toBe('3');
    expect(nextId()).toBe('4');
  });

  it('should generate prefixed IDs', () => {
    expect(nextPrefixedId('node')).toBe('node-2');
    expect(nextPrefixedId('edge')).toBe('edge-3');
  });

  it('should generate a batch of IDs', () => {
    const ids = generateIds(5);
    expect(ids).toEqual(['2', '3', '4', '5', '6']);
  });

  it('should generate prefixed batch', () => {
    const ids = generateIds(3, 'cell');
    expect(ids).toEqual(['cell-2', 'cell-3', 'cell-4']);
  });

  it('should reset counter', () => {
    nextId(); // 2
    nextId(); // 3
    resetIdCounter();
    expect(nextId()).toBe('2');
  });
});
