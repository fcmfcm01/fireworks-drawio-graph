/**
 * fireworks-drawio-graph - AI-powered technical diagram generation using draw.io mxGraphModel XML.
 *
 * Combines fireworks-tech-graph's styling system with draw.io's interactive capabilities.
 * @module fireworks-drawio-graph
 */

// Core builder
export { DiagramBuilder } from './builder/diagram-builder.js';
export type { DiagramConfig, NodeDef, EdgeDef, GroupDef } from './builder/diagram-builder.js';

// Style system
export { getStyleTheme, getAllStyles, getStyleNames } from './styles/index.js';
export type { StyleTheme, ArrowColors } from './styles/index.js';

// Builders
export { resolveNodeStyle } from './builder/node-builder.js';
export type { NodeShapeType } from './builder/node-builder.js';
export { resolveEdgeDrawioStyle, getFlowLegendEntry } from './builder/edge-builder.js';
export type { EdgeFlowType, EdgeStyleVariant } from './builder/edge-builder.js';

// Layout engine
export {
  applyGridSnap, layoutLayers,
  HORIZONTAL_SPACING, VERTICAL_SPACING, CANVAS_MARGIN
} from './builder/layout-engine.js';

// Utilities
export { escapeXml, escapeAttrValue, unescapeXml } from './utils/xml-escape.js';
export { nextId, nextPrefixedId, generateIds, resetIdCounter } from './utils/id-generator.js';
