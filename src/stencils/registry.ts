import type { StencilLibraryDef } from './types.js';
import { resolveStencilStyle, resolveGroupStyle, getStencilShapeNames, getStencilCategories } from './style-resolver.js';

const libraries = new Map<string, StencilLibraryDef>();

export function registerLibrary(lib: StencilLibraryDef): void {
  libraries.set(lib.id, lib);
}

export function getLibrary(id: string): StencilLibraryDef | undefined {
  return libraries.get(id);
}

export function getLibraryOrThrow(id: string): StencilLibraryDef {
  const lib = libraries.get(id);
  if (!lib) throw new Error(`Stencil library "${id}" not registered. Available: ${getLibraryIds().join(', ')}`);
  return lib;
}

export function getLibraryIds(): string[] {
  return Array.from(libraries.keys());
}

export function getAllLibraries(): StencilLibraryDef[] {
  return Array.from(libraries.values());
}

export { resolveStencilStyle, resolveGroupStyle, getStencilShapeNames, getStencilCategories };
