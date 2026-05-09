import type { StencilLibraryDef } from '../types.js';
import { registerLibrary } from '../registry.js';

const CATEGORY_COLORS: Record<string, string> = {
  routers: '#005073',
  switches: '#005073',
  security: '#005073',
  wireless: '#005073',
  voice: '#005073',
  endpoints: '#005073',
  network: '#005073',
};

function s(name: string, category: string, variant: 'resourceIcon' | 'direct' = 'resourceIcon') {
  return { name, category, color: CATEGORY_COLORS[category] ?? '#005073', variant };
}

export const ciscoLibrary: StencilLibraryDef = {
  id: 'cisco',
  name: 'Cisco',
  prefix: 'mxgraph.cisco19',
  shapes: {
    // ── Routers ────────────────────────────────────────────
    router: s('router', 'routers'),
    router_round: s('router_round', 'routers'),
    router_firewall: s('router_firewall', 'routers'),
    router_silicon: s('router_silicon', 'routers'),
    content_service_router: s('content_service_router', 'routers'),
    wireless_router: s('wireless_router', 'routers'),

    // ── Switches ───────────────────────────────────────────
    switch_layer_3: s('switch_layer_3', 'switches'),
    switch_layer_2: s('switch_layer_2', 'switches'),
    workgroup_switch: s('workgroup_switch', 'switches'),
    lan_to_lan_switch: s('lan_to_lan_switch', 'switches'),
    virtual_layer_switch: s('virtual_layer_switch', 'switches'),

    // ── Security ───────────────────────────────────────────
    firewall: s('firewall', 'security'),
    firewalls: s('firewalls', 'security'),
    firewall_subnet_router: s('firewall_subnet_router', 'security'),
    vpn_concentrator: s('vpn_concentrator', 'security'),
    vpn_gateway: s('vpn_gateway', 'security'),
    ids_sensor: s('ids_sensor', 'security'),
    web_browser: s('web_browser', 'security'),
    lock_and_key: s('lock_and_key', 'security'),
    key: s('key', 'security'),

    // ── Wireless ───────────────────────────────────────────
    wireless_access_point: s('wireless_access_point', 'wireless'),
    wireless_bridge: s('wireless_bridge', 'wireless'),
    wireless_location_ap: s('wireless_location_ap', 'wireless'),
    wireless_lan_controller: s('wireless_lan_controller', 'wireless'),
    antennae: s('antennae', 'wireless'),

    // ── Voice ──────────────────────────────────────────────
    call_manager: s('call_manager', 'voice'),
    phone: s('phone', 'voice'),
    ip_phone: s('ip_phone', 'voice'),
    mobile_access_ip_phone: s('mobile_access_ip_phone', 'voice'),
    conference_seer: s('conference_seer', 'voice'),

    // ── Endpoints ──────────────────────────────────────────
    workstation: s('workstation', 'endpoints'),
    pc: s('pc', 'endpoints'),
    laptop: s('laptop', 'endpoints'),
    tablet: s('tablet', 'endpoints'),
    smartphone: s('smartphone', 'endpoints'),
    printer: s('printer', 'endpoints'),
    file_server: s('file_server', 'endpoints'),
    www_server: s('www_server', 'endpoints'),

    // ── Network ────────────────────────────────────────────
    cloud: s('cloud', 'network'),
    cloud_dark: s('cloud_dark', 'network'),
    cloud_white: s('cloud_white', 'network'),
    internet: s('internet', 'network'),
    broadband_router: s('broadband_router', 'network'),
    atm_fast_gigabit_ethr: s('atm_fast_gigabit_ethr', 'network'),
  },
  groups: {
    building: { name: 'building', fillColor: 'none', strokeColor: '#005073' },
    campus: { name: 'campus', fillColor: 'none', strokeColor: '#005073' },
    subnet_group: { name: 'subnet_group', fillColor: 'none', strokeColor: '#005073' },
  },
  resourceIconStyle: 'shape={PREFIX}.{SHAPE};fillColor={COLOR};strokeColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;',
  directStyle: 'shape={PREFIX}.{SHAPE};fillColor={COLOR};strokeColor=none;gradientColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;',
  groupStyle: 'shape={PREFIX}.group_{GROUP};fillColor=none;strokeColor={STROKE};verticalAlign=top;align=left;spacingLeft=30;fontColor={STROKE};html=1;whiteSpace=wrap;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;',
};

registerLibrary(ciscoLibrary);
