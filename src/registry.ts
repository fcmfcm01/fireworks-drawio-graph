/**
 * Diagram type registry — single source of truth for all diagram types.
 * Used by CLI, MCP server, and tools to avoid scattered hardcoding.
 */

export interface DiagramTypeInfo {
  /** Machine-readable key */
  key: string;
  /** Human-readable label */
  label: string;
  /** One-line description */
  description: string;
  /** Whether template generation is implemented */
  hasTemplate: boolean;
}

const DIAGRAM_TYPES: DiagramTypeInfo[] = [
  { key: 'architecture', label: 'Architecture', description: 'Horizontal layers: Client → Gateway → Services → Data', hasTemplate: true },
  { key: 'flowchart', label: 'Flowchart', description: 'Sequential steps: process, decision, data, start/end', hasTemplate: true },
  { key: 'sequence', label: 'Sequence', description: 'Time-ordered messages between participants (lifelines)', hasTemplate: true },
  { key: 'data-flow', label: 'Data Flow', description: 'Data transformation with labeled edges', hasTemplate: true },
  { key: 'class-diagram', label: 'Class Diagram', description: 'UML class boxes with attributes/methods', hasTemplate: false },
  { key: 'er-diagram', label: 'ER Diagram', description: 'Entity-Relationship with cardinality', hasTemplate: false },
  { key: 'state-machine', label: 'State Machine', description: 'State transitions with guards and actions', hasTemplate: false },
  { key: 'mind-map', label: 'Mind Map', description: 'Radial layout from central concept (manual XML)', hasTemplate: false },
  { key: 'timeline', label: 'Timeline', description: 'Horizontal time axis with bars/milestones (manual XML)', hasTemplate: false },
  { key: 'network-topology', label: 'Network Topology', description: 'Physical/logical network devices (manual XML)', hasTemplate: false },
  { key: 'use-case', label: 'Use Case', description: 'Actor + use case ellipses (manual XML)', hasTemplate: false },
  { key: 'comparison', label: 'Comparison', description: 'Feature matrix with columns/rows (manual XML)', hasTemplate: false },
];

/** Get all registered diagram types */
export function getAllDiagramTypes(): DiagramTypeInfo[] {
  return [...DIAGRAM_TYPES];
}

/** Get diagram types that have template generation */
export function getTemplateDiagramTypes(): DiagramTypeInfo[] {
  return DIAGRAM_TYPES.filter(t => t.hasTemplate);
}

/** Get a single diagram type by key */
export function getDiagramType(key: string): DiagramTypeInfo | undefined {
  return DIAGRAM_TYPES.find(t => t.key === key);
}

/** Get keys for z.enum() */
export function getDiagramTypeKeys(): string[] {
  return DIAGRAM_TYPES.filter(t => t.hasTemplate).map(t => t.key);
}

/** Format diagram types for CLI display */
export function formatDiagramTypesList(): string[] {
  return DIAGRAM_TYPES.map(t =>
    `${t.key.padEnd(16)} - ${t.description}`
  );
}
