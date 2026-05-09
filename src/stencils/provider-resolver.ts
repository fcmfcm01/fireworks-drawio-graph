/**
 * Provider resolver — maps user-friendly provider names to stencil libraries,
 * auto-downloads external libraries, and searches for shapes across all libraries.
 *
 * @module stencils/provider-resolver
 */

import { getLibraryIds, getLibrary, getAllLibraries } from './registry.js';
import { POPULAR_LIBRARIES, downloadLibrary, loadCachedLibrary, listCachedLibraries, findEntryByTitle } from './external-loader.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Result of resolving a provider name */
export interface ResolvedProvider {
  /** Library ID (e.g., 'aws4', 'digitalocean') */
  library: string;
  /** Library type */
  type: 'builtin' | 'external';
}

/** Result of searching for a shape across libraries */
export interface ShapeSearchResult {
  /** Provider/library name */
  provider: string;
  /** Shape name (builtin key or external entry title) */
  shape: string;
  /** Match confidence 0-1 */
  confidence: number;
  /** Library type */
  type: 'builtin' | 'external';
}

/** Input for the unified addProviderNode API */
export interface ProviderNodeInput {
  /** Provider name (e.g., 'aws', 'digitalocean', 'gcp', 'k8s') */
  provider: string;
  /** Shape name (e.g., 's3', 'droplet', 'lambda') */
  shape: string;
  /** Display label */
  label: string;
  /** X position */
  x: number;
  /** Y position */
  y: number;
  /** Width override */
  width?: number;
  /** Height override */
  height?: number;
  /** Parent cell ID (default "1") */
  parent?: string;
  /** Style overrides */
  styleOverrides?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Provider keyword map
// ---------------------------------------------------------------------------

const PROVIDER_MAP: Record<string, ResolvedProvider> = {
  // Built-in stencils — aliases map to library IDs
  aws:          { library: 'aws4', type: 'builtin' },
  'aws4':       { library: 'aws4', type: 'builtin' },
  amazon:       { library: 'aws4', type: 'builtin' },
  'amazon web services': { library: 'aws4', type: 'builtin' },

  azure:        { library: 'azure', type: 'builtin' },
  'microsoft azure': { library: 'azure', type: 'builtin' },

  gcp:          { library: 'gcp2', type: 'builtin' },
  gcp2:         { library: 'gcp2', type: 'builtin' },
  'google cloud': { library: 'gcp2', type: 'builtin' },
  'google cloud platform': { library: 'gcp2', type: 'builtin' },

  alibaba:      { library: 'alibaba', type: 'builtin' },
  'alibaba cloud': { library: 'alibaba', type: 'builtin' },
  alicloud:     { library: 'alibaba', type: 'builtin' },

  kubernetes:   { library: 'kubernetes', type: 'builtin' },
  k8s:          { library: 'kubernetes', type: 'builtin' },

  cisco:        { library: 'cisco', type: 'builtin' },

  uml:          { library: 'uml', type: 'builtin' },

  bpmn:         { library: 'bpmn', type: 'builtin' },

  // External libraries (from POPULAR_LIBRARIES)
  digitalocean: { library: 'digitalocean', type: 'external' },
  do:           { library: 'digitalocean', type: 'external' },
  'digital ocean': { library: 'digitalocean', type: 'external' },

  vmware:       { library: 'vmware', type: 'external' },
  esxi:         { library: 'vmware', type: 'external' },
  vcenter:      { library: 'vmware', type: 'external' },

  arista:       { library: 'arista', type: 'external' },

  'material-design': { library: 'material-design-icons', type: 'external' },
  'material icons':  { library: 'material-design-icons', type: 'external' },

  'font-awesome': { library: 'font-awesome', type: 'external' },
  fontawesome:    { library: 'font-awesome', type: 'external' },
  fa:             { library: 'font-awesome', type: 'external' },

  'flat-color': { library: 'flat-color-icons', type: 'external' },

  osa:          { library: 'osa-icons', type: 'external' },

  templates:    { library: 'templates', type: 'external' },
};

// ---------------------------------------------------------------------------
// Resolver functions
// ---------------------------------------------------------------------------

/**
 * Resolve a user-friendly provider name to a library ID and type.
 *
 * Normalizes input (lowercase, trimmed, collapsed whitespace) then checks:
 * 1. PROVIDER_MAP for known aliases
 * 2. Built-in library IDs (from registry)
 * 3. POPULAR_LIBRARIES keys for external libraries
 *
 * Returns null if nothing matches.
 */
export function resolveProvider(input: string): ResolvedProvider | null {
  const normalized = input.toLowerCase().trim().replace(/\s+/g, ' ');

  // 1. Direct PROVIDER_MAP lookup
  const mapped = PROVIDER_MAP[normalized];
  if (mapped) return mapped;

  // 2. Try matching against built-in library IDs
  const builtinIds = getLibraryIds();
  if (builtinIds.includes(normalized)) {
    return { library: normalized, type: 'builtin' };
  }

  // 3. Try matching against POPULAR_LIBRARIES keys
  if (normalized in POPULAR_LIBRARIES) {
    return { library: normalized, type: 'external' };
  }

  return null;
}

/**
 * Ensure a library is cached and available for use.
 *
 * For built-in libraries this is a no-op (already registered).
 * For external libraries, downloads the library if not already cached.
 *
 * @throws Error if the external library is not in POPULAR_LIBRARIES and not cached
 */
export async function ensureLibraryCached(
  libraryName: string,
  type: 'builtin' | 'external',
): Promise<void> {
  if (type === 'builtin') {
    // Built-in libraries are always available via side-effect imports
    return;
  }

  // External: check cache first
  const cached = await listCachedLibraries();
  if (cached.includes(libraryName)) {
    return;
  }

  // Need to download
  const popular = POPULAR_LIBRARIES[libraryName];
  if (!popular) {
    throw new Error(
      `External library "${libraryName}" is not in the popular libraries registry. ` +
      `Available: ${Object.keys(POPULAR_LIBRARIES).join(', ')}`,
    );
  }

  await downloadLibrary(popular.url, libraryName);
}

/**
 * Find a shape within a library by name query.
 *
 * For built-in libraries, matches against shape keys (exact → case-insensitive → contains).
 * For external libraries, matches against entry titles.
 *
 * Returns the best match with confidence score, or null if no match.
 */
export function findShapeInLibrary(
  shapeQuery: string,
  libraryId: string,
  type: 'builtin' | 'external',
): { shapeKey: string; confidence: number } | null {
  const normalized = shapeQuery.toLowerCase().trim();

  if (type === 'builtin') {
    const lib = getLibrary(libraryId);
    if (!lib) return null;

    const shapeNames = Object.keys(lib.shapes);

    // Exact match
    if (shapeNames.includes(normalized)) {
      return { shapeKey: normalized, confidence: 1.0 };
    }

    // Case-insensitive match (shape names are already keys)
    const ciMatch = shapeNames.find(k => k.toLowerCase() === normalized);
    if (ciMatch) {
      return { shapeKey: ciMatch, confidence: 0.8 };
    }

    // Contains match
    const containsMatch = shapeNames.find(k => k.toLowerCase().includes(normalized) || normalized.includes(k.toLowerCase()));
    if (containsMatch) {
      return { shapeKey: containsMatch, confidence: 0.6 };
    }

    // Category match — find shapes whose category contains the query
    const categoryMatch = shapeNames.find(k => {
      const shape = lib.shapes[k];
      return shape.category.toLowerCase().includes(normalized);
    });
    if (categoryMatch) {
      return { shapeKey: categoryMatch, confidence: 0.4 };
    }

    return null;
  }

  return findShapeInExternalLibrarySync(shapeQuery, libraryId);
}

// Module-level cache for loaded external libraries (avoids re-loading from disk)
const externalLibCache = new Map<string, Awaited<ReturnType<typeof loadCachedLibrary>>>();

function findShapeInExternalLibrarySync(
  shapeQuery: string,
  libraryId: string,
): { shapeKey: string; confidence: number } | null {
  return null;
}

/**
 * Find a shape in an external library (async version).
 * Loads the cached library and matches against entry titles.
 */
async function findShapeInExternalLibraryAsync(
  shapeQuery: string,
  libraryId: string,
): Promise<{ shapeKey: string; confidence: number } | null> {
  const normalized = shapeQuery.toLowerCase().trim();

  let lib = externalLibCache.get(libraryId);
  if (!lib) {
    lib = await loadCachedLibrary(libraryId);
    externalLibCache.set(libraryId, lib);
  }

  // Exact match on title
  for (let i = 0; i < lib.entries.length; i++) {
    const entry = lib.entries[i];
    if (entry.title === shapeQuery) {
      return { shapeKey: String(i), confidence: 1.0 };
    }
  }

  // Case-insensitive match on title
  for (let i = 0; i < lib.entries.length; i++) {
    const entry = lib.entries[i];
    if (entry.title?.toLowerCase() === normalized) {
      return { shapeKey: String(i), confidence: 0.8 };
    }
  }

  // Contains match on title
  for (let i = 0; i < lib.entries.length; i++) {
    const entry = lib.entries[i];
    const titleLower = entry.title?.toLowerCase() ?? '';
    if (titleLower.includes(normalized) || normalized.includes(titleLower)) {
      return { shapeKey: String(i), confidence: 0.6 };
    }
  }

  return null;
}

/**
 * Search for shapes across all available libraries.
 *
 * If providerHint is given, resolves it and searches only that library.
 * Otherwise, searches ALL libraries (built-in + cached external).
 *
 * Returns results sorted by confidence descending, limited to top 20.
 */
export async function searchShapes(
  query: string,
  providerHint?: string,
): Promise<ShapeSearchResult[]> {
  const results: ShapeSearchResult[] = [];
  const normalized = query.toLowerCase().trim();

  if (providerHint) {
    const resolved = resolveProvider(providerHint);
    if (!resolved) return results;

    await ensureLibraryCached(resolved.library, resolved.type);

    if (resolved.type === 'builtin') {
      const match = findShapeInLibrary(query, resolved.library, 'builtin');
      if (match) {
        results.push({
          provider: resolved.library,
          shape: match.shapeKey,
          confidence: match.confidence,
          type: 'builtin',
        });
      }
    } else {
      const match = await findShapeInExternalLibraryAsync(query, resolved.library);
      if (match) {
        results.push({
          provider: resolved.library,
          shape: match.shapeKey,
          confidence: match.confidence,
          type: 'external',
        });
      }
    }

    return results;
  }

  // Search all built-in libraries
  for (const lib of getAllLibraries()) {
    const shapeNames = Object.keys(lib.shapes);

    for (const name of shapeNames) {
      const nameLower = name.toLowerCase();
      let confidence = 0;

      if (nameLower === normalized) {
        confidence = 1.0;
      } else if (nameLower.includes(normalized) || normalized.includes(nameLower)) {
        confidence = 0.6;
      }

      if (confidence > 0) {
        results.push({
          provider: lib.id,
          shape: name,
          confidence,
          type: 'builtin',
        });
      }
    }
  }

  // Search all cached external libraries
  const cachedLibs = await listCachedLibraries();
  for (const libName of cachedLibs) {
    const match = await findShapeInExternalLibraryAsync(query, libName);
    if (match) {
      results.push({
        provider: libName,
        shape: match.shapeKey,
        confidence: match.confidence,
        type: 'external',
      });
    }
  }

  // Sort by confidence descending, limit to top 20
  results.sort((a, b) => b.confidence - a.confidence);
  return results.slice(0, 20);
}

/**
 * Main orchestrator — resolve a provider + shape, auto-download if needed,
 * and return the resolved provider and matched shape key.
 *
 * @throws Error if provider cannot be resolved or shape not found
 */
export async function resolveAndPrepare(
  provider: string,
  shape: string,
): Promise<{ resolved: ResolvedProvider; shapeKey: string }> {
  // 1. Resolve provider
  const resolved = resolveProvider(provider);
  if (!resolved) {
    throw new Error(
      `Unknown provider "${provider}". ` +
      `Known providers: ${[...Object.keys(PROVIDER_MAP), ...getLibraryIds(), ...Object.keys(POPULAR_LIBRARIES)].filter((v, i, a) => a.indexOf(v) === i).join(', ')}`,
    );
  }

  // 2. Ensure library is cached
  await ensureLibraryCached(resolved.library, resolved.type);

  // 3. Find shape
  let match: { shapeKey: string; confidence: number } | null = null;

  if (resolved.type === 'builtin') {
    match = findShapeInLibrary(shape, resolved.library, 'builtin');
  } else {
    match = await findShapeInExternalLibraryAsync(shape, resolved.library);
  }

  if (!match) {
    if (resolved.type === 'builtin') {
      const lib = getLibrary(resolved.library);
      const available = lib ? Object.keys(lib.shapes).slice(0, 20).join(', ') : '(unknown)';
      throw new Error(
        `Shape "${shape}" not found in built-in library "${resolved.library}". Available: ${available}...`,
      );
    } else {
      let lib = externalLibCache.get(resolved.library);
      if (!lib) {
        lib = await loadCachedLibrary(resolved.library);
        externalLibCache.set(resolved.library, lib);
      }
      const available = lib.entries.map(e => e.title).slice(0, 20).join(', ');
      throw new Error(
        `Shape "${shape}" not found in external library "${resolved.library}". Available: ${available}...`,
      );
    }
  }

  return { resolved, shapeKey: match.shapeKey };
}
