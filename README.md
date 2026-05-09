# Fireworks DrawIO Graph

<div align="center">

**AI-Powered Technical Diagram Generation for draw.io**

Generate production-quality draw.io diagrams (mxGraphModel XML) with 7 built-in style themes.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm](https://img.shields.io/npm/v/fireworks-drawio-graph.svg)](https://www.npmjs.com/package/fireworks-drawio-graph)

[English](#features) | [中文](#功能特点)

</div>

## Features / 功能特点

- 🎨 **7 Style Themes** — Flat Icon, Dark Terminal, Blueprint, Notion Clean, Glassmorphism, Claude Official, OpenAI Official
- 📐 **12+ Diagram Types** — Architecture, Flowchart, Sequence, Data Flow, Class, ER, State Machine, Mind Map, Timeline, Network, Use Case, Comparison
- 🔧 **draw.io Native** — Output is fully editable mxGraphModel XML
- 🤖 **MCP Server** — Built-in Model Context Protocol server for AI agent integration
- 📝 **CLI** — Command-line interface for quick diagram generation
- 🧩 **Shape Vocabulary** — Semantic shape mapping (process→rounded rect, decision→diamond, database→cylinder)
- 🏹 **Arrow Semantics** — 7 flow types with consistent color coding (primary, control, memory, async, etc.)
- 📐 **Layout Engine** — Grid snapping, automatic row/grid/layer layout helpers

## Quick Start

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

## CLI Usage

```bash
# Generate sample diagrams
npx fireworks-drawio-graph generate --type architecture --style 1 --output ./arch.drawio
npx fireworks-drawio-graph generate --type flowchart --style 2 --output ./flow.drawio
npx fireworks-drawio-graph generate --type sequence --style 3 --output ./seq.drawio

# List available styles
npx fireworks-drawio-graph styles

# Validate XML
npx fireworks-drawio-graph validate ./diagram.drawio
```

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
| `export_diagram` | Export to file |
| `list_styles` | List 7 style themes |
| `list_diagram_types` | List supported diagram types |
| `generate_diagram_from_template` | Generate from structured template |

## Style Themes / 样式主题

| # | Name | Background | Best For |
|---|------|-----------|----------|
| 1 | Flat Icon | White | Blogs, docs, presentations |
| 2 | Dark Terminal | #0f0f1a | GitHub, dev articles |
| 3 | Blueprint | #0a1628 | Architecture docs |
| 4 | Notion Clean | White | Notion, wikis |
| 5 | Glassmorphism | Dark | Product sites, keynotes |
| 6 | Claude Official | #f8f6f3 | Warm, approachable |
| 7 | OpenAI Official | White | Clean, modern |

## Diagram Types / 图表类型

- **Architecture** — Horizontal layers: Client → Gateway → Services → Data
- **Flowchart** — Sequential steps with decisions
- **Sequence** — Time-ordered messages between participants
- **Data Flow** — Data transformation pipelines
- **Class Diagram (UML)** — Classes with attributes and methods
- **ER Diagram** — Entities and relationships
- **State Machine (UML)** — State transitions
- **Mind Map** — Radial concept map
- **Timeline** — Time axis with milestones
- **Network Topology** — Network devices and connections
- **Use Case (UML)** — Actors and use cases
- **Comparison** — Feature matrix

## Inspiration

This project combines the best ideas from:

- [fireworks-tech-graph](https://www.npmjs.com/package/@yizhiyanhua-ai/fireworks-tech-graph) — Style system, shape vocabulary, arrow semantics, layout rules
- [next-ai-draw-io](https://github.com/DayuanJiang/next-ai-draw-io) — draw.io XML generation, MCP server, shape libraries, diagram editing

## License

Apache 2.0 — See [LICENSE](./LICENSE)
