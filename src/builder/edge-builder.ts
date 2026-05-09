/**
 * Edge builder - maps Arrow Semantics to draw.io edge styles.
 *
 * Arrow Semantics (from fireworks-tech-graph):
 * - Primary data flow: blue, solid
 * - Control/trigger: orange, solid
 * - Memory read: green, solid
 * - Memory write: green, dashed
 * - Async/event: gray, dashed
 * - Embedding/transform: purple, solid
 * - Feedback/loop: purple, curved
 */

import type { StyleTheme } from '../styles/index.js';

/** Supported edge flow types */
export type EdgeFlowType =
  | 'primary'      // Main request/response path - blue solid
  | 'control'      // One system triggering another - orange solid
  | 'memoryRead'   // Retrieval from store - green solid
  | 'memoryWrite'  // Write/store operation - green dashed
  | 'async'        // Non-blocking, event-driven - gray dashed
  | 'embedding'    // Data transformation - purple solid
  | 'feedback';    // Iterative reasoning loop - purple curved

/** Edge style variant */
export type EdgeStyleVariant = 'orthogonal' | 'elbow' | 'entity' | 'straight' | 'curved';

/** Arrow end type */
export type ArrowEnd = 'classic' | 'block' | 'open' | 'oval' | 'diamond' | 'none' | 'double';

/**
 * Get the color for a flow type based on theme.
 */
function getFlowColor(flowType: EdgeFlowType, theme: StyleTheme): string {
  const colors = theme.arrowColors ?? {
    primary: '#2563eb',
    control: '#ea580c',
    memoryRead: '#059669',
    memoryWrite: '#059669',
    async: '#6b7280',
    embedding: '#7c3aed',
    feedback: '#7c3aed',
  };

  return colors[flowType] ?? colors.primary;
}

/**
 * Map edge style variant to drawio edgeStyle value.
 */
function getEdgeStyleName(variant: EdgeStyleVariant): string {
  switch (variant) {
    case 'orthogonal': return 'orthogonalEdgeStyle';
    case 'elbow': return 'elbowEdgeStyle';
    case 'entity': return 'entityRelationEdgeStyle';
    case 'straight': return 'none';
    case 'curved': return 'orthogonalEdgeStyle';
    default: return 'orthogonalEdgeStyle';
  }
}

/**
 * Resolve the complete drawio style string for an edge.
 */
export function resolveEdgeDrawioStyle(
  flowType: EdgeFlowType,
  variant: EdgeStyleVariant,
  theme: StyleTheme
): string {
  const parts: string[] = [];

  // Edge style
  const edgeStyleName = getEdgeStyleName(variant);
  if (edgeStyleName !== 'none') {
    parts.push(`edgeStyle=${edgeStyleName}`);
  }

  // Common edge properties
  parts.push('rounded=1');
  parts.push('orthogonalLoop=1');
  parts.push('jettySize=auto');
  parts.push('html=1');

  // Arrow end
  if (flowType === 'feedback') {
    parts.push('endArrow=classic');
    parts.push('startArrow=classic');
    parts.push('endFill=1');
    parts.push('startFill=0');
  } else {
    parts.push('endArrow=classic');
    parts.push('endFill=1');
  }

  // Stroke color from flow type
  const color = getFlowColor(flowType, theme);
  parts.push(`strokeColor=${color}`);

  // Stroke width
  if (flowType === 'primary') {
    parts.push('strokeWidth=2');
  } else {
    parts.push('strokeWidth=1.5');
  }

  // Dash pattern for certain flow types
  if (flowType === 'memoryWrite') {
    parts.push('dashed=1');
    parts.push('dashPattern=5 3');
  } else if (flowType === 'async') {
    parts.push('dashed=1');
    parts.push('dashPattern=4 2');
  } else if (flowType === 'control') {
    parts.push('dashed=1');
    parts.push('dashPattern=8 4');
  }

  // Curved for feedback
  if (flowType === 'feedback' || variant === 'curved') {
    parts.push('curved=1');
  }

  return parts.join(';') + ';';
}

/**
 * Get a legend entry for a flow type (for building diagram legends).
 */
export function getFlowLegendEntry(flowType: EdgeFlowType, theme: StyleTheme): {
  color: string;
  dashed: boolean;
  label: string;
} {
  const color = getFlowColor(flowType, theme);
  const labelMap: Record<EdgeFlowType, string> = {
    primary: 'Primary data flow',
    control: 'Control / trigger',
    memoryRead: 'Memory read',
    memoryWrite: 'Memory write',
    async: 'Async / event',
    embedding: 'Embedding / transform',
    feedback: 'Feedback / loop',
  };

  return {
    color,
    dashed: flowType === 'memoryWrite' || flowType === 'async',
    label: labelMap[flowType],
  };
}
