# Fireworks DrawIO Graph

<div align="center">

**AI-Powered Technical Diagram Generation for draw.io**

Generate production-quality draw.io diagrams (mxGraphModel XML) with 7 style themes,
8 built-in cloud stencil libraries, and automatic external library resolution.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm](https://img.shields.io/npm/v/fireworks-drawio-graph.svg)](https://www.npmjs.com/package/fireworks-drawio-graph)

**[English](#overview) &nbsp;|&nbsp; [中文文档](#概览)**

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

---
---

<a id="概览"></a>

# 中文文档

<div align="center">

**AI 驱动的 draw.io 技术图表生成器**

生成生产级 draw.io 图表（mxGraphModel XML），内置 7 种样式主题、8 个云服务图形库和自动外部库解析。

</div>

---

## 概览

Fireworks DrawIO Graph 是一个 TypeScript/Node.js 库，用于生成**完全可编辑**的 draw.io 图表（mxGraphModel XML）。与仅支持 SVG 的工具不同，所有输出都可以在 draw.io、diagrams.net、VS Code Draw.io 扩展或任何兼容 mxGraph 的编辑器中打开、重新排列和调整样式。

### 核心特性

- **7 种样式主题** — Flat Icon、Dark Terminal、Blueprint、Notion Clean、Glassmorphism、Claude Official、OpenAI Official
- **12+ 种图表类型** — 架构图、流程图、时序图、数据流图、类图、ER 图、状态机、思维导图、时间线、网络拓扑、用例图、对比图
- **8 个内置云服务图形库** — AWS（约150个图形）、Azure（约95个）、GCP（约75个）、阿里云（约60个）、Kubernetes（36个）、Cisco（43个）、UML（15个）、BPMN（30个）
- **自动外部库** — DigitalOcean、VMware、Arista、Font Awesome 等 [drawio-libs](https://github.com/jgraph/drawio-libs) 社区图形库，首次使用时自动下载
- **图形搜索** — 跨所有图形库进行模糊匹配搜索
- **MCP 服务器** — 内置 Model Context Protocol 服务器，用于 AI 代理集成
- **命令行工具** — 快速生成图表和管理图形库
- **语义化图形** — process→圆角矩形、decision→菱形、database→圆柱体
- **箭头语义** — 7 种流类型，具有一致的颜色编码

### 快速开始

```bash
npm install fireworks-drawio-graph
```

```typescript
import { DiagramBuilder } from 'fireworks-drawio-graph';

const builder = new DiagramBuilder({ style: 1, title: '微服务架构' });

const gw = builder.addNode({ type: 'api', label: 'API 网关', x: 400, y: 80, width: 160, height: 60 });
const svc = builder.addNode({ type: 'process', label: '订单服务', x: 200, y: 240, width: 160, height: 60 });
const db = builder.addNode({ type: 'database', label: 'PostgreSQL', x: 400, y: 400, width: 160, height: 80 });

builder.addEdge({ source: gw, target: svc, label: '路由', flowType: 'primary' });
builder.addEdge({ source: svc, target: db, label: '查询', flowType: 'memoryRead' });

await builder.toFile('./microservices.drawio');
```

---

## 样式主题

| 编号 | 名称 | 背景 | 适用场景 |
|------|------|------|----------|
| 1 | Flat Icon（默认） | 白色 | 博客、文档、演示 |
| 2 | Dark Terminal | `#0f0f1a` | GitHub、技术文章 |
| 3 | Blueprint | `#0a1628` | 架构文档 |
| 4 | Notion Clean | 白色 | Notion、Wiki |
| 5 | Glassmorphism | 暗色渐变 | 产品展示、演讲 |
| 6 | Claude Official | `#f8f6f3` | 温暖、亲和 |
| 7 | OpenAI Official | 白色 | 简洁、现代 |

---

## 图表类型

| 类型 | 描述 | 布局方式 |
|------|------|----------|
| **架构图** | 水平分层：客户端 → 网关 → 服务 → 数据 | 分层，自上而下 |
| **流程图** | 包含决策的顺序步骤 | 自上而下 |
| **时序图** | 参与者之间的时间排序消息 | 生命线 + 水平箭头 |
| **数据流图** | 数据转换管道 | 从左到右 |
| **类图** | UML 类（含属性和方法） | 网格 |
| **ER 图** | 实体与关系 | 2-3 行网格 |
| **状态机** | UML 状态转换 | 径向或线性 |
| **思维导图** | 径向概念图 | 中心向外 |
| **时间线** | 带里程碑的时间轴 | 水平轴 |
| **网络拓扑** | 网络设备和连接 | 自由布局 |
| **用例图** | UML 参与者和用例 | 椭圆气泡 |
| **对比图** | 功能矩阵 | 表格网格 |

---

## 云服务与基础设施图形

### 内置图形库

8 个图形库随包一起打包，无需下载。

| 图形库 ID | 名称 | 图形数量 | 适用场景 |
|---|---|---|---|
| `aws4` | AWS 2021+ | ~150 | AWS 架构图 |
| `azure` | Azure | ~95 | Azure 架构图 |
| `gcp2` | Google Cloud | ~75 | GCP 架构图 |
| `alibaba` | 阿里云 | ~60 | 阿里云架构图 |
| `kubernetes` | Kubernetes | 36 | K8s 集群图 |
| `cisco` | Cisco | 43 | 网络拓扑图 |
| `uml` | UML | 15 | UML 图 |
| `bpmn` | BPMN | 30 | 业务流程图 |

### 使用图形模板

```typescript
import { DiagramBuilder } from 'fireworks-drawio-graph';

const builder = new DiagramBuilder({ style: 1, title: 'AWS 无服务器架构' });

// 添加分组容器
const vpc = builder.addStencilGroup({
  library: 'aws4', group: 'vpc', label: 'VPC',
  x: 50, y: 50, width: 800, height: 400,
});

// 添加服务图标
const s3 = builder.addStencilNode({ library: 'aws4', shape: 's3', label: 'S3 存储桶', x: 100, y: 150, parent: vpc });
const lambda = builder.addStencilNode({ library: 'aws4', shape: 'lambda', label: 'Lambda', x: 300, y: 150, parent: vpc });
const dynamo = builder.addStencilNode({ library: 'aws4', shape: 'dynamodb', label: 'DynamoDB', x: 500, y: 150, parent: vpc });

builder.addEdge({ source: lambda, target: dynamo, label: '查询', flowType: 'memoryRead' });
await builder.toFile('./aws-serverless.drawio');
```

### 各图形库可用图形

<details>
<summary><strong>AWS4</strong>（aws4）— 约150个图形</summary>

- **计算**: `ec2`, `lambda`, `fargate`, `ecs`, `eks`, `batch`, `lightsail`, `elastic_beanstalk`, `auto_scaling`
- **存储**: `s3`, `ebs`, `efs`, `glacier`, `backup`
- **数据库**: `rds`, `dynamodb`, `aurora`, `redshift`, `elasticache`, `neptune`
- **网络**: `vpc`, `cloudfront`, `route_53`, `api_gateway`, `load_balancer`, `transit_gateway`
- **安全**: `iam`, `kms`, `guardduty`, `waf`, `cognito`, `secrets_manager`
- **ML/AI**: `sagemaker`, `bedrock`, `comprehend`, `rekognition`, `textract`
- **分组**: `vpc`, `region`, `availability_zone`, `subnet`, `security_group`, `auto_scaling_group`

</details>

<details>
<summary><strong>Azure</strong>（azure）— 约95个图形</summary>

- **计算**: `virtual_machines`, `app_services`, `functions`, `aks`, `container_instances`, `vm_scale_sets`
- **存储**: `storage_accounts`, `blob_storage`, `managed_disks`
- **数据库**: `sql_database`, `cosmos_db`, `redis_cache`
- **网络**: `virtual_network`, `load_balancer`, `firewall`, `application_gateway`
- **安全**: `key_vault`, `azure_ad`, `security_center`

</details>

<details>
<summary><strong>Google Cloud</strong>（gcp2）— 约75个图形</summary>

- **计算**: `compute_engine`, `cloud_functions`, `cloud_run`, `gke`, `app_engine`
- **存储**: `cloud_storage`, `persistent_disk`
- **数据库**: `cloud_sql`, `firestore`, `bigquery`, `bigtable`, `spanner`
- **AI**: `vertex_ai`, `auto_ml`, `cloud_vision`, `natural_language`
- **分组**: `project`, `vpc`, `region`, `zone`, `subnet`

</details>

<details>
<summary><strong>阿里云</strong>（alibaba）— 约60个图形</summary>

- **计算**: `ecs`, `ack`, `function_compute`, `elastic_container_instance`
- **存储**: `oss`, `nas`, `table_store`
- **数据库**: `rds`, `polar_db`, `redis`, `mongo_db`
- **网络**: `vpc`, `slb`, `cdn`, `nat_gateway`

</details>

<details>
<summary><strong>Kubernetes</strong>（kubernetes）— 36个图形</summary>

- **核心**: `pod`, `service`, `namespace`, `config_map`, `secret`, `ingress`, `node`
- **工作负载**: `deployment`, `replica_set`, `stateful_set`, `daemon_set`, `job`, `cron_job`
- **网络**: `network_policy`, `cluster_ip`, `load_balancer`, `gateway_api`
- **RBAC**: `role`, `cluster_role`, `role_binding`, `service_account`
- **控制平面**: `api_server`, `etcd`, `scheduler`, `controller_manager`, `coredns`
- **分组**: `cluster`, `namespace_group`

</details>

<details>
<summary><strong>Cisco</strong>（cisco）— 43个图形</summary>

- **路由器**: `router`, `router_round`, `router_firewall`, `wireless_router`
- **交换机**: `switch_layer_3`, `switch_layer_2`, `workgroup_switch`
- **安全**: `firewall`, `vpn_concentrator`, `ids_sensor`
- **无线**: `wireless_access_point`
- **终端**: `workstation`, `laptop`, `phone`
- **网络**: `cloud`, `server`, `printer`

</details>

<details>
<summary><strong>UML</strong>（uml）— 15个图形</summary>

`actor`, `lifeline`, `state`, `frame`, `control`, `boundary`, `entity`, `component`, `start_state`, `end_state`, `note`

</details>

<details>
<summary><strong>BPMN</strong>（bpmn）— 30个图形</summary>

- **事件**: `start_event`, `end_event`, `intermediate_event`, `start_timer`, `end_terminate`
- **任务**: `task`, `user_task`, `service_task`, `script_task`, `sub_process`
- **网关**: `exclusive_gateway`, `parallel_gateway`, `inclusive_gateway`
- **数据**: `data_object`, `data_store`, `message`
- **分组**: `pool`, `lane`

</details>

---

## 外部图形库（drawio-libs）

来自 [drawio-libs](https://github.com/jgraph/drawio-libs) 的社区图形库可扩展内置模板。首次使用时**自动下载**，无需手动设置。

### 自动提供者解析

使用 `addProviderNode()` — 一个调用即可处理提供者解析、库下载和图形放置：

```typescript
const builder = new DiagramBuilder({ style: 1, title: 'DO 基础设施' });

// 内置库 — 即时加载，无需下载
const s3 = await builder.addProviderNode({
  provider: 'aws', shape: 's3', label: 'S3 存储桶', x: 100, y: 100,
});

// 外部库 — 首次使用时自动下载 DigitalOcean 图形
const droplet = await builder.addProviderNode({
  provider: 'digitalocean', shape: 'Standard Droplet', label: 'Web 服务器', x: 400, y: 100,
});

builder.addEdge({ source: s3, target: droplet, label: '备份', flowType: 'async' });
await builder.toFile('./multicloud.drawio');
```

### 提供者别名

以下名称均可自动识别：

| 提供者 | 别名 |
|--------|------|
| AWS | `aws`, `aws4`, `amazon`, `amazon web services` |
| Azure | `azure`, `microsoft azure` |
| GCP | `gcp`, `gcp2`, `google cloud`, `google cloud platform` |
| 阿里云 | `alibaba`, `alibaba cloud`, `alicloud` |
| Kubernetes | `kubernetes`, `k8s` |
| DigitalOcean | `digitalocean`, `do`, `digital ocean` |
| VMware | `vmware`, `esxi`, `vcenter` |
| Arista | `arista` |
| Cisco | `cisco` |
| UML | `uml` |
| BPMN | `bpmn` |

### 图形搜索

跨所有图形库（内置 + 已缓存外部库）搜索：

```typescript
// 搜索所有图形库
const results = await DiagramBuilder.searchShapes('load balancer');
// → [{ provider: 'aws4', shape: 'elastic_load_balancing', confidence: 0.6 }, ...]

// 在指定提供者中搜索
const doShapes = await DiagramBuilder.searchShapes('database', 'digitalocean');
```

### 可用外部图形库

| 图形库 | 描述 | 自动下载 |
|--------|------|----------|
| `digitalocean` | DigitalOcean Droplets、数据库、网络 | 是 |
| `vmware` | VMware ESXi、vCenter | 是 |
| `arista` | Arista 网络设备 | 是 |
| `templates` | 通用架构模板 | 是 |
| `material-design-icons` | Material Design 图标集 | 是 |
| `font-awesome` | Font Awesome 图标 | 是 |
| `flat-color-icons` | 扁平彩色图标包 | 是 |
| `osa-icons` | OSA 安全图标 | 是 |

---

## 图形词汇

对于通用（非云）图表，使用语义类型自动映射到正确的 draw.io 图形：

| 概念 | 图形 | 说明 |
|------|------|------|
| 流程/步骤 | `rounded=1` | 标准方框 |
| 决策 | `rhombus` | 流程图 |
| 数据库 | `shape=cylinder3` | 圆柱体 |
| 用户/人 | `ellipse` | 圆形 + 标签 |
| LLM/模型 | `rounded=1;shadow=1` | 强调填充 |
| 代理 | `shape=hexagon` | 活跃控制器 |
| API/网关 | `shape=hexagon;size=15` | 六边形变体 |
| 短期记忆 | `rounded=1;dashed=1` | 临时 |
| 长期记忆 | `shape=cylinder3` | 持久化 |
| 队列/流 | `shape=parallelogram` | 管道形状 |
| 文档 | `shape=document` | 折角 |

---

## 箭头语义

| 流类型 | 颜色 | 线条 | 含义 |
|--------|------|------|------|
| `primary` | 蓝色 | 2px 实线 | 主要请求/响应 |
| `control` | 橙色 | 1.5px 虚线 | 系统触发 |
| `memoryRead` | 绿色 | 1.5px 实线 | 数据读取 |
| `memoryWrite` | 绿色 | 1.5px 虚线 | 数据写入/存储 |
| `async` | 灰色 | 1.5px 虚线 | 非阻塞事件 |
| `embedding` | 紫色 | 1px 实线 | 数据转换 |
| `feedback` | 紫色 | 1.5px 曲线 | 迭代循环 |

---

## 云架构模板

预构建的常见云架构模板：

```typescript
import { createAwsArchitectureDiagram } from 'fireworks-drawio-graph';

const xml = createAwsArchitectureDiagram({
  title: '无服务器应用',
  nodes: [
    { shape: 'api_gateway', label: 'API 网关', x: 400, y: 80 },
    { shape: 'lambda', label: '处理函数', x: 300, y: 200 },
    { shape: 'dynamodb', label: '数据表', x: 500, y: 200 },
  ],
  connections: [
    { from: 0, to: 1, label: '调用' },
    { from: 1, to: 2, label: '查询' },
  ],
});
```

还支持：`createAzureArchitectureDiagram`、`createGcpArchitectureDiagram`、`createAlibabaArchitectureDiagram`、`createCloudArchitectureDiagram`。

---

## 命令行工具

```bash
# 生成图表
npx fireworks-drawio-graph generate --type architecture --style 1 --output ./arch.drawio
npx fireworks-drawio-graph generate --type flowchart --style 2 --output ./flow.drawio
npx fireworks-drawio-graph generate --type sequence --style 3 --output ./seq.drawio

# 列出可用样式
npx fireworks-drawio-graph styles

# 列出图表类型
npx fireworks-drawio-graph types

# 验证 XML
npx fireworks-drawio-graph validate ./diagram.drawio

# 外部图形库管理
npx fireworks-drawio-graph download-libs --list                # 列出可用图形库
npx fireworks-drawio-graph download-libs --name digitalocean   # 下载图形库
npx fireworks-drawio-graph download-libs --search load         # 搜索图形
```

---

## MCP 服务器（AI 代理集成）

添加到 Claude Desktop、Cursor 或 Hermes 配置：

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

### MCP 工具

| 工具 | 描述 |
|------|------|
| `create_diagram` | 从 mxGraphModel XML 创建新图表 |
| `edit_diagram` | 编辑现有图表（添加/更新/删除单元格） |
| `get_diagram` | 获取当前图表 XML |
| `export_diagram` | 导出到 `.drawio`/`.svg`/`.png` 文件 |
| `list_styles` | 列出 7 种样式主题 |
| `list_diagram_types` | 列出支持的图表类型 |
| `generate_diagram_from_template` | 从结构化模板生成图表 |

---

## API 参考

### `DiagramBuilder`

构建图表的主类。

```typescript
const builder = new DiagramBuilder({
  style: 1,           // 样式主题（1-7）
  title: '我的图表',
  width: 960,         // 画布宽度
  height: 600,        // 画布高度
});
```

**方法：**

| 方法 | 描述 |
|------|------|
| `addNode(def)` | 添加通用节点（流程、数据库、API 等） |
| `addEdge(def)` | 添加节点之间的连接 |
| `addGroup(def)` | 添加容器/分组 |
| `addStencilNode(def)` | 从内置库添加图形模板 |
| `addStencilGroup(def)` | 添加图形模板分组容器 |
| `addProviderNode(def)` | **统一 API** — 添加任意提供者图形（内置或外部），自动下载 |
| `addExternalShape(def)` | 从已缓存的外部库添加图形 |
| `searchShapes(query, provider?)` | 跨所有图形库搜索（静态方法） |
| `toXml()` | 生成 mxGraphModel XML 字符串 |
| `toFile(path)` | 写入 `.drawio` 文件 |
| `toString()` | 获取完整 XML 文档字符串 |

### `DiagramBuilder.addNode(def)`

```typescript
const node = builder.addNode({
  type: 'process',    // 语义图形类型
  label: '我的服务',
  x: 100, y: 200,
  width: 160, height: 60,
  sublabel: 'v2.1',  // 可选副标签
  fillColor: '#4A90D9', // 可选自定义颜色
});
```

### `DiagramBuilder.addEdge(def)`

```typescript
builder.addEdge({
  source: nodeA,       // 源节点（或 ID 字符串）
  target: nodeB,       // 目标节点（或 ID 字符串）
  label: '请求',
  flowType: 'primary', // 箭头语义类型
});
```

### `DiagramBuilder.addProviderNode(def)`

```typescript
// 适用于所有提供者 — 内置和外部
const node = await builder.addProviderNode({
  provider: 'aws',           // 提供者名称或别名
  shape: 's3',               // 图形名称
  label: 'S3 存储桶',
  x: 100, y: 100,
  width: 60,                 // 可选
  height: 60,                // 可选
  parent: groupNode,         // 可选父容器
});
```

---

## 输出

- **主要格式**: `.drawio` 文件（mxGraphModel XML，完全可编辑）
- **其他格式**: 在 draw.io 中打开 → 导出为 SVG、PNG 或 PDF
- **默认画布**: 960×600（可通过 `width`/`height` 配置）

---

## 系统要求

- **Node.js** >= 18
- **TypeScript** >= 5.6（开发时需要）

---

## 安装

```bash
# 作为依赖安装
npm install fireworks-drawio-graph

# 全局安装（用于命令行工具）
npm install -g fireworks-drawio-graph

# MCP 服务器（独立二进制文件）
npx fireworks-drawio-mcp
```

---

## 灵感来源

本项目结合了以下项目的优秀理念：

- [fireworks-tech-graph](https://www.npmjs.com/package/@yizhiyanhua-ai/fireworks-tech-graph) — 样式系统、图形词汇、箭头语义、布局规则
- [next-ai-draw-io](https://github.com/DayuanJiang/next-ai-draw-io) — draw.io XML 生成、MCP 服务器、图形库、图表编辑

---

## 许可证

Apache 2.0 — 详见 [LICENSE](./LICENSE)
