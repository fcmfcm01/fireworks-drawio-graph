# Layout Rules

Layout constraints and spacing rules for diagram generation.

## Canvas Sizes

| Type | Default ViewBox | When to Use |
|------|----------------|-------------|
| Standard | 960 x 600 | Most diagrams |
| Tall | 960 x 800 | Deep stacks, many layers |
| Wide | 1200 x 600 | Many columns, timelines |

## Spacing Rules

- **Same-layer nodes**: 80px horizontal gap
- **Layer gap**: 120px vertical between layers
- **Canvas margins**: 40px minimum
- **Node edge spacing**: 60px between node edges
- **Grid snap**: 8px increments

## Position Snapping

```typescript
import { applyGridSnap, snapX, snapY } from 'fireworks-drawio-graph';

applyGridSnap(137);  // → 136
snapX(250);           // → 240 (120px intervals)
snapY(300);           // → 360 (120px intervals)
```

## Layout Helpers

### Row Layout
Distribute N nodes evenly across canvas width.

```typescript
import { layoutRow } from 'fireworks-drawio-graph';

const positions = layoutRow(4, 160, 200);  // 4 nodes, 160px wide, y=200
// [{x:40,y:200}, {x:280,y:200}, {x:520,y:200}, {x:760,y:200}]
```

### Grid Layout
Arrange nodes in rows x cols grid.

```typescript
import { layoutGrid } from 'fireworks-drawio-graph';

const positions = layoutGrid(3, 4, 160, 60);  // 3 rows, 4 cols
```

### Layer Layout (Architecture)
Layer-based layout for architecture diagrams.

```typescript
import { layoutLayers } from 'fireworks-drawio-graph';

// 3 nodes in layer 1, 4 in layer 2, 2 in layer 3
const positions = layoutLayers([3, 4, 2], 160, 60);
```

### Lifeline Layout (Sequence)
Evenly spaced x-positions for sequence diagram participants.

```typescript
import { layoutLifelines } from 'fireworks-drawio-graph';

const xPositions = layoutLifelines(4);  // [80, 373, 667, 960]
```

## Arrow Routing Rules

1. **Prefer orthogonal** (L-shaped) paths to minimize crossings
2. **Anchor on edges**, not geometric centers
3. **Route around** dense node clusters
4. **Stagger parallel arrows** with different y-offsets
5. **Use jump-over arcs** for unavoidable crossings

## Text Constraints

- **Node labels**: ≤3 words; put detail in subLabels
- **Edge labels**: Must have background rect in draw.io (use `labelBackgroundColor`)
- **Font size**: Minimum 12px, prefer 13-14px labels, 11px sub-labels, 16-18px titles
- **Text padding**: 8px inside shape boundaries
