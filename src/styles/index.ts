/**
 * Style theme system for fireworks-drawio-graph.
 *
 * Maps fireworks-tech-graph's 7 visual styles to draw.io style properties.
 * Each style provides color tokens that map to fillColor, strokeColor, fontColor etc.
 */

/** Arrow semantic colors for a theme */
export interface ArrowColors {
  primary: string;      // Main request/response path
  control: string;      // One system triggering another
  memoryRead: string;   // Retrieval from store
  memoryWrite: string;  // Write/store operation
  async: string;        // Non-blocking, event-driven
  embedding: string;    // Data transformation
  feedback: string;     // Iterative reasoning loop
}

/** A complete style theme with all color tokens */
export interface StyleTheme {
  /** Theme number (1-7) */
  number: number;
  /** Human-readable name */
  name: string;
  /** Canvas/page background color */
  background: string;
  /** Default node fill color */
  fillColor: string;
  /** Default node stroke/border color */
  strokeColor: string;
  /** Primary text color */
  textPrimary: string;
  /** Secondary text color (labels, sub-labels) */
  textSecondary: string;
  /** Muted text color (annotations) */
  textMuted: string;
  /** Default font size */
  fontSize: number;
  /** Default corner radius */
  borderRadius: number;
  /** Arrow semantic colors */
  arrowColors: ArrowColors;
  /** Accent fill colors for different semantic categories */
  accents: {
    blue: string;
    green: string;
    orange: string;
    purple: string;
    red: string;
    teal: string;
  };
  /** Whether to use shadows */
  useShadow: boolean;
  /** Whether the background is dark (affects legend rendering) */
  isDark: boolean;
}

export { style1FlatIcon } from './style-1-flat-icon.js';
export { style2DarkTerminal } from './style-2-dark-terminal.js';
export { style3Blueprint } from './style-3-blueprint.js';
export { style4NotionClean } from './style-4-notion-clean.js';
export { style5Glassmorphism } from './style-5-glassmorphism.js';
export { style6ClaudeOfficial } from './style-6-claude-official.js';
export { style7OpenAI } from './style-7-openai.js';

import { style1FlatIcon } from './style-1-flat-icon.js';
import { style2DarkTerminal } from './style-2-dark-terminal.js';
import { style3Blueprint } from './style-3-blueprint.js';
import { style4NotionClean } from './style-4-notion-clean.js';
import { style5Glassmorphism } from './style-5-glassmorphism.js';
import { style6ClaudeOfficial } from './style-6-claude-official.js';
import { style7OpenAI } from './style-7-openai.js';

/** All available style themes indexed by number */
const ALL_STYLES: Map<number, StyleTheme> = new Map([
  [1, style1FlatIcon],
  [2, style2DarkTerminal],
  [3, style3Blueprint],
  [4, style4NotionClean],
  [5, style5Glassmorphism],
  [6, style6ClaudeOfficial],
  [7, style7OpenAI],
]);

/**
 * Get a style theme by number (1-7).
 * Returns Style 1 (Flat Icon) as default for invalid numbers.
 */
export function getStyleTheme(num: number): StyleTheme {
  return ALL_STYLES.get(num) ?? style1FlatIcon;
}

/**
 * Get all available style themes.
 */
export function getAllStyles(): StyleTheme[] {
  return Array.from(ALL_STYLES.values());
}

/**
 * Get style theme names for display.
 */
export function getStyleNames(): Array<{ number: number; name: string; background: string }> {
  return Array.from(ALL_STYLES.values()).map(s => ({
    number: s.number,
    name: s.name,
    background: s.background,
  }));
}
