import { describe, it, expect } from 'vitest';
import { applyGridSnap, layoutRow, layoutGrid, layoutLayers, layoutLifelines, HORIZONTAL_SPACING, VERTICAL_SPACING, CANVAS_MARGIN } from '../builder/layout-engine.js';

describe('applyGridSnap', () => {
  it('should snap to nearest 8px grid', () => {
    expect(applyGridSnap(13)).toBe(16);
    expect(applyGridSnap(10)).toBe(8);
    expect(applyGridSnap(16)).toBe(16);
    expect(applyGridSnap(0)).toBe(0);
  });

  it('should snap to custom grid size', () => {
    expect(applyGridSnap(55, 10)).toBe(60);
    expect(applyGridSnap(12, 5)).toBe(10);
  });
});

describe('layoutRow', () => {
  it('should distribute nodes evenly', () => {
    const positions = layoutRow(3, 160, 100);
    expect(positions).toHaveLength(3);
    expect(positions[0].y).toBe(applyGridSnap(100));
    // All x positions should be >= CANVAS_MARGIN
    for (const p of positions) {
      expect(p.x).toBeGreaterThanOrEqual(CANVAS_MARGIN);
    }
  });

  it('should handle single node', () => {
    const positions = layoutRow(1, 160, 50);
    expect(positions).toHaveLength(1);
    expect(positions[0].x).toBe(CANVAS_MARGIN);
  });
});

describe('layoutLayers', () => {
  it('should create layers with correct vertical spacing', () => {
    const positions = layoutLayers([2, 3], 160, 60);
    expect(positions).toHaveLength(2);
    expect(positions[0]).toHaveLength(2);
    expect(positions[1]).toHaveLength(3);
    // Second layer should be below first
    expect(positions[1][0].y).toBeGreaterThan(positions[0][0].y);
  });
});

describe('layoutLifelines', () => {
  it('should space lifelines evenly', () => {
    const xs = layoutLifelines(4);
    expect(xs).toHaveLength(4);
    // Each lifeline should be spaced apart
    for (let i = 1; i < xs.length; i++) {
      expect(xs[i]).toBeGreaterThan(xs[i - 1]);
    }
  });

  it('should handle single lifeline', () => {
    const xs = layoutLifelines(1);
    expect(xs).toHaveLength(1);
  });
});

describe('layoutGrid', () => {
  it('should create a rows x cols grid', () => {
    const grid = layoutGrid(2, 3, 160, 60);
    expect(grid).toHaveLength(2);
    expect(grid[0]).toHaveLength(3);
    expect(grid[1]).toHaveLength(3);
  });
});
