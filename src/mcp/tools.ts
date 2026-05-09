/**
 * MCP tool definitions for fireworks-drawio-graph.
 *
 * Provides tools for AI agents to create, edit, and export draw.io diagrams.
 */

import { z } from 'zod';

/** Tool: create_diagram */
export const createDiagramSchema = {
  xml: z.string().describe('Complete mxGraphModel XML for the diagram'),
  title: z.string().optional().describe('Diagram title'),
  style: z.number().min(1).max(7).optional().describe('Style theme number (1-7)'),
};

export const createDiagramDescription = `Create a NEW draw.io diagram from mxGraphModel XML.

This replaces any existing diagram content. Use edit_diagram for modifications.

XML FORMAT - Full mxGraphModel structure:
<mxGraphModel>
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <mxCell id="2" value="Shape" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
      <mxGeometry x="100" y="100" width="120" height="60" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>

LAYOUT CONSTRAINTS:
- Keep elements within x=0-800, y=0-600
- Start from margins (x=40, y=40)
- Use unique IDs starting from "2" (0 and 1 reserved)
- Set parent="1" for top-level shapes
- Space shapes 150-200px apart

AVAILABLE STYLES (1-7):
1. Flat Icon (white, clean) - default
2. Dark Terminal (dark, neon)
3. Blueprint (engineering wireframe)
4. Notion Clean (minimal white)
5. Glassmorphism (frosted glass)
6. Claude Official (warm cream)
7. OpenAI Official (pure white)`;

/** Tool: edit_diagram */
export const editDiagramSchema = {
  operations: z.array(z.object({
    operation: z.enum(['update', 'add', 'delete']).describe('Operation type'),
    cell_id: z.string().describe('mxCell ID to operate on'),
    new_xml: z.string().optional().describe('Complete mxCell XML (required for update/add)'),
  })).describe('Array of edit operations'),
};

export const editDiagramDescription = `Edit the current diagram by ID-based operations.

WORKFLOW:
1. Call get_diagram first to see current state
2. Use returned XML to plan edits
3. Call edit_diagram with operations

Operations:
- add: New cell with unique cell_id and new_xml
- update: Replace existing cell by cell_id with new_xml
- delete: Remove cell by cell_id (cascades to children/edges)`;

/** Tool: get_diagram */
export const getDiagramDescription = 'Get the current diagram XML. Always call this before edit_diagram to see current cell IDs and structure.';

/** Tool: export_diagram */
export const exportDiagramSchema = {
  path: z.string().describe('File path to save (e.g., ./diagram.drawio, ./diagram.svg, ./diagram.png)'),
  format: z.enum(['drawio', 'svg', 'png']).optional().describe('Export format (auto-detected from extension if omitted)'),
};

export const exportDiagramDescription = 'Export the current diagram to a file. Supports .drawio (XML), .svg, and .png formats.';

/** Tool: list_styles */
export const listStylesDescription = 'List all available style themes (1-7) with their names and descriptions.';

/** Tool: list_diagram_types */
export const listDiagramTypesDescription = `List all supported diagram types with layout rules and shape recommendations.

Supported types: architecture, flowchart, sequence, data-flow, class-diagram, er-diagram, state-machine, mind-map, timeline, network-topology, use-case, comparison`;

/** Tool: generate_diagram_from_template */
export const generateFromTemplateSchema = {
  type: z.enum([
    'architecture', 'flowchart', 'sequence', 'data-flow',
    'class-diagram', 'er-diagram', 'state-machine'
  ]).describe('Diagram type'),
  title: z.string().describe('Diagram title'),
  style: z.number().min(1).max(7).optional().describe('Style theme number (1-7)'),
  data: z.string().describe('JSON string with diagram-specific data (nodes, edges, layers, etc.)'),
};

export const generateFromTemplateDescription = `Generate a diagram from a structured template.
Provide the diagram type and a JSON data object matching the template's expected input.

For 'architecture': { "layers": [{ "name": "...", "nodes": [{ "label": "..." }] }], "connections": [{ "from": "...", "to": "..." }] }
For 'flowchart': { "steps": [{ "label": "...", "type": "process|decision|data|start|end" }], "connections": [{ "from": "...", "to": "..." }] }
For 'sequence': { "participants": [{ "name": "..." }], "messages": [{ "from": "...", "to": "...", "label": "..." }] }`;
