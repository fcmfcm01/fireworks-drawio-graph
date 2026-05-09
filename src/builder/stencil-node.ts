import { escapeAttrValue } from '../utils/xml-escape.js';
import { getLibraryOrThrow } from '../stencils/registry.js';
import { resolveStencilStyle, resolveGroupStyle } from '../stencils/registry.js';
import type { StencilNodeInput, StencilGroupInput } from '../stencils/types.js';

export function buildStencilCellXml(id: string, input: StencilNodeInput): string {
  const library = getLibraryOrThrow(input.library);
  const width = input.width ?? 60;
  const height = input.height ?? 60;
  const parent = input.parent ?? '1';
  const labelPos = input.labelPosition ?? 'bottom';

  const style = resolveStencilStyle(library, input.shape, {
    fillColor: input.fillColor,
    styleOverrides: input.styleOverrides,
  });

  let labelAttr = '';
  if (labelPos !== 'none' && input.label) {
    labelAttr = `value="${escapeAttrValue(input.label)}"`;
  }

  const lines: string[] = [];
  lines.push(`      <mxCell id="${id}" ${labelAttr}`);
  lines.push(`        style="${style}"`);
  lines.push(`        vertex="1" parent="${parent}">`);
  lines.push(`        <mxGeometry x="${input.x}" y="${input.y}" width="${width}" height="${height}" as="geometry"/>`);
  lines.push(`      </mxCell>`);

  return lines.join('\n');
}

export function buildStencilGroupXml(id: string, input: StencilGroupInput): string {
  const library = getLibraryOrThrow(input.library);
  const parent = input.parent ?? '1';

  const style = resolveGroupStyle(library, input.group, {
    strokeColor: input.strokeColor,
    label: input.label,
    styleOverrides: input.styleOverrides,
  });

  const labelAttr = input.label ? `value="${escapeAttrValue(input.label)}"` : '';

  const lines: string[] = [];
  lines.push(`      <mxCell id="${id}" ${labelAttr}`);
  lines.push(`        style="${style}"`);
  lines.push(`        vertex="1" parent="${parent}">`);
  lines.push(`        <mxGeometry x="${input.x}" y="${input.y}" width="${input.width}" height="${input.height}" as="geometry"/>`);
  lines.push(`      </mxCell>`);

  return lines.join('\n');
}

export function buildRawStencilStyle(libraryId: string, shapeName: string, fillColor?: string): string {
  const library = getLibraryOrThrow(libraryId);
  return resolveStencilStyle(library, shapeName, { fillColor });
}
