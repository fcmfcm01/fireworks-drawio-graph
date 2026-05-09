#!/usr/bin/env node
/**
 * CLI for fireworks-drawio-graph.
 *
 * Usage:
 *   npx fireworks-drawio-graph generate --type architecture --style 1 --output ./diagram.drawio
 *   npx fireworks-drawio-graph styles
 *   npx fireworks-drawio-graph types
 */

import { Command } from 'commander';
import { DiagramBuilder } from '../builder/diagram-builder.js';
import { getStyleNames } from '../styles/index.js';
import { formatDiagramTypesList, getDiagramTypeKeys } from '../registry.js';

const program = new Command();

program
  .name('fireworks-drawio-graph')
  .description('Generate production-quality draw.io technical diagrams')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate a diagram from template')
  .requiredOption('-t, --type <type>', 'Diagram type (architecture, flowchart, sequence, data-flow)')
  .option('-s, --style <number>', 'Style theme (1-7)', '1')
  .option('-o, --output <path>', 'Output file path', './diagram.drawio')
  .option('--title <title>', 'Diagram title', 'Untitled Diagram')
  .option('--width <pixels>', 'Canvas width', '960')
  .option('--height <pixels>', 'Canvas height', '600')
  .option('--data <json>', 'JSON data for the template')
  .action(async (opts) => {
    const styleNum = parseInt(opts.style, 10);
    const width = parseInt(opts.width, 10);
    const height = parseInt(opts.height, 10);

    // Validate parsed integers
    if (isNaN(styleNum) || styleNum < 1 || styleNum > 7) {
      console.error('Error: --style must be a number between 1 and 7');
      process.exit(1);
    }
    if (isNaN(width) || width < 100 || width > 10000) {
      console.error('Error: --width must be a number between 100 and 10000');
      process.exit(1);
    }
    if (isNaN(height) || height < 100 || height > 10000) {
      console.error('Error: --height must be a number between 100 and 10000');
      process.exit(1);
    }

    console.log(`Generating ${opts.type} diagram with style ${styleNum}...`);

    const builder = new DiagramBuilder({ style: styleNum, width, height, title: opts.title });

    // Add sample nodes based on type
    switch (opts.type) {
      case 'architecture': {
        const gw = builder.addNode({ type: 'api', label: 'API Gateway', x: 400, y: 80, width: 160, height: 60 });
        const svc1 = builder.addNode({ type: 'process', label: 'Service A', x: 120, y: 240, width: 160, height: 60 });
        const svc2 = builder.addNode({ type: 'process', label: 'Service B', x: 400, y: 240, width: 160, height: 60 });
        const svc3 = builder.addNode({ type: 'process', label: 'Service C', x: 680, y: 240, width: 160, height: 60 });
        const db = builder.addNode({ type: 'database', label: 'Database', x: 400, y: 400, width: 160, height: 80 });
        builder.addEdge({ source: gw, target: svc1, label: 'route', flowType: 'primary' });
        builder.addEdge({ source: gw, target: svc2, label: 'route', flowType: 'primary' });
        builder.addEdge({ source: gw, target: svc3, label: 'route', flowType: 'primary' });
        builder.addEdge({ source: svc2, target: db, label: 'query', flowType: 'memoryRead' });
        break;
      }
      case 'flowchart': {
        const start = builder.addNode({ type: 'start', label: '', x: 460, y: 40, width: 40, height: 40 });
        const step1 = builder.addNode({ type: 'process', label: 'Process Input', x: 400, y: 120, width: 160, height: 60 });
        const decision = builder.addNode({ type: 'decision', label: 'Valid?', x: 420, y: 240, width: 120, height: 80 });
        const step2 = builder.addNode({ type: 'process', label: 'Execute', x: 400, y: 380, width: 160, height: 60 });
        const end = builder.addNode({ type: 'end', label: '', x: 460, y: 500, width: 40, height: 40 });
        builder.addEdge({ source: start, target: step1 });
        builder.addEdge({ source: step1, target: decision });
        builder.addEdge({ source: decision, target: step2, label: 'Yes' });
        builder.addEdge({ source: step2, target: end });
        break;
      }
      case 'sequence': {
        const c = builder.addNode({ type: 'process', label: 'Client', x: 80, y: 50, width: 120, height: 40 });
        const s = builder.addNode({ type: 'process', label: 'Server', x: 380, y: 50, width: 120, height: 40 });
        const d = builder.addNode({ type: 'database', label: 'DB', x: 680, y: 50, width: 120, height: 60 });
        builder.addEdge({ source: c, target: s, label: 'HTTP Request', flowType: 'primary' });
        builder.addEdge({ source: s, target: d, label: 'SQL Query', flowType: 'memoryRead' });
        builder.addEdge({ source: d, target: s, label: 'Results', flowType: 'control' });
        builder.addEdge({ source: s, target: c, label: 'Response', flowType: 'async' });
        break;
      }
      case 'data-flow': {
        const src = builder.addNode({ type: 'document', label: 'Source Data', x: 80, y: 200, width: 160, height: 70 });
        const embed = builder.addNode({ type: 'process', label: 'Embedder', x: 340, y: 200, width: 160, height: 70 });
        const vs = builder.addNode({ type: 'vector-store', label: 'Vector Store', x: 600, y: 200, width: 160, height: 70 });
        builder.addEdge({ source: src, target: embed, label: 'raw text', flowType: 'embedding' });
        builder.addEdge({ source: embed, target: vs, label: 'embeddings', flowType: 'embedding' });
        break;
      }
      default:
        console.error(`Unknown diagram type: ${opts.type}`);
        console.error(`Supported: ${getDiagramTypeKeys().join(', ')}`);
        process.exit(1);
    }

    try {
      await builder.toFile(opts.output);
      console.log(`Diagram saved to: ${opts.output}`);
      console.log(`Style: ${styleNum}, Type: ${opts.type}`);
    } catch (writeErr) {
      console.error(`Error writing file: ${writeErr instanceof Error ? writeErr.message : String(writeErr)}`);
      process.exit(1);
    }
  });

program
  .command('styles')
  .description('List available style themes')
  .action(() => {
    const styles = getStyleNames();
    console.log('Available styles:\n');
    for (const s of styles) {
      console.log(`  ${s.number}. ${s.name} (background: ${s.background})`);
    }
  });

program
  .command('types')
  .description('List supported diagram types')
  .action(() => {
    console.log('Supported diagram types:\n');
    for (const t of formatDiagramTypesList()) {
      console.log(`  ${t}`);
    }
  });

program.parse();
