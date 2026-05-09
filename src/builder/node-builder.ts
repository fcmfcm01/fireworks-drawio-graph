/**
 * Node builder - maps Shape Vocabulary types to draw.io style strings.
 *
 * Shape Vocabulary (from fireworks-tech-graph) is mapped to draw.io shapes:
 * - process → rounded rect
 * - decision → rhombus (diamond)
 * - database → cylinder3
 * - user → ellipse with label
 * - etc.
 */

import type { StyleTheme } from '../styles/index.js';

/** Supported node shape types from the Shape Vocabulary */
export type NodeShapeType =
  | 'process'        // Rounded rect (standard box)
  | 'decision'       // Diamond / rhombus
  | 'database'       // Cylinder
  | 'user'           // Circle / ellipse (actor)
  | 'llm'            // Rounded rect with accent
  | 'agent'          // Hexagon
  | 'memory-short'   // Rounded rect, dashed border
  | 'memory-long'    // Cylinder (database shape)
  | 'vector-store'   // Cylinder with grid
  | 'tool'           // Rect with gear-like styling
  | 'api'            // Hexagon (single border)
  | 'queue'          // Horizontal tube / parallelogram
  | 'document'       // Folded-corner rect
  | 'browser'        // Rect with titlebar dots
  | 'data'           // Parallelogram (I/O)
  | 'external'       // Dashed-border rect
  | 'container'      // Group/container
  | 'start'          // Filled circle (state machine)
  | 'end'            // Double circle (state machine)
  | 'state'          // Rounded rect (state machine)
  | 'entity'         // Rect (ER entity)
  | 'relationship'   // Diamond (ER relationship)
  | 'class'          // Rect with compartments (UML class)
  | 'lifeline'       // Vertical dashed line (sequence)
  | 'note'           // Folded-corner note shape
  | 'cloud'          // Cloud shape
  | 'card'           // Card shape
  | 'raw';           // No shape mapping (use raw style overrides)

/**
 * Map a Shape Vocabulary type to a draw.io base style string.
 * These are the structural shape properties only; colors come from the theme.
 */
function shapeTypeToBaseStyle(type: NodeShapeType): string {
  switch (type) {
    case 'process':
      return 'rounded=1;whiteSpace=wrap;html=1;arcSize=12;';
    case 'decision':
      return 'rhombus;whiteSpace=wrap;html=1;';
    case 'database':
      return 'shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=10;';
    case 'user':
      return 'ellipse;whiteSpace=wrap;html=1;';
    case 'llm':
      return 'rounded=1;whiteSpace=wrap;html=1;arcSize=15;shadow=1;';
    case 'agent':
      return 'shape=hexagon;perimeter=hexagonPerimeterSize;whiteSpace=wrap;html=1;fixedSize=1;';
    case 'memory-short':
      return 'rounded=1;whiteSpace=wrap;html=1;dashed=1;dashPattern=5 3;arcSize=8;';
    case 'memory-long':
      return 'shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=10;';
    case 'vector-store':
      return 'shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=10;';
    case 'tool':
      return 'rounded=1;whiteSpace=wrap;html=1;arcSize=8;';
    case 'api':
      return 'shape=hexagon;perimeter=hexagonPerimeterSize;whiteSpace=wrap;html=1;fixedSize=1;size=15;';
    case 'queue':
      return 'shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;';
    case 'document':
      return 'shape=document;whiteSpace=wrap;html=1;boundedLbl=1;';
    case 'browser':
      return 'rounded=1;whiteSpace=wrap;html=1;arcSize=6;';
    case 'data':
      return 'shape=parallelogram;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;';
    case 'external':
      return 'rounded=1;whiteSpace=wrap;html=1;dashed=1;dashPattern=8 4;arcSize=8;';
    case 'container':
      return 'rounded=1;whiteSpace=wrap;html=1;verticalAlign=top;fillColor=none;';
    case 'start':
      return 'ellipse;whiteSpace=wrap;html=1;aspect=fixed;';
    case 'end':
      return 'ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeWidth=3;';
    case 'state':
      return 'rounded=1;whiteSpace=wrap;html=1;arcSize=20;';
    case 'entity':
      return 'rounded=0;whiteSpace=wrap;html=1;';
    case 'relationship':
      return 'rhombus;whiteSpace=wrap;html=1;';
    case 'class':
      return 'swimlane;fontStyle=1;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;html=1;';
    case 'lifeline':
      return 'shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;outlineConnect=0;size=40;';
    case 'note':
      return 'shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0.05;';
    case 'cloud':
      return 'ellipse;shape=cloud;whiteSpace=wrap;html=1;';
    case 'card':
      return 'rounded=1;whiteSpace=wrap;html=1;arcSize=10;shadow=1;';
    case 'raw':
      return 'rounded=0;whiteSpace=wrap;html=1;';
    default:
      return 'rounded=1;whiteSpace=wrap;html=1;';
  }
}

