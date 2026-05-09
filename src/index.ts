/**
 * fireworks-drawio-graph - AI-powered technical diagram generation using draw.io mxGraphModel XML.
 *
 * Combines fireworks-tech-graph's styling system with draw.io's interactive capabilities.
 * @module fireworks-drawio-graph
 */

// Core builder
export { DiagramBuilder } from './builder/diagram-builder.js';
export type { DiagramConfig, NodeDef, EdgeDef, GroupDef, ExternalShapeInput } from './builder/diagram-builder.js';

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

// Icon system — SVG custom icons for AI/LLM tech stack diagrams
export {
  svgToDataUri, buildIconCell, buildIconWithLabel, applyThemeToSvg,
} from './builder/icon-node.js';
export type { SvgEncoding, IconNodeConfig } from './builder/icon-node.js';

export { ICON_TEMPLATES, ICON_NAMES } from './icons/ai-icons.js';
export type { IconName } from './icons/ai-icons.js';

// Stencil system — draw.io built-in shape libraries (AWS, Azure, GCP, Alibaba, K8s, etc.)
export {
  getLibrary,
  getLibraryOrThrow,
  getLibraryIds,
  getAllLibraries,
  resolveStencilStyle,
  resolveGroupStyle,
  getStencilShapeNames,
  getStencilCategories,
  buildRawStencilStyle,
} from './stencils/index.js';
export type {
  StencilShapeVariant,
  StencilShapeDef,
  StencilGroupDef,
  StencilLibraryDef,
  StencilNodeInput,
  StencilGroupInput,
} from './stencils/index.js';

// Cloud architecture templates
export {
  createCloudArchitectureDiagram,
  createAwsArchitectureDiagram,
  createAzureArchitectureDiagram,
  createGcpArchitectureDiagram,
  createAlibabaArchitectureDiagram,
} from './templates/cloud-architecture.js';
export type {
  CloudArchNode,
  CloudArchConnection,
  CloudArchGroup,
  CloudArchInput,
} from './templates/cloud-architecture.js';

// External library loader — drawio-libs community shapes
export {
  fetchLibrary,
  loadLibraryFromFile,
  loadCachedLibrary,
  listCachedLibraries,
  downloadLibrary,
  listExternalShapes,
  buildExternalShapeXml,
  findEntryByTitle,
  decompressXml,
  parseMxLibrary,
  getDefaultCacheDir,
  POPULAR_LIBRARIES,
} from './stencils/external-loader.js';
export type {
  ExternalLibEntry,
  ExternalLibrary,
} from './stencils/external-loader.js';

// Provider resolver — automatic provider→library→shape resolution
export type {
  ResolvedProvider,
  ShapeSearchResult,
  ProviderNodeInput,
} from './stencils/provider-resolver.js';

// Utilities
export { escapeXml, escapeAttrValue, unescapeXml } from './utils/xml-escape.js';
export { nextId, nextPrefixedId, generateIds, resetIdCounter } from './utils/id-generator.js';
