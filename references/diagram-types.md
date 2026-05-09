# Supported Diagram Types

Complete reference of diagram types, their layout rules, and recommended shapes.

## Architecture Diagram

**Layout**: Horizontal layers (top→bottom or left→right).
**Typical layers**: Client → Gateway/LB → Services → Data/Storage.

- Use `addGroup()` for dashed containers to group related services
- Arrow direction follows data/request flow
- Canvas: 960×600 standard, 960×800 for tall stacks

```typescript
import { createArchitectureDiagram } from 'fireworks-drawio-graph';

createArchitectureDiagram({
  title: 'Microservices Architecture',
  style: 1,
  layers: [
    { name: 'Client', nodes: [{ label: 'Web App' }, { label: 'Mobile App' }] },
    { name: 'Gateway', nodes: [{ label: 'API Gateway' }] },
    { name: 'Services', nodes: [{ label: 'Auth Service' }, { label: 'Order Service' }, { label: 'Payment' }] },
    { name: 'Data', nodes: [{ label: 'PostgreSQL' }, { label: 'Redis' }] },
  ],
  connections: [
    { from: 'Web App', to: 'API Gateway' },
    { from: 'API Gateway', to: 'Order Service' },
  ],
});
```

## Flowchart / Process Flow

**Layout**: Top-to-bottom preferred.
**Shapes**: Diamond for decisions, rounded rects for processes, parallelograms for I/O.

- Keep node labels short (≤3 words)
- Put detail in sub-labels
- Align on grid: x snap 120px, y snap 80px

## Sequence Diagram

**Layout**: Participants as vertical lifelines, messages horizontal.
**Height**: 80 + (num_messages × 50)

- Messages as horizontal arrows between lifelines, top-to-bottom time order
- Group with alt/loop frames

## Data Flow Diagram

**Emphasis**: What data moves where.
- Label every arrow with data type
- Use wider arrows (strokeWidth: 2.5) for primary paths
- Dashed arrows for control flows

## Class Diagram (UML)

**Structure**: 3-compartment rects (name / attributes / methods).
- Inheritance: solid line + hollow triangle (child → parent)
- Implementation: dashed line + hollow triangle
- Association: solid line + open arrow
- Aggregation: hollow diamond
- Composition: filled diamond
- Dependency: dashed line + open arrow

## ER Diagram

**Elements**: Entities (rects), Relationships (diamonds), Cardinality labels.
- Primary key: underlined
- Foreign key: italic or (FK) marker
- Layout in 2-3 rows

## State Machine (UML)

**States**: Rounded rects.
- Initial state: filled black circle
- Final state: filled circle inside hollow circle
- Transitions: arrows with `event [guard] / action`
- Composite states: nested rects

## Mind Map / Concept Map

**Layout**: Radial from center.
- Central node at cx=480, cy=280
- First-level: evenly distributed 360/N degrees
- Use curved paths for branches

## Network Topology

**Devices**: Icon-like shapes for routers, switches, servers.
- Connections: lines between devices
- Subnets: dashed container rects
- Tiered layout: Internet → Edge → Core → Access

## Comparison / Feature Matrix

**Layout**: Table with columns (systems) and rows (attributes).
- Row height: 40px, Column width: min 120px
- ✓ checkmarks for supported features
- Alternating row fills

## Timeline / Gantt

**Layout**: Horizontal time axis.
- X-axis: time periods
- Y-axis: tasks/phases
- Bars: rounded rects colored by category
- Milestones: diamond markers

## Use Case Diagram (UML)

**Elements**: Stick figures (actors), ellipses (use cases), system boundary rect.
- Include: dashed arrow `<<include>>`
- Extend: dashed arrow `<<extend>>`
- Generalization: solid line + hollow triangle
