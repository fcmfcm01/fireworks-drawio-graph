import type { StencilLibraryDef } from '../types.js';
import { registerLibrary } from '../registry.js';

const CATEGORY_COLORS: Record<string, string> = {
  behavioral: '#333333',
  structural: '#333333',
};

function s(name: string, category: string, variant: 'resourceIcon' | 'direct' = 'direct') {
  return { name, category, color: CATEGORY_COLORS[category] ?? '#333333', variant };
}

export const umlLibrary: StencilLibraryDef = {
  id: 'uml',
  name: 'UML',
  prefix: 'mxgraph.uml',
  shapes: {
    actor: s('umlActor', 'behavioral'),
    lifeline: s('umlLifeline', 'behavioral'),
    state: s('umlState', 'behavioral'),
    frame: s('umlFrame', 'behavioral'),
    control: s('umlControl', 'structural'),
    boundary: s('umlBoundary', 'structural'),
    entity: s('umlEntity', 'structural'),
    destroy: s('umlDestroy', 'behavioral'),
    component: s('component', 'structural'),
    lollipop: s('lollipop', 'structural'),
    requires: s('requires', 'structural'),
    start_state: s('startState', 'behavioral'),
    end_state: s('endState', 'behavioral'),
    module: s('module', 'structural'),
    note: s('note', 'structural'),
  },
  groups: {},
  resourceIconStyle: 'shape={SHAPE};fillColor={COLOR};strokeColor=#000000;html=1;whiteSpace=wrap;',
  directStyle: 'shape={SHAPE};fillColor={COLOR};strokeColor=#000000;html=1;whiteSpace=wrap;',
  groupStyle: 'swimlane;startSize=25;fillColor={COLOR};strokeColor=#000000;html=1;whiteSpace=wrap;',
};

registerLibrary(umlLibrary);
