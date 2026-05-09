/**
 * State machine diagram template (UML).
 *
 * Shows lifecycle states and transitions of an entity.
 * Initial state (filled circle) → states → final state (double circle).
 */

import { DiagramBuilder } from '../builder/diagram-builder.js';
import { layoutGrid } from '../builder/layout-engine.js';

export interface StateDef {
  name: string;
  id?: string;
  type?: 'state' | 'start' | 'end' | 'choice';
  entryAction?: string;
  exitAction?: string;
}

export interface StateTransition {
  from: string;
  to: string;
  event?: string;
  guard?: string;   // [condition]
  action?: string;   // /action
}

export interface StateMachineInput {
  title: string;
  style?: number;
  states: StateDef[];
  transitions: StateTransition[];
}

/**
 * Create a state machine diagram.
 */
export function createStateMachineDiagram(input: StateMachineInput): DiagramBuilder {
  const style = input.style ?? 1;
  const stateCount = input.states.filter(s => s.type !== 'start' && s.type !== 'end').length;
  const cols = Math.min(4, stateCount);
  const rows = Math.ceil(stateCount / cols);
  const height = 200 + rows * 140;

  const builder = new DiagramBuilder({ style, title: input.title, height });
  const nameToId = new Map<string, string>();

  // Place start state at top-left
  const startStates = input.states.filter(s => s.type === 'start');
  const endStates = input.states.filter(s => s.type === 'end');
  const regularStates = input.states.filter(s => s.type !== 'start' && s.type !== 'end');

  // Layout regular states
  const positions = layoutGrid(rows || 1, cols || 1, 160, 70, 960, 80);

  // Add start state
  if (startStates.length > 0) {
    const startId = builder.addNode({
      id: startStates[0].id,
      type: 'start',
      label: '',
      x: 40,
      y: 80,
      width: 30,
      height: 30,
    });
    nameToId.set(startStates[0].name, startId);
  }

  // Add end state
  if (endStates.length > 0) {
    const endId = builder.addNode({
      id: endStates[0].id,
      type: 'end',
      label: '',
      x: 860,
      y: 80 + (rows - 1) * 140,
      width: 30,
      height: 30,
    });
    nameToId.set(endStates[0].name, endId);
  }

  // Add regular states
  for (let i = 0; i < regularStates.length; i++) {
    const state = regularStates[i];
    const row = Math.floor(i / cols);
    const col = i % cols;
    const pos = positions[row]?.[col];

    if (pos) {
      let label = state.name;
      if (state.entryAction) label += `\nentry/ ${state.entryAction}`;
      if (state.exitAction) label += `\nexit/ ${state.exitAction}`;

      const id = builder.addNode({
        id: state.id,
        type: state.type === 'choice' ? 'decision' : 'state',
        label: label,
        x: pos.x,
        y: pos.y,
        width: 160,
        height: 70,
      });
      nameToId.set(state.name, id);
      if (state.id) nameToId.set(state.id, id);
    }
  }

  // Add transitions
  for (const trans of input.transitions) {
    const sourceId = nameToId.get(trans.from);
    const targetId = nameToId.get(trans.to);
    if (sourceId && targetId) {
      const labelParts: string[] = [];
      if (trans.event) labelParts.push(trans.event);
      if (trans.guard) labelParts.push(`[${trans.guard}]`);
      if (trans.action) labelParts.push(`/ ${trans.action}`);

      builder.addEdge({
        source: sourceId,
        target: targetId,
        label: labelParts.join(' '),
        flowType: 'primary',
      });
    }
  }

  return builder;
}
