import type { StencilLibraryDef } from '../types.js';
import { registerLibrary } from '../registry.js';

const CATEGORY_COLORS: Record<string, string> = {
  Compute: '#FF6A00',
  Storage: '#FF6A00',
  Database: '#FF6A00',
  Networking: '#FF6A00',
  Security: '#FF6A00',
  Analytics: '#FF6A00',
  'AI/ML': '#FF6A00',
  Middleware: '#FF6A00',
  DevTools: '#FF6A00',
};

function s(name: string, category: string, variant: 'resourceIcon' | 'direct' = 'resourceIcon') {
  return { name, category, color: CATEGORY_COLORS[category] ?? '#FF6A00', variant };
}

export const alibabaLibrary: StencilLibraryDef = {
  id: 'alibaba',
  name: 'Alibaba Cloud',
  prefix: 'mxgraph.alibaba_cloud',
  shapes: {
    // Compute
    ecs: s('ecs', 'Compute'),
    eci: s('eci', 'Compute'),
    ack: s('ack', 'Compute'),
    function_compute: s('function_compute', 'Compute', 'direct'),
    simple_application_server: s('simple_application_server', 'Compute'),
    elastic_hpc: s('elastic_hpc', 'Compute'),
    server_load_balancer: s('server_load_balancer', 'Compute'),
    elastic_scaling: s('elastic_scaling', 'Compute'),
    gpu_compute: s('gpu_compute', 'Compute'),
    auto_scaling: s('auto_scaling', 'Compute'),

    // Storage
    oss: s('oss', 'Storage'),
    nas: s('nas', 'Storage'),
    ess: s('ess', 'Storage'),
    hdfs: s('hdfs', 'Storage'),
    cloud_drive: s('cloud_drive', 'Storage'),
    table_store: s('table_store', 'Storage'),
    archive_storage: s('archive_storage', 'Storage'),

    // Database
    rds: s('rds', 'Database'),
    polar_db: s('polar_db', 'Database'),
    ocean_base: s('ocean_base', 'Database'),
    redis: s('redis', 'Database'),
    mongo_db: s('mongo_db', 'Database'),
    hi_store: s('hi_store', 'Database'),
    analytic_db: s('analytic_db', 'Database'),
    drds: s('drds', 'Database'),
    gds: s('gds', 'Database'),

    // Networking
    vpc: s('vpc', 'Networking'),
    slb: s('slb', 'Networking'),
    nat_gateway: s('nat_gateway', 'Networking'),
    vpn_gateway: s('vpn_gateway', 'Networking'),
    express_connect: s('express_connect', 'Networking'),
    cdn: s('cdn', 'Networking'),
    dns: s('dns', 'Networking'),
    cloud_firewall: s('cloud_firewall', 'Networking'),
    eip: s('eip', 'Networking'),
    smart_access_gateway: s('smart_access_gateway', 'Networking'),
    global_acceleration: s('global_acceleration', 'Networking'),
    ipv6_gateway: s('ipv6_gateway', 'Networking'),

    // Security
    anti_ddos: s('anti_ddos', 'Security'),
    security_center: s('security_center', 'Security'),
    waf: s('waf', 'Security'),
    cloud_shield: s('cloud_shield', 'Security'),
    ssl_certificates: s('ssl_certificates', 'Security'),
    bastion_host: s('bastion_host', 'Security'),
    cloud_security_scanner: s('cloud_security_scanner', 'Security'),
    content_moderation: s('content_moderation', 'Security'),
    id_verification: s('id_verification', 'Security'),

    // Analytics
    data_works: s('data_works', 'Analytics'),
    quick_bi: s('quick_bi', 'Analytics'),
    elasticsearch: s('elasticsearch', 'Analytics'),
    emr: s('emr', 'Analytics'),
    max_compute: s('max_compute', 'Analytics'),
    data_integration: s('data_integration', 'Analytics'),
    real_time_compute: s('real_time_compute', 'Analytics'),

    // AI/ML
    pai: s('pai', 'AI/ML'),
    nlp: s('nlp', 'AI/ML'),
    image_search: s('image_search', 'AI/ML'),
    visual_intelligence: s('visual_intelligence', 'AI/ML'),
    machine_translation: s('machine_translation', 'AI/ML'),
    speech_recognition: s('speech_recognition', 'AI/ML'),
    recommendation_engine: s('recommendation_engine', 'AI/ML'),

    // Middleware
    message_queue: s('message_queue', 'Middleware'),
    edas: s('edas', 'Middleware'),
    csb: s('csb', 'Middleware'),
    api_gateway: s('api_gateway', 'Middleware'),
    microservice_engine: s('microservice_engine', 'Middleware'),
    event_bridge: s('event_bridge', 'Middleware'),

    // DevTools
    cloud_toolkit: s('cloud_toolkit', 'DevTools'),
    ros: s('ros', 'DevTools'),
    cloud_shell: s('cloud_shell', 'DevTools'),
    terraform: s('terraform', 'DevTools'),
  },
  groups: {
    vpc_group: { name: 'vpc', fillColor: 'none', strokeColor: '#FF6A00' },
    vswitch: { name: 'vswitch', fillColor: 'none', strokeColor: '#FF6A00' },
    region: { name: 'region', fillColor: 'none', strokeColor: '#FF6A00' },
    zone: { name: 'zone', fillColor: 'none', strokeColor: '#FF6A00' },
    security_group: { name: 'security_group', fillColor: 'none', strokeColor: '#FF6A00' },
  },
  resourceIconStyle: 'shape={PREFIX}.{SHAPE};fillColor={COLOR};strokeColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;',
  directStyle: 'shape={PREFIX}.{SHAPE};fillColor={COLOR};strokeColor=none;gradientColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;',
  groupStyle: 'shape={PREFIX}.group_{GROUP};fillColor=none;strokeColor={STROKE};verticalAlign=top;align=left;spacingLeft=30;fontColor={STROKE};html=1;whiteSpace=wrap;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;',
};

registerLibrary(alibabaLibrary);
