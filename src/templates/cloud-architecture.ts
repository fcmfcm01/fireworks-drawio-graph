import { DiagramBuilder } from '../builder/diagram-builder.js';
import type { EdgeDef } from '../builder/diagram-builder.js';
import { getLibraryOrThrow } from '../stencils/registry.js';

export interface CloudArchNode {
  label: string;
  shape: string;
  library?: string;
  type?: 'icon' | 'group';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  parent?: string;
  fillColor?: string;
}

export interface CloudArchConnection {
  from: string;
  to: string;
  label?: string;
  flowType?: import('../builder/edge-builder.js').EdgeFlowType;
}

export interface CloudArchGroup {
  name: string;
  group: string;
  library?: string;
  label?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor?: string;
}

export interface CloudArchInput {
  title: string;
  style?: number;
  library?: string;
  groups?: CloudArchGroup[];
  nodes: CloudArchNode[];
  connections: CloudArchConnection[];
}

export function createCloudArchitectureDiagram(input: CloudArchInput): DiagramBuilder {
  const defaultLibrary = input.library ?? 'aws4';
  const style = input.style ?? 1;
  const builder = new DiagramBuilder({ style, title: input.title, width: 1200, height: 800 });

  const labelToId = new Map<string, string>();

  for (const g of input.groups ?? []) {
    const lib = g.library ?? defaultLibrary;
    const id = builder.addStencilGroup({
      library: lib,
      group: g.group,
      label: g.label ?? g.name,
      x: g.x,
      y: g.y,
      width: g.width,
      height: g.height,
      strokeColor: g.strokeColor,
    });
    labelToId.set(g.name, id);
  }

  for (const node of input.nodes) {
    const lib = node.library ?? defaultLibrary;
    const isGroup = node.type === 'group';

    if (isGroup) {
      const id = builder.addStencilGroup({
        library: lib,
        group: node.shape,
        label: node.label,
        x: node.x ?? 0,
        y: node.y ?? 0,
        width: node.width ?? 300,
        height: node.height ?? 200,
        parent: node.parent,
      });
      labelToId.set(node.label, id);
    } else {
      const id = builder.addStencilNode({
        library: lib,
        shape: node.shape,
        label: node.label,
        x: node.x ?? 0,
        y: node.y ?? 0,
        width: node.width ?? 60,
        height: node.height ?? 60,
        parent: node.parent,
        fillColor: node.fillColor,
      });
      labelToId.set(node.label, id);
    }
  }

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

export function createAwsArchitectureDiagram(input: Omit<CloudArchInput, 'library'>): DiagramBuilder {
  return createCloudArchitectureDiagram({ ...input, library: 'aws4' });
}

export function createAzureArchitectureDiagram(input: Omit<CloudArchInput, 'library'>): DiagramBuilder {
  return createCloudArchitectureDiagram({ ...input, library: 'azure' });
}

export function createGcpArchitectureDiagram(input: Omit<CloudArchInput, 'library'>): DiagramBuilder {
  return createCloudArchitectureDiagram({ ...input, library: 'gcp2' });
}

export function createAlibabaArchitectureDiagram(input: Omit<CloudArchInput, 'library'>): DiagramBuilder {
  return createCloudArchitectureDiagram({ ...input, library: 'alibaba' });
}
