---
name: fireworks-drawio-graph
description: >-
  Use when the user wants to create any technical diagram as draw.io XML
  (mxGraphModel) - architecture, data flow, flowchart, sequence, class, ER,
  state machine, or concept map. Trigger on: "画图" "帮我画" "生成图" "做个图"
  "架构图" "流程图" "可视化一下" "出图" "drawio" "draw.io" "generate diagram"
  "draw diagram" "visualize" or any system/flow description the user wants
  illustrated as an editable draw.io diagram.
---

# Fireworks DrawIO Graph

Generate production-quality **draw.io** (mxGraphModel XML) technical diagrams
with 7 built-in style themes. Unlike SVG-only diagram tools, the output is
fully editable in draw.io, diagrams.net, VS Code Draw.io extension, or any
mxGraph-compatible editor.

## Install

```bash
npm install fireworks-drawio-graph
# or globally
npm install -g fireworks-drawio-graph
```

## MCP Server (for AI Agents)

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

## Workflow (Always Follow This Order)

1. **Classify** the diagram type (see Diagram Types below)
2. **Extract structure** — identify layers, nodes, edges, flows, and semantic groups
3. **Plan layout** — apply the layout rules for the diagram type
4. **Choose style** — select from 7 style themes (default: Style 1 Flat Icon)
5. **Map nodes to shapes** — use Shape Vocabulary in `references/shape-vocabulary.md`
5a. **For cloud/infra diagrams**: use `addProviderNode({ provider: 'aws', shape: 's3', ... })` — works for all providers (built-in + external), auto-downloads if needed
5b. **For generic shapes**: use `addNode({ type: 'process' })`
5c. **Shape search**: use `DiagramBuilder.searchShapes('load balancer')` to find shapes across all libraries
6. **Map edges to flows** — use Arrow Semantics in `references/arrow-semantics.md`
7. **Generate XML** — use DiagramBuilder (array-push method, never template strings)
8. **Validate** — run `npx fireworks-drawio-graph validate output.drawio`
9. **Export** — `.drawio` file (editable), or open in draw.io for SVG/PNG export

## Diagram Types & Layout Rules

### Architecture Diagram
Nodes = services/components. Group into horizontal layers (top→bottom).
- Typical layers: Client → Gateway/LB → Services → Data/Storage
- Use `addGroup()` for dashed containers
- Canvas: 960×600 standard, 960×800 for tall stacks

### Data Flow Diagram
Emphasizes what data moves where. Focus on data transformation.
- Label every arrow with data type
- Use wider arrows (`strokeWidth: 2.5`) for primary data paths
- Dashed arrows for control/trigger flows

### Flowchart / Process Flow
Sequential decision/process steps. Top-to-bottom preferred.
- Diamond for decisions, rounded rects for processes, parallelograms for I/O
- Keep labels ≤3 words; detail in sub-labels

### Sequence Diagram
Time-ordered message exchanges between participants.
- Participants as vertical lifelines with labels
- Messages as horizontal arrows, top-to-bottom time order
- Height = 80 + (num_messages × 50)

### Class Diagram (UML)
3-compartment rects: name / attributes / methods.
- Inheritance: `endArrow=block;endFill=0`
- Composition: `endArrow=diamond;endFill=1`
- Aggregation: `endArrow=diamond;endFill=0`

### ER Diagram
Entities (rects), Relationships (diamonds), Cardinality labels.
- Primary key: underlined in label
- Foreign key: italic or (FK) marker
- Layout in 2-3 rows

### State Machine (UML)
States (rounded rects), Transitions (arrows).
- Initial state: filled circle (`ellipse;aspect=fixed`)
- Final state: double circle
- Transitions: `event [guard] / action`

## Shape Vocabulary

| Concept | draw.io Shape | Notes |
|---------|--------------|-------|
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

See `references/shape-vocabulary.md` for full mapping.

## Arrow Semantics

| Flow Type | Color | Stroke | Meaning |
|-----------|-------|--------|---------|
| `primary` | blue | 2px solid | Main request/response |
| `control` | orange | 1.5px dashed | System trigger |
| `memoryRead` | green | 1.5px solid | Retrieval |
| `memoryWrite` | green | 1.5px dashed | Write/store |
| `async` | gray | 1.5px dashed | Non-blocking event |
| `embedding` | purple | 1px solid | Data transform |
| `feedback` | purple | 1.5px curved | Iterative loop |

See `references/arrow-semantics.md` for full draw.io style strings.

