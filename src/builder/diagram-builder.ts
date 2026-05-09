/**
 * Core diagram builder for generating mxGraphModel XML.
 *
 * Uses array-push method (inspired by Python list approach) to build XML
 * line by line, avoiding template-literal concatenation errors.
 *
 * Each method pushes individual lines to an internal array, which is
 * joined at the end to produce well-formed XML.
 */

import { escapeAttrValue } from '../utils/xml-escape.js';
import { nextId } from '../utils/id-generator.js';
import { resolveNodeStyle } from './node-builder.js';
import type { NodeShapeType } from './node-builder.js';
import { resolveEdgeDrawioStyle } from './edge-builder.js';
import type { EdgeFlowType } from './edge-builder.js';
import { applyGridSnap } from './layout-engine.js';
import { getStyleTheme } from '../styles/index.js';
import type { StyleTheme } from '../styles/index.js';

/** Static helper to resolve theme (avoids require() in ESM) */
function getStyleThemeStatic(num: number): StyleTheme {
  return getStyleTheme(num);
}

/** Configuration for a new diagram */
export interface DiagramConfig {
  /** Style theme number 1-7 */
  style: number;
  /** Canvas width in pixels (default 960) */
  width?: number;
  /** Canvas height in pixels (default 600) */
  height?: number;
  /** Diagram title */
  title?: string;
  /** Grid snapping enabled (default true) */
  gridSnap?: boolean;
}

/** Node definition */
export interface NodeDef {
  /** Unique cell ID (auto-generated if omitted) */
  id?: string;
  /** Shape type from Shape Vocabulary */
  type: NodeShapeType;
  /** Display label */
  label: string;
  /** X position */
  x: number;
  /** Y position */
  y: number;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Parent cell ID (default "1") */
  parent?: string;
  /** Override style properties */
  styleOverrides?: Record<string, string>;
  /** Optional sub-label or description */
  subLabel?: string;
}

/** Edge definition */
export interface EdgeDef {
  /** Unique cell ID (auto-generated if omitted) */
  id?: string;
  /** Source cell ID */
  source: string;
  /** Target cell ID */
  target: string;
  /** Display label on the edge */
  label?: string;
  /** Flow type for arrow semantics */
  flowType?: EdgeFlowType;
  /** Parent cell ID (default "1") */
  parent?: string;
  /** Override style properties */
  styleOverrides?: Record<string, string>;
  /** Edge style (default orthogonal) */
  edgeStyle?: 'orthogonal' | 'elbow' | 'entity' | 'straight' | 'curved';
}

/** Group/container definition */
export interface GroupDef {
  /** Unique cell ID */
  id?: string;
  /** Group label */
  label?: string;
  /** X position */
  x: number;
  /** Y position */
  y: number;
  /** Width */
  width: number;
  /** Height */
  height: number;
  /** Parent cell ID */
  parent?: string;
  /** Override style */
  styleOverrides?: Record<string, string>;
}

/**
 * DiagramBuilder - core class for constructing mxGraphModel XML.
 *
 * Usage:
 *   const builder = new DiagramBuilder({ style: 1 });
 *   builder.addNode({ type: 'process', label: 'API Gateway', x: 100, y: 100, width: 160, height: 60 });
 *   builder.addEdge({ source: '2', target: '3', label: 'request' });
 *   const xml = builder.toXml();
 */
export class DiagramBuilder {
  private lines: string[] = [];
  private styleTheme: StyleTheme;
  private config: Required<Omit<DiagramConfig, 'title'>> & { title: string };

  constructor(config: DiagramConfig) {
    this.config = {
      style: config.style,
      width: config.width ?? 960,
      height: config.height ?? 600,
      title: config.title ?? '',
      gridSnap: config.gridSnap ?? true,
    };

    this.styleTheme = this.resolveTheme(config.style);
  }

