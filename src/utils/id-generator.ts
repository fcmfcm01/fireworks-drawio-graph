/**
 * Unique ID generator for mxCell elements.
 * draw.io requires unique IDs for all cells.
 * IDs "0" and "1" are reserved (root cells).
 */

let counter = 2; // Start from 2 (0 and 1 are reserved for root cells)

/**
 * Reset the ID counter (useful for testing or starting a fresh diagram).
 */
export function resetIdCounter(): void {
  counter = 2;
}

/**
 * Generate the next unique numeric ID.
 * Starts from 2 (0 and 1 are reserved for root cells in mxGraphModel).
 */
export function nextId(): string {
  return String(counter++);
}

/**
 * Generate a prefixed ID for readability.
 * Example: nextPrefixedId('node') => 'node-1'
 */
export function nextPrefixedId(prefix: string): string {
  return `${prefix}-${counter++}`;
}

/**
 * Generate a batch of IDs in one call.
 */
export function generateIds(count: number, prefix?: string): string[] {
  const ids: string[] = [];
  for (let i = 0; i < count; i++) {
    ids.push(prefix ? nextPrefixedId(prefix) : nextId());
  }
  return ids;
}
