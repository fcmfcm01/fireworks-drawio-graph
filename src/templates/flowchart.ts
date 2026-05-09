/**
 * Flowchart / process flow template.
 *
 * Sequential decision/process steps with top-to-bottom layout.
 * Diamond shapes for decisions, rounded rects for processes.
 */

import { DiagramBuilder } from '../builder/diagram-builder.js';
import type { NodeDef } from '../builder/diagram-builder.js';
import type { NodeShapeType } from '../builder/node-builder.js';
import { applyGridSnap } from '../builder/layout-engine.js';

export interface FlowchartStep {
  label: string;
  type: 'process' | 'decision' | 'data' | 'start' | 'end';
  id?: string;
}

export interface FlowchartConnection {
  from: string;
  to: string;
  label?: string;
  /** For decision branches: 'yes' or 'no' */
  branch?: string;
}

export interface FlowchartInput {
  title: string;
  style?: number;
  steps: FlowchartStep[];
  connections: FlowchartConnection[];
}

/**
 * Create a flowchart diagram.
 */
export function createFlowchart(input: FlowchartInput): DiagramBuilder {
  const style = input.style ?? 1;
  const totalSteps = input.steps.length;
  const estimatedHeight = 80 + totalSteps * 100;
  const builder = new DiagramBuilder({ style, title: input.title, height: Math.max(600, estimatedHeight) });

  const stepIdMap = new Map<string, string>();
  const centerX = 400;
  const startY = 80;
  const stepSpacing = 100;

  for (let i = 0; i < input.steps.length; i++) {
    const step = input.steps[i];
    const y = startY + i * stepSpacing;

    let nodeWidth = 160;
    let nodeHeight = 50;
    let shapeType: NodeShapeType = 'process';

    switch (step.type) {
      case 'decision':
        nodeWidth = 120;
        nodeHeight = 80;
        shapeType = 'decision';
        break;
      case 'data':
        shapeType = 'data';
        break;
      case 'start':
        nodeWidth = 60;
        nodeHeight = 60;
        shapeType = 'start';
        break;
      case 'end':
        nodeWidth = 60;
        nodeHeight = 60;
        shapeType = 'end';
        break;
    }

    const x = applyGridSnap(centerX - nodeWidth / 2);
    const id = builder.addNode({
      id: step.id,
      type: shapeType,
      label: step.label,
      x,
      y: applyGridSnap(y),
      width: nodeWidth,
      height: nodeHeight,
    });
    stepIdMap.set(step.label, id);
    if (step.id) stepIdMap.set(step.id, id);
  }

  for (const conn of input.connections) {
    const sourceId = stepIdMap.get(conn.from);
    const targetId = stepIdMap.get(conn.to);
    if (sourceId && targetId) {
      builder.addEdge({
        source: sourceId,
        target: targetId,
        label: conn.label ?? conn.branch,
      });
    }
  }

  return builder;
}
