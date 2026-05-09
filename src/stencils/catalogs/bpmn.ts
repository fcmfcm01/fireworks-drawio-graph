import type { StencilLibraryDef } from '../types.js';
import { registerLibrary } from '../registry.js';

const CATEGORY_COLORS: Record<string, string> = {
  events: '#000000',
  tasks: '#000000',
  gateways: '#000000',
  data: '#000000',
  flow: '#000000',
};

function s(name: string, category: string, variant: 'resourceIcon' | 'direct' = 'resourceIcon') {
  return { name, category, color: CATEGORY_COLORS[category] ?? '#000000', variant };
}

export const bpmnLibrary: StencilLibraryDef = {
  id: 'bpmn',
  name: 'BPMN',
  prefix: 'mxgraph.bpmn',
  shapes: {
    // ── Events ─────────────────────────────────────────────
    start_event: s('start_event', 'events'),
    start_timer: s('start_timer', 'events'),
    start_message: s('start_message', 'events'),
    start_signal: s('start_signal', 'events'),
    end_event: s('end_event', 'events'),
    end_terminate: s('end_terminate', 'events'),
    end_cancel: s('end_cancel', 'events'),
    intermediate_event: s('intermediate_event', 'events'),
    intermediate_timer: s('intermediate_timer', 'events'),
    intermediate_message: s('intermediate_message', 'events'),
    intermediate_signal: s('intermediate_signal', 'events'),

    // ── Tasks ──────────────────────────────────────────────
    task: s('task', 'tasks'),
    user_task: s('user_task', 'tasks'),
    service_task: s('service_task', 'tasks'),
    script_task: s('script_task', 'tasks'),
    manual_task: s('manual_task', 'tasks'),
    business_rule_task: s('business_rule_task', 'tasks'),
    receive_task: s('receive_task', 'tasks'),
    send_task: s('send_task', 'tasks'),
    sub_process: s('sub_process', 'tasks'),
    call_activity: s('call_activity', 'tasks'),

    // ── Gateways ───────────────────────────────────────────
    exclusive_gateway: s('exclusive_gateway', 'gateways'),
    parallel_gateway: s('parallel_gateway', 'gateways'),
    inclusive_gateway: s('inclusive_gateway', 'gateways'),
    event_based_gateway: s('event_based_gateway', 'gateways'),
    complex_gateway: s('complex_gateway', 'gateways'),

    // ── Data ───────────────────────────────────────────────
    data_object: s('data_object', 'data'),
    data_store: s('data_store', 'data'),
    message: s('message', 'data'),

    // ── Flow ───────────────────────────────────────────────
    sequence_flow: s('sequence_flow', 'flow'),
    message_flow: s('message_flow', 'flow'),
    association: s('association', 'flow'),
  },
  groups: {
    pool: { name: 'pool', fillColor: 'none', strokeColor: '#000000' },
    lane: { name: 'lane', fillColor: 'none', strokeColor: '#000000' },
  },
  resourceIconStyle: 'shape={PREFIX}.{SHAPE};fillColor={COLOR};strokeColor=#000000;html=1;whiteSpace=wrap;',
  directStyle: 'shape={PREFIX}.{SHAPE};fillColor={COLOR};strokeColor=#000000;html=1;whiteSpace=wrap;',
  groupStyle: 'shape={PREFIX}.group_{GROUP};fillColor=none;strokeColor={STROKE};verticalAlign=top;align=left;spacingLeft=30;fontColor={STROKE};html=1;whiteSpace=wrap;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;',
};

registerLibrary(bpmnLibrary);
