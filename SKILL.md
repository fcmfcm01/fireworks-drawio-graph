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