## Cloud & Infrastructure Shape Libraries

8 built-in stencil libraries provide provider-specific shapes. These use native draw.io
shape references (e.g., `shape=mxgraph.aws4.s3`) — no SVG embedding needed.

| Library ID | Name | Shapes | Groups | Best For |
|---|---|---|---|---|
| `aws4` | AWS 2021+ | ~150 | 16 | AWS architecture diagrams |
| `azure` | Azure | ~95 | 3 | Azure architecture diagrams |
| `gcp2` | Google Cloud | ~75 | 5 | GCP architecture diagrams |
| `alibaba` | Alibaba Cloud | ~60 | 5 | Alibaba architecture diagrams |
| `kubernetes` | Kubernetes | 36 | 2 | K8s cluster diagrams |
| `cisco` | Cisco | 43 | 3 | Network topology diagrams |
| `uml` | UML | 15 | 0 | UML diagrams |
| `bpmn` | BPMN | 30 | 2 | Business process diagrams |

### Using Stencil Shapes

```typescript
import { DiagramBuilder } from 'fireworks-drawio-graph';

const builder = new DiagramBuilder({ style: 1, title: 'AWS Serverless' });

// Add VPC group container
const vpc = builder.addStencilGroup({
  library: 'aws4', group: 'vpc', label: 'VPC',
  x: 50, y: 50, width: 800, height: 400,
});

// Add service icons (optionally inside the group via parent)
const s3 = builder.addStencilNode({ library: 'aws4', shape: 's3', label: 'S3 Bucket', x: 100, y: 150, parent: vpc });
const lambda = builder.addStencilNode({ library: 'aws4', shape: 'lambda', label: 'Lambda', x: 300, y: 150, parent: vpc });
const dynamo = builder.addStencilNode({ library: 'aws4', shape: 'dynamodb', label: 'DynamoDB', x: 500, y: 150, parent: vpc });

builder.addEdge({ source: lambda, target: dynamo, label: 'query', flowType: 'memoryRead' });
await builder.toFile('./aws-serverless.drawio');
```

### Available Shapes by Library

**AWS4** (`aws4`):
- Compute: `ec2`, `lambda`, `fargate`, `ecs`, `eks`, `batch`, `lightsail`, `elastic_beanstalk`, `auto_scaling`
- Storage: `s3`, `ebs`, `efs`, `glacier`, `backup`
- Database: `rds`, `dynamodb`, `aurora`, `redshift`, `elasticache`, `neptune`
- Networking: `vpc`, `cloudfront`, `route_53`, `api_gateway`, `load_balancer`, `transit_gateway`
- Security: `iam`, `kms`, `guardduty`, `waf`, `cognito`, `secrets_manager`
- ML/AI: `sagemaker`, `bedrock`, `comprehend`, `rekognition`, `textract`
- Groups: `vpc`, `region`, `availability_zone`, `subnet`, `security_group`, `auto_scaling_group`

**Azure** (`azure`):
- Compute: `virtual_machines`, `app_services`, `functions`, `aks`, `container_instances`, `vm_scale_sets`
- Storage: `storage_accounts`, `blob_storage`, `managed_disks`
- Database: `sql_database`, `cosmos_db`, `redis_cache`
- Networking: `virtual_network`, `load_balancer`, `firewall`, `application_gateway`
- Security: `key_vault`, `azure_ad`, `security_center`

**Google Cloud** (`gcp2`):
- Compute: `compute_engine`, `cloud_functions`, `cloud_run`, `gke`, `app_engine`
- Storage: `cloud_storage`, `persistent_disk`
- Database: `cloud_sql`, `firestore`, `bigquery`, `bigtable`, `spanner`
- AI: `vertex_ai`, `auto_ml`, `cloud_vision`, `natural_language`
- Groups: `project`, `vpc`, `region`, `zone`, `subnet`

**Alibaba Cloud** (`alibaba`):
- Compute: `ecs`, `ack`, `function_compute`, `elastic_container_instance`
- Storage: `oss`, `nas`, `table_store`
- Database: `rds`, `polar_db`, `redis`, `mongo_db`
- Networking: `vpc`, `slb`, `cdn`, `nat_gateway`

