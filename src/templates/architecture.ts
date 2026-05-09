/**
 * Architecture diagram template.
 *
 * Nodes = services/components grouped into horizontal layers.
 * Typical layers: Client → Gateway/LB → Services → Data/Storage
 */

import { DiagramBuilder } from '../builder/diagram-builder.js';
import type { DiagramConfig, NodeDef, EdgeDef } from '../builder/diagram-builder.js';
import { layoutLayers } from '../builder/layout-engine.js';

export interface ArchitectureLayer {
  name: string;
  nodes: Array<{
    label: string;
    type?: import('../builder/node-builder.js').NodeShapeType;
    subLabel?: string;
  }>;
}

export interface ArchitectureDiagramInput {
  title: string;
  style?: number;
  layers: ArchitectureLayer[];
  connections: Array<{
    from: string;   // node label or id
    to: string;     // node label or id
    label?: string;
    flowType?: import('../builder/edge-builder.js').EdgeFlowType;
  }>;
}

/**
 * Create an architecture diagram from a structured input.
 */
export function createArchitectureDiagram(input: ArchitectureDiagramInput): DiagramBuilder {
  const style = input.style ?? 1;
  const builder = new DiagramBuilder({ style, title: input.title, height: 200 + input.layers.length * 180 });

  const labelToId = new Map<string, string>();
  const nodeWidth = 160;
  const nodeHeight = 60;

  // Calculate layer positions
  const layerSizes = input.layers.map(l => l.nodes.length);
  const positions = layoutLayers(layerSizes, nodeWidth, nodeHeight, 960, 40, 40);

  // Add layer containers and nodes
  for (let li = 0; li < input.layers.length; li++) {
    const layer = input.layers[li];
    const layerPositions = positions[li];

    // Add layer label (as a small text node on the left)
    const layerLabelX = 5;
    const layerLabelY = layerPositions[0]?.y ?? 80;

    for (let ni = 0; ni < layer.nodes.length; ni++) {
      const node = layer.nodes[ni];
      const pos = layerPositions[ni];
      const id = builder.addNode({
        type: node.type ?? 'process',
        label: node.label,
        subLabel: node.subLabel,
        x: pos.x,
        y: pos.y,
        width: nodeWidth,
        height: nodeHeight,
      });
      labelToId.set(node.label, id);
    }
  }

  // Add connections
  for (const conn of input.connections) {
    const sourceId = labelToId.get(conn.from);
    const targetId = labelToId.get(conn.to);
    if (sourceId && targetId) {
      builder.addEdge({
        source: sourceId,
        target: targetId,
        label: conn.label,
        flowType: conn.flowType ?? 'primary',
      });
    }
  }

  return builder;
}
