import type { StencilLibraryDef } from '../types.js';
import { registerLibrary } from '../registry.js';

const CATEGORY_COLORS: Record<string, string> = {
  Compute: '#0078D4',
  Storage: '#0078D4',
  Networking: '#0078D4',
  Database: '#0078D4',
  Security: '#0078D4',
  'AI/ML': '#0078D4',
  Integration: '#0078D4',
  Analytics: '#0078D4',
  DevOps: '#0078D4',
  Web: '#0078D4',
  Identity: '#0078D4',
  Management: '#0078D4',
  Media: '#0078D4',
  Migration: '#0078D4',
  Monitoring: '#0078D4',
};

function s(name: string, category: string, variant: 'resourceIcon' | 'direct' = 'resourceIcon') {
  return { name, category, color: CATEGORY_COLORS[category] ?? '#0078D4', variant };
}

export const azureLibrary: StencilLibraryDef = {
  id: 'azure',
  name: 'Azure',
  prefix: 'mxgraph.azure',
  shapes: {
    // Compute
    virtual_machines: s('virtual_machines', 'Compute'),
    vm_scale_sets: s('vm_scale_sets', 'Compute'),
    app_services: s('app_services', 'Compute'),
    functions: s('functions', 'Compute', 'direct'),
    container_instances: s('container_instances', 'Compute'),
    aks: s('aks', 'Compute'),
    batch: s('batch', 'Compute'),
    service_fabric: s('service_fabric', 'Compute'),
    virtual_machine: s('virtual_machine', 'Compute'),
    vm_windows: s('vm_windows', 'Compute'),
    vm_linux: s('vm_linux', 'Compute'),
    availability_sets: s('availability_sets', 'Compute'),
    dedicated_hosts: s('dedicated_hosts', 'Compute'),
    image_definitions: s('image_definitions', 'Compute'),

    // Storage
    storage_accounts: s('storage_accounts', 'Storage'),
    blob_storage: s('blob_storage', 'Storage'),
    managed_disks: s('managed_disks', 'Storage'),
    queues: s('queues', 'Storage'),
    files: s('files', 'Storage'),
    data_lake_storage: s('data_lake_storage', 'Storage'),
    storage_explorer: s('storage_explorer', 'Storage'),
    archive_storage: s('archive_storage', 'Storage'),
    netapp_files: s('netapp_files', 'Storage'),
    table_storage: s('table_storage', 'Storage'),

    // Database
    sql_database: s('sql_database', 'Database'),
    cosmos_db: s('cosmos_db', 'Database'),
    database_for_mysql: s('database_for_mysql', 'Database'),
    database_for_postgresql: s('database_for_postgresql', 'Database'),
    redis_cache: s('redis_cache', 'Database'),
    sql_data_warehouse: s('sql_data_warehouse', 'Database'),
    database_migration: s('database_migration', 'Database'),
    sql_server: s('sql_server', 'Database'),
    sql_managed_instance: s('sql_managed_instance', 'Database'),
    elastic_pool: s('elastic_pool', 'Database'),

    // Networking
    virtual_network: s('virtual_network', 'Networking'),
    load_balancer: s('load_balancer', 'Networking'),
    application_gateway: s('application_gateway', 'Networking'),
    vpn_gateway: s('vpn_gateway', 'Networking'),
    expressroute: s('expressroute', 'Networking'),
    dns_zones: s('dns_zones', 'Networking'),
    traffic_manager: s('traffic_manager', 'Networking'),
    front_door: s('front_door', 'Networking'),
    firewall: s('firewall', 'Networking'),
    network_security_groups: s('network_security_groups', 'Networking'),
    cdn: s('cdn', 'Networking'),
    subnet: s('subnet', 'Networking'),
    network_interface: s('network_interface', 'Networking'),
    public_ip: s('public_ip', 'Networking'),
    private_link: s('private_link', 'Networking'),
    bastion: s('bastion', 'Networking'),
    route_tables: s('route_tables', 'Networking'),
    virtual_wan: s('virtual_wan', 'Networking'),

    // Security
    key_vault: s('key_vault', 'Security'),
    security_center: s('security_center', 'Security'),
    active_directory: s('active_directory', 'Security'),
    sentinel: s('sentinel', 'Security'),
    ddos_protection: s('ddos_protection', 'Security'),
    dedicated_hsm: s('dedicated_hsm', 'Security'),
    information_protection: s('information_protection', 'Security'),
    defender: s('defender', 'Security'),

    // AI/ML
    machine_learning: s('machine_learning', 'AI/ML'),
    cognitive_services: s('cognitive_services', 'AI/ML'),
    bot_service: s('bot_service', 'AI/ML'),
    openai: s('openai', 'AI/ML'),
    cognitive_search: s('cognitive_search', 'AI/ML'),
    azure_openai: s('azure_openai', 'AI/ML'),
    text_analytics: s('text_analytics', 'AI/ML'),
    translator: s('translator', 'AI/ML'),
    speech: s('speech', 'AI/ML'),
    vision: s('vision', 'AI/ML'),

    // Integration
    service_bus: s('service_bus', 'Integration'),
    event_grid: s('event_grid', 'Integration'),
    logic_apps: s('logic_apps', 'Integration'),
    api_management: s('api_management', 'Integration'),
    event_hubs: s('event_hubs', 'Integration'),
    functions_integration: s('functions', 'Integration', 'direct'),
    send_grid: s('send_grid', 'Integration'),

    // Analytics
    synapse_analytics: s('synapse_analytics', 'Analytics'),
    data_factory: s('data_factory', 'Analytics'),
    stream_analytics: s('stream_analytics', 'Analytics'),
    databricks: s('databricks', 'Analytics'),
    hdinsight: s('hdinsight', 'Analytics'),
    power_bi_embedded: s('power_bi_embedded', 'Analytics'),
    analysis_services: s('analysis_services', 'Analytics'),
    data_lake_analytics: s('data_lake_analytics', 'Analytics'),

    // DevOps
    devops: s('devops', 'DevOps'),
    pipelines: s('pipelines', 'DevOps'),
    boards: s('boards', 'DevOps'),
    repos: s('repos', 'DevOps'),
    test_plans: s('test_plans', 'DevOps'),
    artifacts: s('artifacts', 'DevOps'),

    // Web
    app_service: s('app_service', 'Web'),
    static_web_apps: s('static_web_apps', 'Web'),
    front_door_web: s('front_door', 'Web'),
    cdn_web: s('cdn', 'Web'),
    api_apps: s('api_apps', 'Web'),
    mobile_apps: s('mobile_apps', 'Web'),

    // Identity
    active_directory_identity: s('active_directory', 'Identity'),
    b2c: s('b2c', 'Identity'),
    domain_services: s('domain_services', 'Identity'),
    information_protection_identity: s('information_protection', 'Identity'),
    conditional_access: s('conditional_access', 'Identity'),
    privileged_identity: s('privileged_identity', 'Identity'),

    // Management
    resource_manager: s('resource_manager', 'Management'),
    monitor: s('monitor', 'Management'),
    automation: s('automation', 'Management'),
    backup: s('backup', 'Management'),
    site_recovery: s('site_recovery', 'Management'),
    advisor: s('advisor', 'Management'),
    cost_management: s('cost_management', 'Management'),
    policy: s('policy', 'Management'),
    tags: s('tags', 'Management'),

    // Media
    media_services: s('media_services', 'Media'),
    encoding: s('encoding', 'Media'),
    streaming: s('streaming', 'Media'),
    content_protection: s('content_protection', 'Media'),

    // Migration
    migrate: s('migrate', 'Migration'),
    data_migration_assistant: s('data_migration_assistant', 'Migration'),
    database_migration_migration: s('database_migration', 'Migration'),
    recovery_services: s('recovery_services', 'Migration'),

    // Monitoring
    log_analytics: s('log_analytics', 'Monitoring'),
    application_insights: s('application_insights', 'Monitoring'),
    alerts: s('alerts', 'Monitoring'),
    metrics: s('metrics', 'Monitoring'),
    workbooks: s('workbooks', 'Monitoring'),
  },
  groups: {
    resource_group: { name: 'resource_group', fillColor: 'none', strokeColor: '#0078D4' },
    subscription: { name: 'subscription', fillColor: 'none', strokeColor: '#0078D4' },
    cloud: { name: 'cloud', fillColor: 'none', strokeColor: '#0078D4' },
  },
  resourceIconStyle: 'shape={PREFIX}.{SHAPE};fillColor={COLOR};strokeColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;',
  directStyle: 'shape={PREFIX}.{SHAPE};fillColor={COLOR};strokeColor=none;gradientColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;',
  groupStyle: 'shape={PREFIX}.group_{GROUP};fillColor=none;strokeColor={STROKE};verticalAlign=top;align=left;spacingLeft=30;fontColor={STROKE};html=1;whiteSpace=wrap;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;',
};

registerLibrary(azureLibrary);
