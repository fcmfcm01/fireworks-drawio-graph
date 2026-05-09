/**
 * Data flow diagram template.
 *
 * Emphasizes data transformation and movement between systems.
 * Wider arrows for primary data paths, labeled edges.
 */

import { DiagramBuilder } from '../builder/diagram-builder.js';
import { layoutGrid } from '../builder/layout-engine.js';

export interface DataFlowNode {
  label: string;
  type?: import('../builder/node-builder.js').NodeShapeType;
  id?: string;
}

export interface DataFlowEdge {
  from: string;
  to: string;
  label: string;  // Data type flowing (e.g., "embeddings", "query")
  flowType?: import('../builder/edge-builder.js').EdgeFlowType;
}

export interface DataFlowInput {
  title: string;
  style?: number;
  nodes: DataFlowNode[];
  edges: DataFlowEdge[];
}

/**
 * Create a data flow diagram.
 */
export function createDataFlowDiagram(input: DataFlowInput): DiagramBuilder {
  const style = input.style ?? 1;
  const nodeCount = input.nodes.length;
  const cols = Math.min(4, nodeCount);
  const rows = Math.ceil(nodeCount / cols);
  const height = 200 + rows * 140;

  const builder = new DiagramBuilder({ style, title: input.title, height });

  const labelToId = new Map<string, string>();
  const positions = layoutGrid(rows, cols, 180, 70, 960, 60);

  for (let i = 0; i < input.nodes.length; i++) {
    const node = input.nodes[i];
    const row = Math.floor(i / cols);
    const col = i % cols;
    const pos = positions[row]?.[col];

    if (pos) {
      const id = builder.addNode({
        id: node.id,
        type: node.type ?? 'process',
        label: node.label,
        x: pos.x,
        y: pos.y,
        width: 180,
        height: 70,
      });
      labelToId.set(node.label, id);
      if (node.id) labelToId.set(node.id, id);
    }
  }

  for (const edge of input.edges) {
    const sourceId = labelToId.get(edge.from);
    const targetId = labelToId.get(edge.to);
    if (sourceId && targetId) {
      builder.addEdge({
        source: sourceId,
        target: targetId,
        label: edge.label,
        flowType: edge.flowType ?? 'embedding',
        styleOverrides: { strokeWidth: '2.5' },
      });
    }
  }

  return builder;
}
