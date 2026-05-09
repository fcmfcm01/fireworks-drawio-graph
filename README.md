# Fireworks DrawIO Graph

<div align="center">

**AI-Powered Technical Diagram Generation for draw.io**

Generate production-quality draw.io diagrams (mxGraphModel XML) with 7 style themes,
8 built-in cloud stencil libraries, and automatic external library resolution.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm](https://img.shields.io/npm/v/fireworks-drawio-graph.svg)](https://www.npmjs.com/package/fireworks-drawio-graph)

**[English](#overview) &nbsp;|&nbsp; [中文文档](./README.zh-CN.md)**

</div>

---

## Overview

Fireworks DrawIO Graph is a TypeScript/Node.js library that generates **fully editable** draw.io diagrams (mxGraphModel XML). Unlike SVG-only tools, every output can be opened, rearranged, and re-styled in draw.io, diagrams.net, VS Code Draw.io extension, or any mxGraph-compatible editor.

### Key Features

- **7 Style Themes** — Flat Icon, Dark Terminal, Blueprint, Notion Clean, Glassmorphism, Claude Official, OpenAI Official
- **12+ Diagram Types** — Architecture, Flowchart, Sequence, Data Flow, Class, ER, State Machine, Mind Map, Timeline, Network, Use Case, Comparison
- **8 Built-in Cloud Stencils** — AWS (~150 shapes), Azure (~95), GCP (~75), Alibaba (~60), Kubernetes (36), Cisco (43), UML (15), BPMN (30)
- **Automatic External Libraries** — DigitalOcean, VMware, Arista, Font Awesome, and more from [drawio-libs](https://github.com/jgraph/drawio-libs) — auto-downloaded on first use
- **Shape Search** — Find shapes across all libraries with fuzzy matching
- **MCP Server** — Built-in Model Context Protocol server for AI agent integration
- **CLI** — Command-line interface for quick diagram generation and library management
- **Semantic Shapes** — process→rounded rect, decision→diamond, database→cylinder
- **Arrow Semantics** — 7 flow types with consistent color coding

### Quick Start

```bash
npm install fireworks-drawio-graph
```

```typescript
import { DiagramBuilder } from 'fireworks-drawio-graph';

const builder = new DiagramBuilder({ style: 1, title: 'Microservices' });

const gw = builder.addNode({ type: 'api', label: 'API Gateway', x: 400, y: 80, width: 160, height: 60 });
const svc = builder.addNode({ type: 'process', label: 'Order Service', x: 200, y: 240, width: 160, height: 60 });
const db = builder.addNode({ type: 'database', label: 'PostgreSQL', x: 400, y: 400, width: 160, height: 80 });

builder.addEdge({ source: gw, target: svc, label: 'route', flowType: 'primary' });
builder.addEdge({ source: svc, target: db, label: 'query', flowType: 'memoryRead' });

await builder.toFile('./microservices.drawio');
```

---

## Style Themes

| # | Name | Background | Best For |
|---|------|-----------|----------|
| 1 | Flat Icon (default) | White | Blogs, docs, presentations |
| 2 | Dark Terminal | `#0f0f1a` | GitHub, dev articles |
| 3 | Blueprint | `#0a1628` | Architecture docs |
| 4 | Notion Clean | White | Notion, wikis |
| 5 | Glassmorphism | Dark gradient | Product sites, keynotes |
| 6 | Claude Official | `#f8f6f3` | Warm, approachable |
| 7 | OpenAI Official | White | Clean, modern |

---

## Diagram Types

| Type | Description | Layout |
|------|-------------|--------|
| **Architecture** | Horizontal layers: Client → Gateway → Services → Data | Layered, top-to-bottom |
| **Flowchart** | Sequential steps with decisions | Top-to-bottom |
| **Sequence** | Time-ordered messages between participants | Lifelines + horizontal arrows |
| **Data Flow** | Data transformation pipelines | Left-to-right |
| **Class Diagram** | UML classes with attributes and methods | Grid |
| **ER Diagram** | Entities and relationships | 2-3 row grid |
| **State Machine** | UML state transitions | Radial or linear |
| **Mind Map** | Radial concept map | Center-out |
| **Timeline** | Time axis with milestones | Horizontal axis |
| **Network Topology** | Network devices and connections | Free-form |
| **Use Case** | UML actors and use cases | Oval bubbles |
| **Comparison** | Feature matrix | Table grid |

---

## Cloud & Infrastructure Stencils

### Built-in Libraries

8 stencil libraries are bundled with the package — no download needed.

| Library ID | Name | Shapes | Best For |
|---|---|---|---|
| `aws4` | AWS 2021+ | ~150 | AWS architecture diagrams |
| `azure` | Azure | ~95 | Azure architecture diagrams |
| `gcp2` | Google Cloud | ~75 | GCP architecture diagrams |
| `alibaba` | Alibaba Cloud | ~60 | Alibaba Cloud diagrams |
| `kubernetes` | Kubernetes | 36 | K8s cluster diagrams |
| `cisco` | Cisco | 43 | Network topology |
| `uml` | UML | 15 | UML diagrams |
| `bpmn` | BPMN | 30 | Business process diagrams |

### Using Stencil Shapes

```typescript
import { DiagramBuilder } from 'fireworks-drawio-graph';

const builder = new DiagramBuilder({ style: 1, title: 'AWS Serverless' });

// Add a group container
const vpc = builder.addStencilGroup({
  library: 'aws4', group: 'vpc', label: 'VPC',
  x: 50, y: 50, width: 800, height: 400,
});

// Add service icons
const s3 = builder.addStencilNode({ library: 'aws4', shape: 's3', label: 'S3 Bucket', x: 100, y: 150, parent: vpc });
const lambda = builder.addStencilNode({ library: 'aws4', shape: 'lambda', label: 'Lambda', x: 300, y: 150, parent: vpc });
const dynamo = builder.addStencilNode({ library: 'aws4', shape: 'dynamodb', label: 'DynamoDB', x: 500, y: 150, parent: vpc });

builder.addEdge({ source: lambda, target: dynamo, label: 'query', flowType: 'memoryRead' });
await builder.toFile('./aws-serverless.drawio');
```

### Available Shapes by Library

<details>
<summary><strong>AWS4</strong> (aws4) — ~150 shapes</summary>

- **Compute**: `ec2`, `lambda`, `fargate`, `ecs`, `eks`, `batch`, `lightsail`, `elastic_beanstalk`, `auto_scaling`
- **Storage**: `s3`, `ebs`, `efs`, `glacier`, `backup`
- **Database**: `rds`, `dynamodb`, `aurora`, `redshift`, `elasticache`, `neptune`
- **Networking**: `vpc`, `cloudfront`, `route_53`, `api_gateway`, `load_balancer`, `transit_gateway`
- **Security**: `iam`, `kms`, `guardduty`, `waf`, `cognito`, `secrets_manager`
- **ML/AI**: `sagemaker`, `bedrock`, `comprehend`, `rekognition`, `textract`
- **Groups**: `vpc`, `region`, `availability_zone`, `subnet`, `security_group`, `auto_scaling_group`

</details>

<details>
<summary><strong>Azure</strong> (azure) — ~95 shapes</summary>

- **Compute**: `virtual_machines`, `app_services`, `functions`, `aks`, `container_instances`, `vm_scale_sets`
- **Storage**: `storage_accounts`, `blob_storage`, `managed_disks`
- **Database**: `sql_database`, `cosmos_db`, `redis_cache`
- **Networking**: `virtual_network`, `load_balancer`, `firewall`, `application_gateway`
- **Security**: `key_vault`, `azure_ad`, `security_center`

</details>

<details>
<summary><strong>Google Cloud</strong> (gcp2) — ~75 shapes</summary>

- **Compute**: `compute_engine`, `cloud_functions`, `cloud_run`, `gke`, `app_engine`
- **Storage**: `cloud_storage`, `persistent_disk`
- **Database**: `cloud_sql`, `firestore`, `bigquery`, `bigtable`, `spanner`
- **AI**: `vertex_ai`, `auto_ml`, `cloud_vision`, `natural_language`
- **Groups**: `project`, `vpc`, `region`, `zone`, `subnet`

</details>

<details>
<summary><strong>Alibaba Cloud</strong> (alibaba) — ~60 shapes</summary>

- **Compute**: `ecs`, `ack`, `function_compute`, `elastic_container_instance`
- **Storage**: `oss`, `nas`, `table_store`
- **Database**: `rds`, `polar_db`, `redis`, `mongo_db`
- **Networking**: `vpc`, `slb`, `cdn`, `nat_gateway`

</details>

<details>
<summary><strong>Kubernetes</strong> (kubernetes) — 36 shapes</summary>

- **Core**: `pod`, `service`, `namespace`, `config_map`, `secret`, `ingress`, `node`
- **Workloads**: `deployment`, `replica_set`, `stateful_set`, `daemon_set`, `job`, `cron_job`
- **Networking**: `network_policy`, `cluster_ip`, `load_balancer`, `gateway_api`
- **RBAC**: `role`, `cluster_role`, `role_binding`, `service_account`
- **Control Plane**: `api_server`, `etcd`, `scheduler`, `controller_manager`, `coredns`
- **Groups**: `cluster`, `namespace_group`

</details>

<details>
<summary><strong>Cisco</strong> (cisco) — 43 shapes</summary>

- **Routers**: `router`, `router_round`, `router_firewall`, `wireless_router`
- **Switches**: `switch_layer_3`, `switch_layer_2`, `workgroup_switch`
- **Security**: `firewall`, `vpn_concentrator`, `ids_sensor`
- **Wireless**: `wireless_access_point`
- **Endpoints**: `workstation`, `laptop`, `phone`
- **Network**: `cloud`, `server`, `printer`

</details>

<details>
<summary><strong>UML</strong> (uml) — 15 shapes</summary>

`actor`, `lifeline`, `state`, `frame`, `control`, `boundary`, `entity`, `component`, `start_state`, `end_state`, `note`

</details>

<details>
<summary><strong>BPMN</strong> (bpmn) — 30 shapes</summary>

- **Events**: `start_event`, `end_event`, `intermediate_event`, `start_timer`, `end_terminate`
- **Tasks**: `task`, `user_task`, `service_task`, `script_task`, `sub_process`
- **Gateways**: `exclusive_gateway`, `parallel_gateway`, `inclusive_gateway`
- **Data**: `data_object`, `data_store`, `message`
- **Groups**: `pool`, `lane`

</details>

---

## External Shape Libraries (drawio-libs)

Community shape libraries from [drawio-libs](https://github.com/jgraph/drawio-libs) extend the built-in stencils. These are **automatically downloaded** on first use — no manual setup required.

### Automatic Provider Resolution

Use `addProviderNode()` — it handles provider resolution, library download, and shape placement in a single call:

```typescript
const builder = new DiagramBuilder({ style: 1, title: 'DO Infrastructure' });

// Built-in library — instant, no download
const s3 = await builder.addProviderNode({
  provider: 'aws', shape: 's3', label: 'S3 Bucket', x: 100, y: 100,
});

// External library — auto-downloads DigitalOcean shapes on first use
const droplet = await builder.addProviderNode({
  provider: 'digitalocean', shape: 'Standard Droplet', label: 'Web Server', x: 400, y: 100,
});

builder.addEdge({ source: s3, target: droplet, label: 'backup', flowType: 'async' });
await builder.toFile('./multicloud.drawio');
```

### Provider Aliases

All of these names resolve automatically:

| Provider | Aliases |
|----------|---------|
| AWS | `aws`, `aws4`, `amazon`, `amazon web services` |
| Azure | `azure`, `microsoft azure` |
| GCP | `gcp`, `gcp2`, `google cloud`, `google cloud platform` |
| Alibaba Cloud | `alibaba`, `alibaba cloud`, `alicloud` |
| Kubernetes | `kubernetes`, `k8s` |
| DigitalOcean | `digitalocean`, `do`, `digital ocean` |
| VMware | `vmware`, `esxi`, `vcenter` |
| Arista | `arista` |
| Cisco | `cisco` |
| UML | `uml` |
| BPMN | `bpmn` |

### Shape Search

Search across all libraries (built-in + cached external):

```typescript
// Search all libraries
const results = await DiagramBuilder.searchShapes('load balancer');
// → [{ provider: 'aws4', shape: 'elastic_load_balancing', confidence: 0.6 }, ...]

// Search within a specific provider
const doShapes = await DiagramBuilder.searchShapes('database', 'digitalocean');
```

### Available External Libraries

| Library | Shapes | Auto-Download |
|---------|--------|--------------|
| `digitalocean` | DigitalOcean Droplets, DBs, Networking | Yes |
| `vmware` | VMware ESXi, vCenter | Yes |
| `arista` | Arista networking equipment | Yes |
| `templates` | Generic architecture templates | Yes |
| `material-design-icons` | Material Design icon set | Yes |
| `font-awesome` | Font Awesome icons | Yes |
| `flat-color-icons` | Flat color icon pack | Yes |
| `osa-icons` | OSA security icons | Yes |

---

## Shape Vocabulary

For generic (non-cloud) diagrams, use semantic types that automatically map to the right draw.io shapes:

| Concept | Shape | Notes |
|---------|-------|-------|
| Process / Step | `rounded=1` | Standard box |
| Decision | `rhombus` | Flowcharts |
| Database | `shape=cylinder3` | Cylinder |
| User / Human | `ellipse` | Circle with label |
| LLM / Model | `rounded=1;shadow=1` | Accent fill |
| Agent | `shape=hexagon` | Active controller |
| API / Gateway | `shape=hexagon;size=15` | Hexagon variant |
| Memory (short) | `rounded=1;dashed=1` | Ephemeral |
| Memory (long) | `shape=cylinder3` | Persistent |
| Queue / Stream | `shape=parallelogram` | Pipe shape |
| Document | `shape=document` | Folded corner |

---

## Arrow Semantics

| Flow Type | Color | Stroke | Meaning |
|-----------|-------|--------|---------|
| `primary` | Blue | 2px solid | Main request/response |
| `control` | Orange | 1.5px dashed | System trigger |
| `memoryRead` | Green | 1.5px solid | Data retrieval |
| `memoryWrite` | Green | 1.5px dashed | Data write/store |
| `async` | Gray | 1.5px dashed | Non-blocking event |
| `embedding` | Purple | 1px solid | Data transform |
| `feedback` | Purple | 1.5px curved | Iterative loop |

---

## Cloud Architecture Templates

Pre-built templates for common cloud architectures:

```typescript
import { createAwsArchitectureDiagram } from 'fireworks-drawio-graph';

const xml = createAwsArchitectureDiagram({
  title: 'Serverless App',
  nodes: [
    { shape: 'api_gateway', label: 'API Gateway', x: 400, y: 80 },
    { shape: 'lambda', label: 'Handler', x: 300, y: 200 },
    { shape: 'dynamodb', label: 'Table', x: 500, y: 200 },
  ],
  connections: [
    { from: 0, to: 1, label: 'invoke' },
    { from: 1, to: 2, label: 'query' },
  ],
});
```

Also available: `createAzureArchitectureDiagram`, `createGcpArchitectureDiagram`, `createAlibabaArchitectureDiagram`, `createCloudArchitectureDiagram`.

---

## CLI Usage

```bash
# Generate diagrams
npx fireworks-drawio-graph generate --type architecture --style 1 --output ./arch.drawio
npx fireworks-drawio-graph generate --type flowchart --style 2 --output ./flow.drawio
npx fireworks-drawio-graph generate --type sequence --style 3 --output ./seq.drawio

# List available styles
npx fireworks-drawio-graph styles

# List diagram types
npx fireworks-drawio-graph types

# Validate XML
npx fireworks-drawio-graph validate ./diagram.drawio

# External library management
npx fireworks-drawio-graph download-libs --list                # List available libraries
npx fireworks-drawio-graph download-libs --name digitalocean   # Download a library
npx fireworks-drawio-graph download-libs --name aws4           # Download built-in lib data
npx fireworks-drawio-graph download-libs --search load         # Search shapes
```

---

## MCP Server (for AI Agents)

Add to your Claude Desktop, Cursor, or Hermes config:

```json
{
  "mcpServers": {
    "fireworks-drawio": {
      "command": "npx",
      "args": ["fireworks-drawio-mcp"]
    }
  }
}
```

### MCP Tools

| Tool | Description |
|------|-------------|
| `create_diagram` | Create new diagram from mxGraphModel XML |
| `edit_diagram` | Edit existing diagram (add/update/delete cells) |
| `get_diagram` | Get current diagram XML |
| `export_diagram` | Export to `.drawio`/`.svg`/`.png` file |
| `list_styles` | List 7 style themes |
| `list_diagram_types` | List supported diagram types |
| `generate_diagram_from_template` | Generate from structured template data |

---

## API Reference

### `DiagramBuilder`

Main class for building diagrams.

```typescript
const builder = new DiagramBuilder({
  style: 1,           // Style theme (1-7)
  title: 'My Diagram',
  width: 960,         // Canvas width
  height: 600,        // Canvas height
});
```

**Methods:**

| Method | Description |
|--------|-------------|
| `addNode(def)` | Add a generic node (process, database, API, etc.) |
| `addEdge(def)` | Add a connection between nodes |
| `addGroup(def)` | Add a container/group |
| `addStencilNode(def)` | Add a stencil shape from built-in library |
| `addStencilGroup(def)` | Add a stencil group container |
| `addProviderNode(def)` | **Unified API** — add any provider shape (built-in or external), auto-downloads if needed |
| `addExternalShape(def)` | Add a shape from a cached external library |
| `searchShapes(query, provider?)` | Search shapes across all libraries (static method) |
| `toXml()` | Generate mxGraphModel XML string |
| `toFile(path)` | Write `.drawio` file |
| `toString()` | Get full XML document string |

### `DiagramBuilder.addNode(def)`

```typescript
const node = builder.addNode({
  type: 'process',    // Semantic shape type
  label: 'My Service',
  x: 100, y: 200,
  width: 160, height: 60,
  sublabel: 'v2.1',  // Optional secondary label
  fillColor: '#4A90D9', // Optional custom color
});
```

### `DiagramBuilder.addEdge(def)`

```typescript
builder.addEdge({
  source: nodeA,       // Source node (or ID string)
  target: nodeB,       // Target node (or ID string)
  label: 'request',
  flowType: 'primary', // Arrow semantic type
});
```

### `DiagramBuilder.addProviderNode(def)`

```typescript
// Works for ALL providers — built-in AND external
const node = await builder.addProviderNode({
  provider: 'aws',           // Provider name or alias
  shape: 's3',               // Shape name
  label: 'S3 Bucket',
  x: 100, y: 100,
  width: 60,                 // Optional
  height: 60,                // Optional
  parent: groupNode,         // Optional parent container
});
```

---

## Output

- **Primary**: `.drawio` files (mxGraphModel XML, fully editable)
- **Secondary**: Open in draw.io → export as SVG, PNG, or PDF
- **Default canvas**: 960×600 (configurable via `width`/`height`)

---

## Requirements

- **Node.js** >= 18
- **TypeScript** >= 5.6 (for development)

---

## Installation

```bash
# As a dependency
npm install fireworks-drawio-graph

# Global install (for CLI)
npm install -g fireworks-drawio-graph

# MCP server (separate binary)
npx fireworks-drawio-mcp
```

---

## Inspiration

This project combines the best ideas from:

- [fireworks-tech-graph](https://www.npmjs.com/package/@yizhiyanhua-ai/fireworks-tech-graph) — Style system, shape vocabulary, arrow semantics, layout rules
- [next-ai-draw-io](https://github.com/DayuanJiang/next-ai-draw-io) — draw.io XML generation, MCP server, shape libraries, diagram editing

---

## License

Apache 2.0 — See [LICENSE](./LICENSE)
