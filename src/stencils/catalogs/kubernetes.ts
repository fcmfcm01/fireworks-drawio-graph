import type { StencilLibraryDef } from '../types.js';
import { registerLibrary } from '../registry.js';

const CATEGORY_COLORS: Record<string, string> = {
  core: '#326CE5',
  workloads: '#326CE5',
  networking: '#326CE5',
  storage: '#326CE5',
  rbac: '#326CE5',
  control_plane: '#326CE5',
};

function s(name: string, category: string, variant: 'resourceIcon' | 'direct' = 'resourceIcon') {
  return { name, category, color: CATEGORY_COLORS[category] ?? '#326CE5', variant };
}

export const kubernetesLibrary: StencilLibraryDef = {
  id: 'kubernetes',
  name: 'Kubernetes',
  prefix: 'mxgraph.kubernetes',
  shapes: {
    // ── Core ────────────────────────────────────────────────
    pod: s('pod', 'core'),
    replication_controller: s('replication_controller', 'core'),
    service: s('service', 'core'),
    node: s('node', 'core'),
    namespace: s('namespace', 'core'),
    persistent_volume: s('persistent_volume', 'core'),
    persistent_volume_claim: s('persistent_volume_claim', 'core'),
    config_map: s('config_map', 'core'),
    secret: s('secret', 'core'),
    ingress: s('ingress', 'core'),
    endpoint: s('endpoint', 'core'),

    // ── Workloads ──────────────────────────────────────────
    deployment: s('deployment', 'workloads'),
    replica_set: s('replica_set', 'workloads'),
    stateful_set: s('stateful_set', 'workloads'),
    daemon_set: s('daemon_set', 'workloads'),
    job: s('job', 'workloads'),
    cron_job: s('cron_job', 'workloads'),

    // ── Networking ─────────────────────────────────────────
    network_policy: s('network_policy', 'networking'),
    cluster_ip: s('cluster_ip', 'networking'),
    load_balancer: s('load_balancer', 'networking'),
    external_name: s('external_name', 'networking'),
    ingress_controller: s('ingress_controller', 'networking'),
    gateway_api: s('gateway_api', 'networking'),

    // ── Storage ────────────────────────────────────────────
    storage_class: s('storage_class', 'storage'),
    csi_driver: s('csi_driver', 'storage'),
    volume_attachment: s('volume_attachment', 'storage'),

    // ── RBAC ───────────────────────────────────────────────
    role: s('role', 'rbac'),
    cluster_role: s('cluster_role', 'rbac'),
    role_binding: s('role_binding', 'rbac'),
    cluster_role_binding: s('cluster_role_binding', 'rbac'),
    service_account: s('service_account', 'rbac'),

    // ── Control Plane ──────────────────────────────────────
    api_server: s('api_server', 'control_plane'),
    etcd: s('etcd', 'control_plane'),
    scheduler: s('scheduler', 'control_plane'),
    controller_manager: s('controller_manager', 'control_plane'),
    coredns: s('coredns', 'control_plane'),
  },
  groups: {
    cluster: { name: 'cluster', fillColor: 'none', strokeColor: '#326CE5' },
    namespace_group: { name: 'namespace_group', fillColor: 'none', strokeColor: '#326CE5' },
  },
  resourceIconStyle: 'shape={PREFIX}.{SHAPE};fillColor={COLOR};strokeColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;',
  directStyle: 'shape={PREFIX}.{SHAPE};fillColor={COLOR};strokeColor=none;gradientColor=none;verticalLabelPosition=bottom;verticalAlign=top;align=center;html=1;fontSize=12;fontStyle=0;aspect=fixed;pointerEvents=1;',
  groupStyle: 'shape={PREFIX}.group_{GROUP};fillColor=none;strokeColor={STROKE};verticalAlign=top;align=left;spacingLeft=30;fontColor={STROKE};html=1;whiteSpace=wrap;container=1;pointerEvents=0;collapsible=0;recursiveResize=0;',
};

registerLibrary(kubernetesLibrary);
