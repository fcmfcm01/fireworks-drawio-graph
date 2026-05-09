/**
 * UML Class diagram template.
 *
 * Static structure showing classes, attributes, methods, and relationships.
 * Uses 3-compartment rects: name / attributes / methods.
 */

import { DiagramBuilder } from '../builder/diagram-builder.js';
import { layoutGrid } from '../builder/layout-engine.js';

export interface ClassMember {
  visibility: '+' | '-' | '#';
  name: string;
  type?: string;
}

export interface ClassDef {
  name: string;
  stereotype?: string;  // e.g., 'interface', 'abstract', 'enumeration'
  attributes?: ClassMember[];
  methods?: ClassMember[];
  id?: string;
}

export interface ClassRelation {
  from: string;
  to: string;
  type: 'inheritance' | 'implementation' | 'association' | 'aggregation' | 'composition' | 'dependency';
  label?: string;
  multiplicity?: string;
}

export interface ClassDiagramInput {
  title: string;
  style?: number;
  classes: ClassDef[];
  relations: ClassRelation[];
}

/**
 * Create a UML class diagram.
 *
 * Note: draw.io has limited native UML support, so we use label formatting
 * with HTML to create multi-compartment class boxes.
 */
export function createClassDiagram(input: ClassDiagramInput): DiagramBuilder {
  const style = input.style ?? 1;
  const nodeCount = input.classes.length;
  const cols = Math.min(3, nodeCount);
  const rows = Math.ceil(nodeCount / cols);
  const height = 200 + rows * 200;

  const builder = new DiagramBuilder({ style, title: input.title, height });

  const nameToId = new Map<string, string>();
  const positions = layoutGrid(rows, cols, 240, 160, 960, 60);

  for (let i = 0; i < input.classes.length; i++) {
    const cls = input.classes[i];
    const row = Math.floor(i / cols);
    const col = i % cols;
    const pos = positions[row]?.[col];

    if (pos) {
      // Build HTML label for multi-compartment class box
      const htmlLabel = buildClassLabel(cls);

      const id = builder.addNode({
        id: cls.id,
        type: 'class',
        label: htmlLabel,
        x: pos.x,
        y: pos.y,
        width: 240,
        height: 160,
      });
      nameToId.set(cls.name, id);
      if (cls.id) nameToId.set(cls.id, id);
    }
  }

  for (const rel of input.relations) {
    const sourceId = nameToId.get(rel.from);
    const targetId = nameToId.get(rel.to);
    if (sourceId && targetId) {
      const styleOverrides = getRelationStyle(rel.type);
      builder.addEdge({
        source: sourceId,
        target: targetId,
        label: rel.label,
        flowType: 'primary',
        styleOverrides,
      });
    }
  }

  return builder;
}

function buildClassLabel(cls: ClassDef): string {
  const parts: string[] = [];

  // Stereotype
  if (cls.stereotype) {
    parts.push(`&lt;&lt;${cls.stereotype}&gt;&gt;`);
  }

  // Class name
  parts.push(`<b>${cls.name}</b>`);
  parts.push('---');

  // Attributes
  if (cls.attributes) {
    for (const attr of cls.attributes) {
      parts.push(`${attr.visibility} ${attr.name}${attr.type ? ': ' + attr.type : ''}`);
    }
  }

  parts.push('---');

  // Methods
  if (cls.methods) {
    for (const method of cls.methods) {
      parts.push(`${method.visibility} ${method.name}${method.type ? ': ' + method.type : ''}`);
    }
  }

  return parts.join('\n');
}

function getRelationStyle(type: ClassRelation['type']): Record<string, string> {
  switch (type) {
    case 'inheritance':
      return { endArrow: 'block', endFill: '0', endSize: '12' };
    case 'implementation':
      return { endArrow: 'block', endFill: '0', endSize: '12', dashed: '1', dashPattern: '8 4' };
    case 'association':
      return { endArrow: 'open', endFill: '0' };
    case 'aggregation':
      return { endArrow: 'diamond', endFill: '0', endSize: '12' };
    case 'composition':
      return { endArrow: 'diamond', endFill: '1', endSize: '12' };
    case 'dependency':
      return { endArrow: 'open', endFill: '0', dashed: '1', dashPattern: '8 4' };
  }
}