  /**
   * Add a node (vertex) to the diagram.
   * Returns the cell ID for use in edges.
   */
  addNode(def: NodeDef): string {
    const id = def.id ?? nextId();
    const parent = def.parent ?? '1';
    const x = this.config.gridSnap ? applyGridSnap(def.x) : def.x;
    const y = this.config.gridSnap ? applyGridSnap(def.y) : def.y;

    // Resolve drawio style from shape type + theme
    const baseStyle = resolveNodeStyle(def.type, this.styleTheme);
    const styleStr = this.mergeStyle(baseStyle, def.styleOverrides);

    // Build mxCell element using array push
    const attrs: string[] = [];
    attrs.push(`id="${id}"`);
    attrs.push(`value="${escapeAttrValue(def.label)}"`);
    attrs.push(`style="${styleStr}"`);
    attrs.push('vertex="1"');
    attrs.push(`parent="${parent}"`);

    this.lines.push(`      <mxCell ${attrs.join(' ')}>`);

    // Geometry
    const geoAttrs: string[] = [];
    geoAttrs.push(`x="${x}"`);
    geoAttrs.push(`y="${y}"`);
    geoAttrs.push(`width="${def.width}"`);
    geoAttrs.push(`height="${def.height}"`);
    geoAttrs.push('as="geometry"');

    this.lines.push(`        <mxGeometry ${geoAttrs.join(' ')}/>`);

    // Add sub-label if provided
    if (def.subLabel) {
      const subLabelId = `${id}_sub`;
      const subStyle = this.mergeStyle(
        `text;html=1;align=center;verticalAlign=top;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=10;fontColor=${this.styleTheme.textSecondary}`,
        {}
      );
      this.lines.push(`      <mxCell id="${subLabelId}" value="${escapeAttrValue(def.subLabel)}" style="${subStyle}" vertex="1" parent="${id}">`);
      this.lines.push(`        <mxGeometry y="${def.height}" width="${def.width}" height="20" as="geometry"/>`);
      this.lines.push(`      </mxCell>`);
    }

    this.lines.push(`      </mxCell>`);

    return id;
  }

  /**
   * Add an edge (connection) between two nodes.
   * Returns the cell ID.
   */
  addEdge(def: EdgeDef): string {
    const id = def.id ?? nextId();
    const parent = def.parent ?? '1';
    const flowType = def.flowType ?? 'primary';
    const edgeStyleType = def.edgeStyle ?? 'orthogonal';

    // Resolve edge style from flow type + theme
    const baseStyle = resolveEdgeDrawioStyle(flowType, edgeStyleType, this.styleTheme);
    const styleStr = this.mergeStyle(baseStyle, def.styleOverrides);

    const attrs: string[] = [];
    attrs.push(`id="${id}"`);
    if (def.label) {
      attrs.push(`value="${escapeAttrValue(def.label)}"`);
    }
    attrs.push(`style="${styleStr}"`);
    attrs.push('edge="1"');
    attrs.push(`source="${def.source}"`);
    attrs.push(`target="${def.target}"`);
    attrs.push(`parent="${parent}"`);

    this.lines.push(`      <mxCell ${attrs.join(' ')}>`);

    // Edge geometry (relative)
    this.lines.push(`        <mxGeometry relative="1" as="geometry"/>`);
    this.lines.push(`      </mxCell>`);

    return id;
  }

  /**
   * Add a group/container box.
   * Returns the cell ID.
   */
  addGroup(def: GroupDef): string {
    const id = def.id ?? nextId();
    const parent = def.parent ?? '1';
    const x = this.config.gridSnap ? applyGridSnap(def.x) : def.x;
    const y = this.config.gridSnap ? applyGridSnap(def.y) : def.y;

    const baseStyle = `rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=${this.styleTheme.strokeColor};dashed=1;fontSize=12;fontColor=${this.styleTheme.textSecondary};verticalAlign=top;`;
    const styleStr = this.mergeStyle(baseStyle, def.styleOverrides);

    const attrs: string[] = [];
    attrs.push(`id="${id}"`);
    if (def.label) {
      attrs.push(`value="${escapeAttrValue(def.label)}"`);
    }
    attrs.push(`style="${styleStr}"`);
    attrs.push('vertex="1"');
    attrs.push('connectable="0"');
    attrs.push(`parent="${parent}"`);

    this.lines.push(`      <mxCell ${attrs.join(' ')}>`);

    const geoAttrs: string[] = [];
    geoAttrs.push(`x="${x}"`);
    geoAttrs.push(`y="${y}"`);
    geoAttrs.push(`width="${def.width}"`);
    geoAttrs.push(`height="${def.height}"`);
    geoAttrs.push('as="geometry"');

    this.lines.push(`        <mxGeometry ${geoAttrs.join(' ')}/>`);
    this.lines.push(`      </mxCell>`);

    return id;
  }