**Kubernetes** (`kubernetes`):
- Core: `pod`, `service`, `namespace`, `config_map`, `secret`, `ingress`, `node`
- Workloads: `deployment`, `replica_set`, `stateful_set`, `daemon_set`, `job`, `cron_job`
- Networking: `network_policy`, `cluster_ip`, `load_balancer`, `gateway_api`
- RBAC: `role`, `cluster_role`, `role_binding`, `service_account`
- Control Plane: `api_server`, `etcd`, `scheduler`, `controller_manager`, `coredns`
- Groups: `cluster`, `namespace_group`

**Cisco** (`cisco`):
- Routers: `router`, `router_round`, `router_firewall`, `wireless_router`
- Switches: `switch_layer_3`, `switch_layer_2`, `workgroup_switch`
- Security: `firewall`, `vpn_concentrator`, `ids_sensor`
- Wireless: `wireless_access_point`
- Endpoints: `workstation`, `laptop`, `phone`
- Network: `cloud`, `server`, `printer`

**UML** (`uml`):
- `actor`, `lifeline`, `state`, `frame`, `control`, `boundary`, `entity`, `component`, `start_state`, `end_state`, `note`

**BPMN** (`bpmn`):
- Events: `start_event`, `end_event`, `intermediate_event`, `start_timer`, `end_terminate`
- Tasks: `task`, `user_task`, `service_task`, `script_task`, `sub_process`
- Gateways: `exclusive_gateway`, `parallel_gateway`, `inclusive_gateway`
- Data: `data_object`, `data_store`, `message`
- Groups: `pool`, `lane`

## External Shape Libraries (drawio-libs)

