import type { StencilLibraryDef } from '../types.js';
import { registerLibrary } from '../registry.js';

const CATEGORY_COLORS: Record<string, string> = {
  Compute: '#4285F4',
  Storage: '#4285F4',
  Database: '#4285F4',
  Networking: '#4285F4',
  'AI/ML': '#34A853',
  Analytics: '#4285F4',
  Security: '#4285F4',
  DevTools: '#4285F4',
  Integration: '#4285F4',
};

function s(name: string, category: string, variant: 'resourceIcon' | 'direct' = 'resourceIcon') {
  return { name, category, color: CATEGORY_COLORS[category] ?? '#4285F4', variant };
}

export const gcp2Library: StencilLibraryDef = {
  id: 'gcp2',
  name: 'Google Cloud Platform',
  prefix: 'mxgraph.gcp2',
  shapes: {
    // Compute
    compute_engine: s('compute_engine', 'Compute'),
    app_engine: s('app_engine', 'Compute'),
    cloud_functions: s('cloud_functions', 'Compute', 'direct'),
    cloud_run: s('cloud_run', 'Compute'),
    gke: s('gke', 'Compute'),
    batch: s('batch', 'Compute'),
    bare_metal: s('bare_metal', 'Compute'),
    vm_instances: s('vm_instances', 'Compute'),
    instance_groups: s('instance_groups', 'Compute'),
    sole_tenant: s('sole_tenant', 'Compute'),
    preemtible_vms: s('preemtible_vms', 'Compute'),
    shielded_vms: s('shielded_vms', 'Compute'),

    // Storage
    cloud_storage: s('cloud_storage', 'Storage'),
    persistent_disk: s('persistent_disk', 'Storage'),
    filestore: s('filestore', 'Storage'),
    archive: s('archive', 'Storage'),
    nearline: s('nearline', 'Storage'),
    cloud_storage_bucket: s('cloud_storage_bucket', 'Storage'),
    transfer_service: s('transfer_service', 'Storage'),

    // Database
    cloud_sql: s('cloud_sql', 'Database'),
    firestore: s('firestore', 'Database'),
    bigtable: s('bigtable', 'Database'),
    spanner: s('spanner', 'Database'),
    memorystore: s('memorystore', 'Database'),
    alloydb: s('alloydb', 'Database'),
    data_fusion: s('data_fusion', 'Database'),
    firebase_realtime_database: s('firebase_realtime_database', 'Database'),

    // Networking
    vpc: s('vpc', 'Networking'),
    cloud_load_balancing: s('cloud_load_balancing', 'Networking'),
    cloud_cdn: s('cloud_cdn', 'Networking'),
    cloud_dns: s('cloud_dns', 'Networking'),
    cloud_interconnect: s('cloud_interconnect', 'Networking'),
    cloud_vpn: s('cloud_vpn', 'Networking'),
    cloud_armor: s('cloud_armor', 'Networking'),
    cloud_nAT: s('cloud_nAT', 'Networking'),
    cloud_router: s('cloud_router', 'Networking'),
    traffic_director: s('traffic_director', 'Networking'),
    network_service_tiers: s('network_service_tiers', 'Networking'),

    // AI/ML
    vertex_ai: s('vertex_ai', 'AI/ML'),
    auto_ml: s('auto_ml', 'AI/ML'),
    vision: s('vision', 'AI/ML'),
    natural_language: s('natural_language', 'AI/ML'),
    speech_to_text: s('speech_to_text', 'AI/ML'),
    translation: s('translation', 'AI/ML'),
    dialogflow: s('dialogflow', 'AI/ML'),
    recommendations_ai: s('recommendations_ai', 'AI/ML'),
    document_ai: s('document_ai', 'AI/ML'),
    cloud_tpu: s('cloud_tpu', 'AI/ML'),
    generative_ai: s('generative_ai', 'AI/ML'),
    ai_platform: s('ai_platform', 'AI/ML'),

    // Analytics
    bigquery: s('bigquery', 'Analytics'),
    dataflow: s('dataflow', 'Analytics'),
    dataproc: s('dataproc', 'Analytics'),
    pub_sub: s('pub_sub', 'Analytics'),
    data_catalog: s('data_catalog', 'Analytics'),
    looker: s('looker', 'Analytics'),
    cloud_composer: s('cloud_composer', 'Analytics'),
    data_studio: s('data_studio', 'Analytics'),
    google_analytics: s('google_analytics', 'Analytics'),

    // Security
    iam: s('iam', 'Security'),
    cloud_kms: s('cloud_kms', 'Security'),
    security_command_center: s('security_command_center', 'Security'),
    cloud_iam: s('cloud_iam', 'Security'),
    binary_authorization: s('binary_authorization', 'Security'),
    certificate_authority_service: s('certificate_authority_service', 'Security'),
    secret_manager: s('secret_manager', 'Security'),
    access_context_manager: s('access_context_manager', 'Security'),
    cloud_dlp: s('cloud_dlp', 'Security'),

    // DevTools
    cloud_build: s('cloud_build', 'DevTools'),
    artifact_registry: s('artifact_registry', 'DevTools'),
    cloud_source_repositories: s('cloud_source_repositories', 'DevTools'),
    cloud_deploy: s('cloud_deploy', 'DevTools'),
    firebase: s('firebase', 'DevTools'),
    container_registry: s('container_registry', 'DevTools'),
    test_lab: s('test_lab', 'DevTools'),
    operations_suite: s('operations_suite', 'DevTools'),

    // Integration
    eventarc: s('eventarc', 'Integration'),
    cloud_tasks: s('cloud_tasks', 'Integration'),
    workflows: s('workflows', 'Integration'),
    api_gateway: s('api_gateway', 'Integration'),
    apigee: s('apigee', 'Integration'),
    pub_sub_integration: s('pub_sub', 'Integration'),
    cloud_scheduler: s('cloud_scheduler', 'Integration'),
    connectors: s('connectors', 'Integration'),
  },
  groups: {
    project: { name: 'project', fillColor: 'none', strokeColor: '#4285F4' },
    region: { name: 'region', fillColor: 'none', strokeColor: '#4285F4' },
    zone: { name: 'zone', fillColor: 'none', strokeColor: '#4285F4' },
    vpc_group: { name: 'vpc', fillColor: 'none', strokeColor: '#4285F4' },
    subnet: { name: 'subnet', fillColor: 'none', strokeColor: '#4285F4' },
  },
  resourceIconStyle: 'shape={PREFIX}.{SHAPE};fillColor={COLOR};strokeColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;',
  directStyle: 'shape={PREFIX}.{SHAPE};fillColor={COLOR};strokeColor=none;gradientColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;',
  groupStyle: 'shape={PREFIX}.group_{GROUP};fillColor=none;strokeColor={STROKE};verticalAlign=top;align=left;spacingLeft=30;fontColor={STROKE};html=1;whiteSpace=wrap;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;',
};

registerLibrary(gcp2Library);
