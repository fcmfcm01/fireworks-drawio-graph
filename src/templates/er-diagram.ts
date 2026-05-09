/**
 * ER (Entity-Relationship) diagram template.
 *
 * Database schema showing entities, attributes, and relationships.
 * Entities as rects, relationships as diamonds, with cardinality labels.
 */

import { DiagramBuilder } from '../builder/diagram-builder.js';
import { layoutGrid } from '../builder/layout-engine.js';

export interface ERAttribute {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

export interface EREntity {
  name: string;
  attributes?: ERAttribute[];
  id?: string;
}

export interface ERRelationship {
  from: string;
  to: string;
  label: string;
  cardinality?: string;  // e.g., '1', 'N', '0..*', '1..*'
}

export interface ERDiagramInput {
  title: string;
  style?: number;
  entities: EREntity[];
  relationships: ERRelationship[];
}

/**
 * Create an ER diagram.
 */
export function createERDiagram(input: ERDiagramInput): DiagramBuilder {
  const style = input.style ?? 1;
  const nodeCount = input.entities.length;
  const cols = Math.min(4, nodeCount);
  const rows = Math.ceil(nodeCount / cols);
  const height = 200 + rows * 180;

  const builder = new DiagramBuilder({ style, title: input.title, height });
  const nameToId = new Map<string, string>();
  const positions = layoutGrid(rows, cols, 200, 140, 960, 60);

  for (let i = 0; i < input.entities.length; i++) {
    const entity = input.entities[i];
    const row = Math.floor(i / cols);
    const col = i % cols;
    const pos = positions[row]?.[col];

    if (pos) {
      // Build entity label with attributes
      const label = buildEntityLabel(entity);
      const id = builder.addNode({
        id: entity.id,
        type: 'entity',
        label: label,
        x: pos.x,
        y: pos.y,
        width: 200,
        height: 140,
        styleOverrides: {
          overflow: 'fill',
        },
      });
      nameToId.set(entity.name, id);
      if (entity.id) nameToId.set(entity.id, id);
    }
  }

  // Add relationships as edges between entities
  for (const rel of input.relationships) {
    const sourceId = nameToId.get(rel.from);
    const targetId = nameToId.get(rel.to);
    if (sourceId && targetId) {
      builder.addEdge({
        source: sourceId,
        target: targetId,
        label: `${rel.label}${rel.cardinality ? ' (' + rel.cardinality + ')' : ''}`,
        flowType: 'primary',
        edgeStyle: 'straight',
      });
    }
  }

  return builder;
}

function buildEntityLabel(entity: EREntity): string {
  const parts: string[] = [`<b>${entity.name}</b>`];

  if (entity.attributes && entity.attributes.length > 0) {
    parts.push('---');
    for (const attr of entity.attributes) {
      let prefix = '';
      if (attr.isPrimaryKey) prefix = '<u>';
      else if (attr.isForeignKey) prefix = '<i>';

      let suffix = '';
      if (attr.isPrimaryKey) suffix = '</u>';
      else if (attr.isForeignKey) suffix = '</i>';

      parts.push(`${prefix}${attr.name}: ${attr.type}${suffix}`);
    }
  }

  return parts.join('\n');
}
