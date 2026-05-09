/**
 * Stencil system types — core type definitions for draw.io shape libraries.
 *
 * Shape libraries are built into draw.io and referenced via
 * `shape=mxgraph.<library>.<shape>` in the mxCell style attribute.
 * No SVG embedding needed — the shapes render natively.
 *
 * @module stencils/types
 */

/** How a shape is rendered in draw.io */
export type StencilShapeVariant =
  | 'resourceIcon'   // Square icon with overlay (e.g., AWS service icons)
  | 'direct'         // Native silhouette shape (e.g., AWS Lambda)
  | 'group';         // Container/group shape (e.g., VPC, region)

/** A single stencil shape definition */
export interface StencilShapeDef {
  /** Shape identifier within the library (e.g., "s3", "lambda") */
  name: string;
  /** Category for grouping and color defaults (e.g., "storage", "compute") */
  category: string;
  /** Default fill color for this shape's category */
  color: string;
  /** How this shape renders */
  variant: StencilShapeVariant;
  /** Optional short description */
  description?: string;
}

/** A group/container stencil shape (e.g., VPC, Subnet, Region) */
export interface StencilGroupDef {
  /** Group shape identifier */
  name: string;
  /** Default fill color (typically "none") */
  fillColor: string;
  /** Default stroke color */
  strokeColor: string;
  /** Optional description */
  description?: string;
}

/** A complete stencil library definition */
export interface StencilLibraryDef {
  /** Library ID used in API calls (e.g., "aws4", "azure") */
  id: string;
  /** Human-readable library name (e.g., "AWS 2021+", "Azure") */
  name: string;
  /** mxgraph prefix for shape references (e.g., "mxgraph.aws4") */
  prefix: string;
  /** Map of shape name → shape definition */
  shapes: Record<string, StencilShapeDef>;
  /** Map of group name → group definition */
  groups: Record<string, StencilGroupDef>;
  /** Base style template for resourceIcon shapes.
   *  Placeholders: {COLOR} → category color, {SHAPE} → shape name */
  resourceIconStyle: string;
  /** Base style template for direct shapes.
   *  Placeholders: {COLOR} → category color, {SHAPE} → shape name */
  directStyle: string;
  /** Base style template for group shapes.
   *  Placeholders: {GROUP} → group name, {STROKE} → stroke color */
  groupStyle: string;
}

/** Input for creating a stencil node */
export interface StencilNodeInput {
  /** Stencil library ID (e.g., "aws4", "azure") */
  library: string;
  /** Shape name within the library (e.g., "s3", "lambda") */
  shape: string;
  /** Display label */
  label: string;
  /** X position */
  x: number;
  /** Y position */
  y: number;
  /** Width (default 60 for icons, varies for groups) */
  width?: number;
  /** Height (default 60 for icons, varies for groups) */
  height?: number;
  /** Override fill color (overrides category default) */
  fillColor?: string;
  /** Override label position */
  labelPosition?: 'bottom' | 'center' | 'top' | 'none';
  /** Parent cell ID (default "1") */
  parent?: string;
  /** Additional style overrides as key=value pairs */
  styleOverrides?: Record<string, string>;
}

/** Input for creating a stencil group/container */
export interface StencilGroupInput {
  /** Stencil library ID */
  library: string;
  /** Group shape name (e.g., "vpc", "region") */
  group: string;
  /** Display label */
  label?: string;
  /** X position */
  x: number;
  /** Y position */
  y: number;
  /** Width */
  width: number;
  /** Height */
  height: number;
  /** Override stroke color */
  strokeColor?: string;
  /** Parent cell ID (default "1") */
  parent?: string;
  /** Additional style overrides */
  styleOverrides?: Record<string, string>;
}
