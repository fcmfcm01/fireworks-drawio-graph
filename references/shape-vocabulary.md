# Shape Vocabulary (draw.io Mapping)

Map semantic concepts to draw.io shapes. This replaces the SVG shape vocabulary
with draw.io native shape types.

| Concept | draw.io Shape | Style Properties | Notes |
|---------|--------------|------------------|-------|
| User / Human | `ellipse` | `ellipse;whiteSpace=wrap;html=1` | Simple circle with label |
| LLM / Model | rounded rect | `rounded=1;arcSize=15;shadow=1` | Accent fill color from theme |
| Agent / Orchestrator | `hexagon` | `shape=hexagon;perimeter=hexagonPerimeterSize;fixedSize=1` | "Active controller" signal |
| Memory (short-term) | dashed rounded rect | `rounded=1;dashed=1;dashPattern=5 3` | Ephemeral = dashed |
| Memory (long-term) | `cylinder3` | `shape=cylinder3;boundedLbl=1;backgroundOutline=1;size=10` | Persistent = solid cylinder |
| Vector Store | `cylinder3` | Same as database + horizontal lines via label | Add decorative lines in label |
| Graph DB | Cluster of circles | Use multiple `ellipse` nodes grouped | Overlapping circles |
| Tool / Function | Rounded rect | `rounded=1;arcSize=8` | Standard box with accent |
| API / Gateway | `hexagon` | `shape=hexagon;size=15` | Single border variant |
| Queue / Stream | `parallelogram` | `shape=parallelogram;perimeter=parallelogramPerimeter;fixedSize=1` | Horizontal pipe shape |
| File / Document | `document` | `shape=document;boundedLbl=1` | Folded-corner rect |
| Browser / UI | Rounded rect | `rounded=1;arcSize=6` | Add 3-dot titlebar in label |
| Decision | `rhombus` | `rhombus;whiteSpace=wrap;html=1` | Flowcharts only |
| Process / Step | Rounded rect | `rounded=1;arcSize=12` | Standard box |
| External Service | Dashed rect | `rounded=1;dashed=1;dashPattern=8 4` | Dashed border |
| Data / I/O | `parallelogram` | `shape=parallelogram;perimeter=parallelogramPerimeter;fixedSize=1` | I/O in flowcharts |
| Start State | Filled circle | `ellipse;aspect=fixed` | Small filled circle |
| End State | Double circle | `ellipse;aspect=fixed;strokeWidth=3` | Circle within circle |
| State | Rounded rect | `rounded=1;arcSize=20` | State machine |
| Entity (ER) | Rect | `rounded=0` | ER diagram entity |
| Relationship (ER) | Diamond | `rhombus` | ER diagram relationship |
| Class (UML) | Rect | `rounded=0;overflow=fill` | 3-compartment via HTML label |
| Lifeline | Vertical line | `shape=line;dashed=1;dashPattern=4 2` | Sequence diagram |
| Note | Note shape | `shape=note;whiteSpace=wrap;html=1;size=14` | Annotation |
| Cloud | Cloud | `ellipse;shape=cloud;whiteSpace=wrap;html=1` | External cloud |

## Using Shapes in Code

```typescript
import { DiagramBuilder } from 'fireworks-drawio-graph';

const builder = new DiagramBuilder({ style: 1 });

// Process node
builder.addNode({ type: 'process', label: 'API Gateway', x: 100, y: 100, width: 160, height: 60 });

// Decision node
builder.addNode({ type: 'decision', label: 'Valid?', x: 400, y: 100, width: 120, height: 80 });

// Database node
builder.addNode({ type: 'database', label: 'PostgreSQL', x: 700, y: 100, width: 160, height: 80 });

// Custom style overrides
builder.addNode({
  type: 'process',
  label: 'Custom',
  x: 100, y: 300, width: 160, height: 60,
  styleOverrides: { fillColor: '#FFD700', strokeColor: '#B8860B' }
});
```
