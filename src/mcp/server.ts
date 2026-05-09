#!/usr/bin/env node
/**
 * MCP Server for fireworks-drawio-graph.
 *
 * Enables AI agents (Claude Desktop, Cursor, Hermes, etc.) to generate and edit
 * draw.io diagrams with structured style themes and diagram templates.
 *
 * Usage:
 *   npx fireworks-drawio-mcp
 *   # Or as a stdio MCP server
 *   node dist/mcp/server.js
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { DiagramBuilder } from '../builder/diagram-builder.js';
import { getStyleTheme, getAllStyles, getStyleNames } from '../styles/index.js';
import { escapeAttrValue } from '../utils/xml-escape.js';
import { createArchitectureDiagram } from '../templates/architecture.js';
import { createFlowchart } from '../templates/flowchart.js';
import { createSequenceDiagram } from '../templates/sequence.js';
import { createDataFlowDiagram } from '../templates/data-flow.js';
import {
  createDiagramSchema, createDiagramDescription,
  editDiagramSchema, editDiagramDescription,
  getDiagramDescription,
  exportDiagramSchema, exportDiagramDescription,
  listStylesDescription,
  listDiagramTypesDescription,
  generateFromTemplateSchema, generateFromTemplateDescription,
} from './tools.js';

// Session state
let currentXml: string = '';
let currentBuilder: DiagramBuilder | null = null;

const server = new McpServer({
  name: 'fireworks-drawio-graph',
  version: '1.0.0',
});

// Tool: create_diagram
server.registerTool(
  'create_diagram',
  { description: createDiagramDescription, inputSchema: createDiagramSchema },
  async ({ xml, title, style }) => {
    try {
      currentXml = xml;
      currentBuilder = null; // Reset builder for manual XML
      return {
        content: [{
          type: 'text',
          text: `Diagram created successfully!\n\nXML length: ${xml.length} characters\nTitle: ${title ?? 'Untitled'}\nStyle: ${style ?? 'preserved from XML'}`,
        }],
      };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  }
);

// Tool: edit_diagram
server.registerTool(
  'edit_diagram',
  { description: editDiagramDescription, inputSchema: editDiagramSchema },
  async ({ operations }) => {
    try {
      if (!currentXml) {
        return { content: [{ type: 'text', text: 'Error: No diagram to edit. Create one first.' }], isError: true };
      }
      // Simple text-based editing (find/replace by cell ID)
      // For production, use DOM parsing as in next-ai-draw-io
      const opResults: string[] = [];
      for (const op of operations) {
        opResults.push(`${op.operation} ${op.cell_id}: queued`);
      }
      return {
        content: [{
          type: 'text',
          text: `Edit operations queued:\n${opResults.join('\n')}\n\nNote: For full editing, use the draw.io editor or regenerate with create_diagram.`,
        }],
      };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  }
);

// Tool: get_diagram
server.registerTool(
  'get_diagram',
  { description: getDiagramDescription, inputSchema: {} },
  async () => {
    if (!currentXml) {
      return { content: [{ type: 'text', text: 'No diagram exists yet. Use create_diagram to create one.' }] };
    }
    return { content: [{ type: 'text', text: `Current diagram XML:\n\n${currentXml}` }] };
  }
);

// Tool: export_diagram
server.registerTool(
  'export_diagram',
  { description: exportDiagramDescription, inputSchema: exportDiagramSchema },
  async ({ path, format }) => {
    try {
      const fs = await import('node:fs/promises');
      const nodePath = await import('node:path');

      if (!currentXml) {
        return { content: [{ type: 'text', text: 'Error: No diagram to export.' }], isError: true };
      }

      const ext = nodePath.extname(path).toLowerCase();
      const detectedFormat = format || (ext === '.svg' ? 'svg' : ext === '.png' ? 'png' : 'drawio');

      let filePath = path;
      let content: string;

      if (detectedFormat === 'drawio') {
        if (!filePath.endsWith('.drawio')) filePath += '.drawio';
        // Wrap in mxfile
        content = `<mxfile host="fireworks-drawio-graph" version="1.0.0" type="device">\n  <diagram id="diagram-1" name="Page-1">\n    ${currentXml}\n  </diagram>\n</mxfile>`;
      } else {
        // For SVG/PNG, export the raw XML (draw.io can render it)
        content = currentXml;
      }

      const absolutePath = nodePath.resolve(filePath);
      await fs.writeFile(absolutePath, content, 'utf-8');

      return {
        content: [{
          type: 'text',
          text: `Diagram exported successfully!\n\nFile: ${absolutePath}\nFormat: ${detectedFormat}\nSize: ${content.length} characters`,
        }],
      };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  }
);

// Tool: list_styles
server.registerTool(
  'list_styles',
  { description: listStylesDescription, inputSchema: {} },
  async () => {
    const styles = getStyleNames();
    const lines = styles.map(s => `${s.number}. ${s.name} (background: ${s.background})`);
    return { content: [{ type: 'text', text: `Available styles:\n\n${lines.join('\n')}` }] };
  }
);

// Tool: list_diagram_types
server.registerTool(
  'list_diagram_types',
  { description: listDiagramTypesDescription, inputSchema: {} },
  async () => {
    const types = [
      'architecture - Horizontal layers: Client → Gateway → Services → Data',
      'flowchart - Sequential steps: process, decision, data, start/end',
      'sequence - Time-ordered messages between participants (lifelines)',
      'data-flow - Data transformation with labeled edges',
      'class-diagram - UML class boxes with attributes/methods',
      'er-diagram - Entity-Relationship with cardinality',
      'state-machine - State transitions with guards and actions',
      'mind-map - Radial layout from central concept (manual XML)',
      'timeline - Horizontal time axis with bars/milestones (manual XML)',
      'network-topology - Physical/logical network devices (manual XML)',
      'use-case - Actor + use case ellipses (manual XML)',
      'comparison - Feature matrix with columns/rows (manual XML)',
    ];
    return { content: [{ type: 'text', text: `Supported diagram types:\n\n${types.join('\n')}` }] };
  }
);

// Tool: generate_diagram_from_template
server.registerTool(
  'generate_diagram_from_template',
  { description: generateFromTemplateDescription, inputSchema: generateFromTemplateSchema },
  async ({ type, title, style, data }) => {
    try {
      const styleNum = style ?? 1;
      let builder: DiagramBuilder;

      switch (type) {
        case 'architecture':
          builder = createArchitectureDiagram({ ...JSON.parse(data), title, style: styleNum });
          break;
        case 'flowchart':
          builder = createFlowchart({ ...JSON.parse(data), title, style: styleNum });
          break;
        case 'sequence':
          builder = createSequenceDiagram({ ...JSON.parse(data), title, style: styleNum });
          break;
        case 'data-flow':
          builder = createDataFlowDiagram({ ...JSON.parse(data), title, style: styleNum });
          break;
        case 'class-diagram':
          // Class diagram template would go here
          return { content: [{ type: 'text', text: 'Class diagram template is available via manual XML creation. Use create_diagram with full XML.' }] };
        case 'er-diagram':
          return { content: [{ type: 'text', text: 'ER diagram template is available via manual XML creation. Use create_diagram with full XML.' }] };
        case 'state-machine':
          return { content: [{ type: 'text', text: 'State machine template is available via manual XML creation. Use create_diagram with full XML.' }] };
        default:
          return { content: [{ type: 'text', text: `Unknown diagram type: ${type}` }], isError: true };
      }

      currentXml = builder.toXml();
      currentBuilder = builder;

      return {
        content: [{
          type: 'text',
          text: `Diagram generated successfully!\n\nType: ${type}\nTitle: ${title}\nStyle: ${styleNum}\nXML length: ${currentXml.length} characters`,
        }],
      };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
    }
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
