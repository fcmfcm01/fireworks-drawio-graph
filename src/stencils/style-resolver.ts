import type { StencilLibraryDef, StencilShapeDef, StencilShapeVariant } from './types.js';

export function resolveStencilStyle(
  library: StencilLibraryDef,
  shapeName: string,
  overrides?: { fillColor?: string; styleOverrides?: Record<string, string> },
): string {
  const shape = library.shapes[shapeName];
  if (!shape) {
    throw new Error(
      `Shape "${shapeName}" not found in library "${library.id}". ` +
      `Available: ${Object.keys(library.shapes).slice(0, 20).join(', ')}...`,
    );
  }

  let style = applyStyleTemplate(library, shape);

  if (overrides?.fillColor) {
    style = style.replace(/fillColor=[^;]+/, `fillColor=${overrides.fillColor}`);
  }

  if (overrides?.styleOverrides) {
    style = mergeStyleProperties(style, overrides.styleOverrides);
  }

  return style;
}

export function resolveGroupStyle(
  library: StencilLibraryDef,
  groupName: string,
  overrides?: { strokeColor?: string; label?: string; styleOverrides?: Record<string, string> },
): string {
  const group = library.groups[groupName];
  if (!group) {
    throw new Error(
      `Group "${groupName}" not found in library "${library.id}". ` +
      `Available: ${Object.keys(library.groups).join(', ')}`,
    );
  }

  let style = library.groupStyle
    .replace(/\{PREFIX\}/g, library.prefix)
    .replace(/\{GROUP\}/g, groupName)
    .replace(/\{STROKE\}/g, overrides?.strokeColor ?? group.strokeColor);

  if (overrides?.styleOverrides) {
    style = mergeStyleProperties(style, overrides.styleOverrides);
  }

  return style;
}

function applyStyleTemplate(library: StencilLibraryDef, shape: StencilShapeDef): string {
  const template = shape.variant === 'resourceIcon'
    ? library.resourceIconStyle
    : library.directStyle;

  return template
    .replace(/\{PREFIX\}/g, library.prefix)
    .replace(/\{COLOR\}/g, shape.color)
    .replace(/\{SHAPE\}/g, shape.name);
}

function mergeStyleProperties(base: string, overrides: Record<string, string>): string {
  const map = new Map<string, string>();
  for (const part of base.split(';')) {
    const eqIdx = part.indexOf('=');
    if (eqIdx > 0) {
      map.set(part.substring(0, eqIdx).trim(), part.substring(eqIdx + 1).trim());
    }
  }
  for (const [key, val] of Object.entries(overrides)) {
    const safeKey = key.replace(/["'>]/g, '');
    const safeVal = val.replace(/["'>]/g, '');
    map.set(safeKey, safeVal);
  }
  const entries: string[] = [];
  map.forEach((val, key) => entries.push(`${key}=${val}`));
  return entries.join(';');
}

export function getStencilShapeNames(library: StencilLibraryDef, category?: string): string[] {
  const shapes = Object.values(library.shapes);
  const filtered = category ? shapes.filter(s => s.category === category) : shapes;
  return filtered.map(s => s.name);
}

export function getStencilCategories(library: StencilLibraryDef): string[] {
  const cats = new Set(Object.values(library.shapes).map(s => s.category));
  return Array.from(cats).sort();
}