Community shape libraries from [drawio-libs](https://github.com/jgraph/drawio-libs) extend
the built-in stencils with providers like DigitalOcean, VMware, Arista, etc.

**Automatic** — just use `addProviderNode()` and the system handles everything:

```typescript
const builder = new DiagramBuilder({ style: 1, title: 'DO Infra' });

// This ONE call: resolves provider → downloads if missing → finds shape → adds to diagram
const droplet = await builder.addProviderNode({
  provider: 'digitalocean',  // or 'do', 'digital ocean'
  shape: 'Standard Droplet',
  label: 'Web Server',
  x: 100, y: 100,
});
```

### Discovery (for AI agents)

```typescript
// Search for shapes across ALL libraries (built-in + cached + auto-download)
const results = await DiagramBuilder.searchShapes('load balancer');
// → [{ provider: 'aws4', shape: 'elastic_load_balancing', confidence: 0.6 }, ...]

// Or search within a specific provider
const doShapes = await DiagramBuilder.searchShapes('database', 'digitalocean');
```

### When to Use Stencils vs Basic Shapes vs External Libs

**Use `addProviderNode()` for everything** — it automatically resolves the provider, downloads if needed, and adds the shape.

| User Says | Provider | Method |
|---|---|---|
| "AWS S3 bucket" | `aws` | `addProviderNode({ provider: 'aws', shape: 's3' })` |
| "DigitalOcean Droplet" | `digitalocean` | `addProviderNode({ provider: 'digitalocean', shape: 'Droplet' })` |
| "K8s pod" | `k8s` | `addProviderNode({ provider: 'k8s', shape: 'pod' })` |
| "Generic process" | — | `addNode({ type: 'process' })` |

**Provider aliases** — all of these work automatically:
- AWS: `aws`, `aws4`, `amazon`, `amazon web services`
- Azure: `azure`, `microsoft azure`
- GCP: `gcp`, `gcp2`, `google cloud`, `google cloud platform`
- Alibaba: `alibaba`, `alibaba cloud`, `alicloud`
- Kubernetes: `kubernetes`, `k8s`
- DigitalOcean: `digitalocean`, `do`, `digital ocean`
- VMware: `vmware`, `esxi`, `vcenter`
- Arista: `arista`
- Cisco: `cisco`
- UML: `uml`
- BPMN: `bpmn`

**Auto-download** — external libraries are automatically downloaded when first used. No manual `download-libs` needed.

**Shape search** — find shapes across all libraries:
```typescript
const shapes = await DiagramBuilder.searchShapes('load balancer');
// → [{ provider: 'aws4', shape: 'elastic_load_balancing', confidence: 0.6 }, ...]
```

## Styles

| # | Name | Background | Best For |
|---|------|-----------|----------|
| 1 | Flat Icon (default) | White | Blogs, docs, presentations |
| 2 | Dark Terminal | #0f0f1a | GitHub, dev articles |
| 3 | Blueprint | #0a1628 | Architecture docs |
| 4 | Notion Clean | White | Notion, wikis |
| 5 | Glassmorphism | Dark gradient | Product sites, keynotes |
| 6 | Claude Official | #f8f6f3 | Anthropic-style diagrams |
| 7 | OpenAI Official | White | OpenAI-style diagrams |

## Code Usage

### TypeScript / Node.js

```typescript
import { DiagramBuilder } from 'fireworks-drawio-graph';

const builder = new DiagramBuilder({ style: 1, title: 'My Architecture' });

// Add nodes
const gw = builder.addNode({
  type: 'api',
  label: 'API Gateway',
  x: 400, y: 80, width: 160, height: 60,
});

const db = builder.addNode({
  type: 'database',
  label: 'PostgreSQL',
  x: 400, y: 300, width: 160, height: 80,
});

// Add edge
builder.addEdge({
  source: gw,
  target: db,
  label: 'SQL Query',
  flowType: 'memoryRead',
});

// Export
await builder.toFile('./architecture.drawio');
```

#### Cloud Architecture with Stencils

```typescript
import { createAwsArchitectureDiagram } from 'fireworks-drawio-graph';

// Using pre-built cloud architecture templates
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

// Or build manually with full control
const builder = new DiagramBuilder({ style: 1, title: 'GCP Data Pipeline' });
const pubsub = builder.addStencilNode({ library: 'gcp2', shape: 'pub_sub', label: 'Pub/Sub', x: 200, y: 100 });
const dataflow = builder.addStencilNode({ library: 'gcp2', shape: 'dataflow', label: 'Dataflow', x: 400, y: 100 });
const bigquery = builder.addStencilNode({ library: 'gcp2', shape: 'bigquery', label: 'BigQuery', x: 600, y: 100 });
builder.addEdge({ source: pubsub, target: dataflow, label: 'stream', flowType: 'primary' });
builder.addEdge({ source: dataflow, target: bigquery, label: 'load', flowType: 'memoryWrite' });
await builder.toFile('./gcp-pipeline.drawio');
```

#### Cloud Architecture — Automatic Provider Resolution

```typescript
// Works for ALL providers — built-in (AWS, Azure, GCP) AND external (DigitalOcean, VMware)
// Auto-downloads external libraries on first use. No manual setup needed.

const builder = new DiagramBuilder({ style: 1, title: 'Multi-Cloud' });

// Built-in — instant, no download
const s3 = await builder.addProviderNode({ provider: 'aws', shape: 's3', label: 'S3', x: 100, y: 100 });

// External — auto-downloads DigitalOcean shapes on first use
const droplet = await builder.addProviderNode({ provider: 'digitalocean', shape: 'Standard Droplet', label: 'Web', x: 400, y: 100 });

builder.addEdge({ source: s3, target: droplet, label: 'backup', flowType: 'async' });
await builder.toFile('./multicloud.drawio');
```

#### External Library Shapes (Manual)

```typescript
// First download the library (one-time setup)
// CLI: npx fireworks-drawio-graph download-libs --name digitalocean

const builder = new DiagramBuilder({ style: 1, title: 'DO Infra' });
const droplet = await builder.addExternalShape({
  library: 'digitalocean', title: 'Droplet', label: 'App Server',
  x: 100, y: 100,
});
```

### CLI

```bash
npx fireworks-drawio-graph generate --type architecture --style 1 --output ./diagram.drawio
npx fireworks-drawio-graph styles
npx fireworks-drawio-graph validate ./diagram.drawio
```

## XML Generation Rules

**MANDATORY: Array-Push Method** (always use this):

```typescript
const builder = new DiagramBuilder({ style: 1 });
builder.addNode({ type: 'process', label: 'Step 1', x: 100, y: 100, width: 160, height: 60 });
const xml = builder.toXml();
```

**Never** use template string concatenation for XML — the DiagramBuilder handles
all XML construction internally using array push.

## MCP Tools

| Tool | Description |
|------|-------------|
| `create_diagram` | Create new diagram from mxGraphModel XML |
| `edit_diagram` | Edit existing diagram (add/update/delete cells) |
| `get_diagram` | Get current diagram XML |
| `export_diagram` | Export to .drawio/.svg/.png file |
| `list_styles` | List available style themes |
| `list_diagram_types` | List supported diagram types |
| `generate_diagram_from_template` | Generate from structured template data |

## Output

- **Primary**: `.drawio` files (XML, fully editable)
- **Secondary**: Open in draw.io → export as SVG/PNG/PDF
- **Default location**: Current directory
- **Custom**: Specify path via `--output` or `builder.toFile(path)`
