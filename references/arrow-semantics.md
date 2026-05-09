# Arrow Semantics (draw.io Mapping)

Arrow types and their visual representation in draw.io diagrams.

## Flow Types

| Flow Type | Color (Style 1) | Stroke | Dash | Meaning |
|-----------|----------------|--------|------|---------|
| `primary` | `#2563eb` (blue) | 2px solid | none | Main request/response path |
| `control` | `#ea580c` (orange) | 1.5px | `8 4` | One system triggering another |
| `memoryRead` | `#059669` (green) | 1.5px solid | none | Retrieval from store |
| `memoryWrite` | `#059669` (green) | 1.5px | `5 3` | Write/store operation |
| `async` | `#6b7280` (gray) | 1.5px | `4 2` | Non-blocking, event-driven |
| `embedding` | `#7c3aed` (purple) | 1px solid | none | Data transformation |
| `feedback` | `#7c3aed` (purple) | 1.5px curved | none | Iterative reasoning loop |

## draw.io Style Properties

```typescript
// Primary data flow
edgeStyle=orthogonalEdgeStyle;rounded=1;endArrow=classic;endFill=1;
strokeColor=#2563eb;strokeWidth=2;

// Control / trigger
edgeStyle=orthogonalEdgeStyle;rounded=1;endArrow=classic;endFill=1;
strokeColor=#ea580c;strokeWidth=1.5;dashed=1;dashPattern=8 4;

// Memory read
edgeStyle=orthogonalEdgeStyle;rounded=1;endArrow=classic;endFill=1;
strokeColor=#059669;strokeWidth=1.5;

// Memory write
edgeStyle=orthogonalEdgeStyle;rounded=1;endArrow=classic;endFill=1;
strokeColor=#059669;strokeWidth=1.5;dashed=1;dashPattern=5 3;

// Async / event
edgeStyle=orthogonalEdgeStyle;rounded=1;endArrow=classic;endFill=1;
strokeColor=#6b7280;strokeWidth=1.5;dashed=1;dashPattern=4 2;

// Embedding / transform
edgeStyle=orthogonalEdgeStyle;rounded=1;endArrow=classic;endFill=1;
strokeColor=#7c3aed;strokeWidth=1;

// Feedback / loop (bidirectional)
edgeStyle=orthogonalEdgeStyle;rounded=1;curved=1;
endArrow=classic;startArrow=classic;endFill=1;startFill=0;
strokeColor=#7c3aed;strokeWidth=1.5;
```

## Edge Style Variants

| Variant | draw.io edgeStyle | Best For |
|---------|-------------------|----------|
| `orthogonal` | `orthogonalEdgeStyle` | General use (default) |
| `elbow` | `elbowEdgeStyle` | Simple right-angle connections |
| `entity` | `entityRelationEdgeStyle` | ER diagrams |
| `straight` | none | Direct connections |
| `curved` | `orthogonalEdgeStyle` + `curved=1` | Feedback loops |

## Usage

```typescript
builder.addEdge({
  source: '2',
  target: '3',
  label: 'HTTP Request',
  flowType: 'primary',       // Arrow semantics
  edgeStyle: 'orthogonal',   // Edge variant
});

// Feedback loop
builder.addEdge({
  source: '5',
  target: '2',
  label: 'retry',
  flowType: 'feedback',
  edgeStyle: 'curved',
});
```

## Legend

Always include a legend when 2+ arrow types are used in a diagram.