/**
 * Map semantic node types to accent fill + stroke color pairs.
 * Uses theme.accents for fill and arrowColors for stroke to ensure
 * each semantic type has a visually distinct color.
 */
function getTypeAccentColors(type: NodeShapeType, theme: StyleTheme): { fill: string; stroke: string } | null {
  const a = theme.accents;
  const ar = theme.arrowColors;

  switch (type) {
    // AI / LLM types → purple
    case 'llm':
      return { fill: a.purple, stroke: ar.embedding };
    // Agent / orchestrator → orange
    case 'agent':
      return { fill: a.orange, stroke: ar.control };
    // Storage / data types → green
    case 'database':
    case 'memory-long':
    case 'vector-store':
      return { fill: a.green, stroke: ar.memoryRead };
    // API / gateway → blue
    case 'api':
      return { fill: a.blue, stroke: ar.primary };
    // Tool / function → teal
    case 'tool':
    case 'queue':
      return { fill: a.teal, stroke: ar.memoryWrite };
    // Short-term memory → red (dashed handled by base style)
    case 'memory-short':
      return { fill: a.red, stroke: ar.control };
    // Document / file → orange variant
    case 'document':
    case 'note':
      return { fill: a.orange, stroke: ar.control };
    // External service → red dashed (handled by base style)
    case 'external':
      return { fill: a.red, stroke: ar.control };
    // Decision → yellow/amber tint
    case 'decision':
      return { fill: a.orange, stroke: ar.control };
    default:
      return null;
  }
}

/**
 * Resolve the full drawio style string for a node.
 * Combines the shape type base style with theme colors.
 * Semantic types (llm, agent, database, api, tool, etc.) automatically
 * get distinct accent colors from the theme palette.
 */
export function resolveNodeStyle(type: NodeShapeType, theme: StyleTheme): string {
  const baseStyle = shapeTypeToBaseStyle(type);

  const parts: string[] = [baseStyle];

  const accent = getTypeAccentColors(type, theme);

  if (type === 'start') {
    parts.push('fillColor=#000000;');
    parts.push('strokeColor=#000000;');
  } else if (type === 'end') {
    parts.push('fillColor=#000000;');
    parts.push('strokeColor=#000000;');
  } else if (type === 'container') {
    parts.push(`strokeColor=${theme.strokeColor};`);
    parts.push(`fontColor=${theme.textSecondary};`);
  } else if (type === 'class') {
    parts.push(`fillColor=${theme.fillColor};`);
    parts.push(`strokeColor=${theme.strokeColor};`);
    parts.push(`fontColor=${theme.textPrimary};`);
  } else if (accent) {
    parts.push(`fillColor=${accent.fill};`);
    parts.push(`strokeColor=${accent.stroke};`);
    parts.push(`fontColor=${theme.textPrimary};`);
    if (type === 'llm' || type === 'agent') {
      parts.push('shadow=1;');
    }
  } else {
    parts.push(`fillColor=${theme.fillColor};`);
    parts.push(`strokeColor=${theme.strokeColor};`);
    parts.push(`fontColor=${theme.textPrimary};`);
  }

  parts.push(`fontSize=${theme.fontSize};`);

  return parts.join('');
}
