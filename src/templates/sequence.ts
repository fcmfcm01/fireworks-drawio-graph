/**
 * Sequence diagram template.
 *
 * Time-ordered message exchanges between participants (lifelines).
 * Participants as vertical lifelines, messages as horizontal arrows.
 */

import { DiagramBuilder } from '../builder/diagram-builder.js';
import { applyGridSnap, layoutLifelines } from '../builder/layout-engine.js';

export interface SequenceParticipant {
  name: string;
  id?: string;
}

export interface SequenceMessage {
  from: string;
  to: string;
  label: string;
  type?: 'sync' | 'async' | 'return';
  /** Optional loop/alt frame */
  frame?: { type: 'loop' | 'alt' | 'opt'; label: string };
}

export interface SequenceInput {
  title: string;
  style?: number;
  participants: SequenceParticipant[];
  messages: SequenceMessage[];
}

/**
 * Create a sequence diagram.
 */
export function createSequenceDiagram(input: SequenceInput): DiagramBuilder {
  const style = input.style ?? 1;
  const msgCount = input.messages.length;
  const height = 100 + msgCount * 50 + 80;
  const width = Math.max(960, input.participants.length * 180);
  const builder = new DiagramBuilder({ style, title: input.title, width, height });

  // Layout lifelines
  const lifelineXPositions = layoutLifelines(input.participants.length, width, 90);
  const nameToId = new Map<string, string>();
  const nameToX = new Map<string, number>();

  // Add participant boxes at top
  for (let i = 0; i < input.participants.length; i++) {
    const p = input.participants[i];
    const x = lifelineXPositions[i];
    nameToX.set(p.name, x);

    // Participant header box
    const headerId = builder.addNode({
      id: p.id,
      type: 'process',
      label: p.name,
      x: x - 60,
      y: 50,
      width: 120,
      height: 40,
    });
    nameToId.set(p.name, headerId);

    // Lifeline (vertical dashed line as an edge from header to bottom)
    // We use a node styled as a vertical line
    const lifelineId = builder.addNode({
      type: 'raw',
      label: '',
      x: x - 1,
      y: 90,
      width: 2,
      height: height - 140,
      styleOverrides: {
        shape: 'line',
        strokeColor: builder.getTheme().strokeColor,
        dashed: '1',
        dashPattern: '4 2',
        opacity: '50',
      },
    });
  }

  // Add messages as edges between participant lifeline nodes
  // We create invisible anchor nodes at each message level
  for (let mi = 0; mi < input.messages.length; mi++) {
    const msg = input.messages[mi];
    const y = 120 + mi * 50;

    const sourceX = nameToX.get(msg.from) ?? 90;
    const targetX = nameToX.get(msg.to) ?? 180;

    // Create small anchor nodes on the lifelines at this y position
    const anchorSourceId = builder.addNode({
      type: 'raw',
      label: '',
      x: sourceX - 3,
      y: y - 3,
      width: 6,
      height: 6,
      styleOverrides: {
        shape: 'rectangle',
        fillColor: 'none',
        strokeColor: 'none',
        opacity: '0',
      },
    });

    const anchorTargetId = builder.addNode({
      type: 'raw',
      label: '',
      x: targetX - 3,
      y: y - 3,
      width: 6,
      height: 6,
      styleOverrides: {
        shape: 'rectangle',
        fillColor: 'none',
        strokeColor: 'none',
        opacity: '0',
      },
    });

    builder.addEdge({
      source: anchorSourceId,
      target: anchorTargetId,
      label: msg.label,
      flowType: msg.type === 'async' ? 'async' : msg.type === 'return' ? 'control' : 'primary',
      edgeStyle: 'straight',
      styleOverrides: msg.type === 'return' ? { dashed: '1', dashPattern: '5 3' } : {},
    });
  }

  return builder;
}
