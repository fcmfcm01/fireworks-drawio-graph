#!/usr/bin/env node
/**
 * XML validation utility for draw.io diagrams.
 *
 * Usage:
 *   npx fireworks-drawio-graph validate ./diagram.drawio
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: fireworks-drawio-graph validate <file.drawio|file.xml>');
    process.exit(1);
  }

  const absolutePath = resolve(filePath);
  console.log(`Validating: ${absolutePath}`);

  try {
    const content = await readFile(absolutePath, 'utf-8');
    const errors: string[] = [];

    // Check XML declaration
    if (!content.includes('<?xml')) {
      errors.push('Missing XML declaration');
    }

    // Check mxGraphModel
    if (!content.includes('<mxGraphModel')) {
      errors.push('Missing <mxGraphModel> root element');
    }

    // Check root cells
    if (!content.includes('id="0"')) {
      errors.push('Missing root cell id="0"');
    }
    if (!content.includes('id="1"')) {
      errors.push('Missing root cell id="1"');
    }

    // Check closing tags
    if (!content.includes('</mxGraphModel>')) {
      errors.push('Missing closing </mxGraphModel> tag');
    }

    // Check for common syntax errors
    const unclosedCells = content.match(/<mxCell[^>]*(?!\/)>/g);
    if (unclosedCells) {
      for (const cell of unclosedCells) {
        if (!cell.endsWith('/>') && !content.includes(cell.replace('<', '</').split(' ')[0])) {
          // Only warn if the cell doesn't self-close and isn't properly closed
          if (!cell.includes('as="geometry"') && !cell.endsWith('>')) {
            errors.push(`Potentially unclosed mxCell: ${cell.substring(0, 80)}...`);
          }
        }
      }
    }

    // Report
    if (errors.length === 0) {
      console.log('✓ XML is valid');
      console.log(`  File size: ${content.length} characters`);
      const cellCount = (content.match(/<mxCell/g) || []).length;
      console.log(`  Cell count: ${cellCount}`);
    } else {
      console.log('✗ Validation failed:');
      for (const err of errors) {
        console.log(`  - ${err}`);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error reading file: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