  /**
   * Generate the complete mxGraphModel XML string.
   * Uses array join to avoid template-literal issues.
   */
  toXml(): string {
    const parts: string[] = [];

    // XML declaration
    parts.push('<?xml version="1.0" encoding="UTF-8"?>');

    // mxGraphModel root
    parts.push('<mxGraphModel dx="1422" dy="794" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="' + this.config.width + '" pageHeight="' + this.config.height + '" math="0" shadow="0">');
    parts.push('  <root>');

    // Required root cells (id=0 and id=1)
    parts.push('    <mxCell id="0"/>');
    parts.push('    <mxCell id="1" parent="0"/>');

    // Background rectangle (drawn as a cell with canvas dimensions)
    if (this.styleTheme.background && this.styleTheme.background !== '#ffffff' && this.styleTheme.background !== 'none') {
      const bgId = 'bg';
      const bgStyle = `shape=rectangle;fillColor=${this.styleTheme.background};strokeColor=none;opacity=100;`;
      parts.push(`      <mxCell id="${bgId}" value="" style="${bgStyle}" vertex="1" parent="1">`);
      parts.push(`        <mxGeometry x="0" y="0" width="${this.config.width}" height="${this.config.height}" as="geometry"/>`);
      parts.push(`      </mxCell>`);
    }

    // Diagram title
    if (this.config.title) {
      const titleId = 'title';
      const titleStyle = `text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontSize=18;fontStyle=1;fontColor=${this.styleTheme.textPrimary};`;
      parts.push(`      <mxCell id="${titleId}" value="${escapeAttrValue(this.config.title)}" style="${titleStyle}" vertex="1" parent="1">`);
      parts.push(`        <mxGeometry x="${Math.floor((this.config.width - 300) / 2)}" y="10" width="300" height="30" as="geometry"/>`);
      parts.push(`      </mxCell>`);
    }

    // User-added cells
    for (const line of this.lines) {
      parts.push(line);
    }

    // Close root and model
    parts.push('  </root>');
    parts.push('</mxGraphModel>');

    return parts.join('\n');
  }

  /**
   * Export to .drawio file format (wraps mxGraphModel in mxfile).
   */
  toDrawioFile(): string {
    const parts: string[] = [];
    parts.push('<mxfile host="fireworks-drawio-graph" modified="2024-01-01T00:00:00.000Z" agent="fireworks-drawio-graph" version="1.0.0" type="device">');
    parts.push('  <diagram id="diagram-1" name="Page-1">');
    // draw.io wraps the mxGraphModel XML in a encoded format,
    // but also accepts raw mxGraphModel inside <diagram>
    parts.push('    ' + this.toXml());
    parts.push('  </diagram>');
    parts.push('</mxfile>');
    return parts.join('\n');
  }

  /**
   * Write XML to a file.
   */
  async toFile(path: string): Promise<void> {
    const fs = await import('node:fs/promises');
    const content = path.endsWith('.drawio') ? this.toDrawioFile() : this.toXml();
    await fs.writeFile(path, content, 'utf-8');
  }

  /**
   * Merge base style string with override properties.
   */
  private mergeStyle(base: string, overrides?: Record<string, string>): string {
    if (!overrides || Object.keys(overrides).length === 0) {
      return base;
    }
    // Parse base into a map
    const map = new Map<string, string>();
    for (const part of base.split(';')) {
      const eqIdx = part.indexOf('=');
      if (eqIdx > 0) {
        map.set(part.substring(0, eqIdx).trim(), part.substring(eqIdx + 1).trim());
      }
    }
    // Apply overrides (sanitize values to prevent XML attribute injection)
    for (const [key, val] of Object.entries(overrides)) {
      // Block characters that could break out of the style="" attribute
      const safeKey = key.replace(/["'>]/g, '');
      const safeVal = val.replace(/["'>]/g, '');
      map.set(safeKey, safeVal);
    }
    // Rebuild
    const entries: string[] = [];
    map.forEach((val, key) => {
      entries.push(`${key}=${val}`);
    });
    return entries.join(';');
  }

  /**
   * Resolve a StyleTheme by number.
   */
  private resolveTheme(styleNum: number): StyleTheme {
    // Use dynamic import for ESM compatibility
    // We import synchronously at module level via the constructor chain,
    // but since we can't use top-level await in a class, we use a workaround.
    // The styles module is already imported at the top of this file's consumers.
    // For the builder itself, we resolve via a static import.
    return getStyleThemeStatic(styleNum);
  }

  /**
   * Get the current style theme.
   */
  getTheme(): StyleTheme {
    return this.styleTheme;
  }

  /**
   * Reset builder state (start a new diagram).
   */
  reset(config?: DiagramConfig): void {
    this.lines = [];
    if (config) {
      this.config = {
        style: config.style,
        width: config.width ?? 960,
        height: config.height ?? 600,
        title: config.title ?? '',
        gridSnap: config.gridSnap ?? true,
      };
      this.styleTheme = this.resolveTheme(config.style);
    }
  }
}
