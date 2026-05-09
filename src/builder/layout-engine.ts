/**
 * Layout engine - grid snapping and spacing rules.
 *
 * Rules from fireworks-tech-graph:
 * - Same-layer nodes: 80px horizontal, 120px vertical between layers
 * - Canvas margins: 40px minimum, 60px between node edges
 * - Snap to 8px grid: horizontal 120px intervals, vertical 120px intervals
 */

/** Grid size for snapping (8px) */
const GRID_SIZE = 8;

/** Minimum horizontal spacing between nodes */
export const HORIZONTAL_SPACING = 80;

/** Minimum vertical spacing between layers */
export const VERTICAL_SPACING = 120;

/** Minimum canvas margin */
export const CANVAS_MARGIN = 40;

/** Spacing between node edges */
export const NODE_EDGE_SPACING = 60;

/**
 * Snap a coordinate value to the nearest grid point.
 */
export function applyGridSnap(value: number, gridSize: number = GRID_SIZE): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Snap x coordinate to 120px intervals.
 */
export function snapX(x: number): number {
  return Math.round(x / 120) * 120;
}

/**
 * Snap y coordinate to 120px intervals.
 */
export function snapY(y: number): number {
  return Math.round(y / 120) * 120;
}

/**
 * Calculate grid positions for a row of nodes.
 * Distributes nodes evenly across the available width.
 */
export function layoutRow(
  count: number,
  nodeWidth: number,
  y: number,
  canvasWidth: number = 960,
  margin: number = CANVAS_MARGIN
): Array<{ x: number; y: number }> {
  const availableWidth = canvasWidth - 2 * margin;
  const totalNodeWidth = count * nodeWidth;
  const totalGap = availableWidth - totalNodeWidth;
  const gap = count > 1 ? totalGap / (count - 1) : 0;

  const positions: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < count; i++) {
    const x = margin + i * (nodeWidth + gap);
    positions.push({
      x: applyGridSnap(x),
      y: applyGridSnap(y),
    });
  }
  return positions;
}

/**
 * Calculate positions for a grid layout (rows x cols).
 */
export function layoutGrid(
  rows: number,
  cols: number,
  nodeWidth: number,
  nodeHeight: number,
  canvasWidth: number = 960,
  margin: number = CANVAS_MARGIN
): Array<Array<{ x: number; y: number }>> {
  const result: Array<Array<{ x: number; y: number }>> = [];

  for (let r = 0; r < rows; r++) {
    const y = margin + r * (nodeHeight + VERTICAL_SPACING);
    const rowPositions = layoutRow(cols, nodeWidth, y, canvasWidth, margin);
    result.push(rowPositions);
  }

  return result;
}

/**
 * Calculate layer positions for architecture diagrams.
 * Each layer is a horizontal row of nodes.
 */
export function layoutLayers(
  layerSizes: number[],
  nodeWidth: number,
  nodeHeight: number,
  canvasWidth: number = 960,
  margin: number = CANVAS_MARGIN,
  titleOffset: number = 40
): Array<Array<{ x: number; y: number }>> {
  const result: Array<Array<{ x: number; y: number }>> = [];

  for (let i = 0; i < layerSizes.length; i++) {
    const y = margin + titleOffset + i * (nodeHeight + VERTICAL_SPACING);
    const rowPositions = layoutRow(layerSizes[i], nodeWidth, y, canvasWidth, margin);
    result.push(rowPositions);
  }

  return result;
}

/**
 * Calculate lifeline x positions for sequence diagrams.
 */
export function layoutLifelines(
  count: number,
  canvasWidth: number = 960,
  margin: number = 80
): number[] {
  const availableWidth = canvasWidth - 2 * margin;
  const spacing = count > 1 ? availableWidth / (count - 1) : 0;

  const positions: number[] = [];
  for (let i = 0; i < count; i++) {
    positions.push(applyGridSnap(margin + i * spacing));
  }
  return positions;
}

/**
 * Ensure a value is at least the minimum margin.
 */
export function ensureMargin(value: number, margin: number = CANVAS_MARGIN): number {
  return Math.max(value, margin);
}
