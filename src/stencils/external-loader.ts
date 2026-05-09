/**
 * External library loader — download, parse, cache, and use draw.io
 * community shape libraries from the drawio-libs repository.
 *
 * @module stencils/external-loader
 */

import { inflateRawSync } from 'node:zlib';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { escapeAttrValue } from '../utils/xml-escape.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single entry from an mxlibrary file */
export interface ExternalLibEntry {
  /** Shape title (e.g., "AWS Lambda") */
  title: string;
  /** Decompressed mxGraphModel XML (for XML-based libraries) */
  xml: string;
  /** Data URI for image-based libraries (e.g., "data:image/png;base64,...") */
  data?: string;
  /** Default width */
  w: number;
  /** Default height */
  h: number;
}

/** A parsed external library */
export interface ExternalLibrary {
  /** Library name (derived from filename or provided) */
  name: string;
  /** Source URL or file path */
  source: string;
  /** Parsed entries */
  entries: ExternalLibEntry[];
}

// ---------------------------------------------------------------------------
// Popular libraries registry
// ---------------------------------------------------------------------------

/** Well-known draw.io community libraries from the drawio-libs repository */
export const POPULAR_LIBRARIES: Record<string, { url: string; description: string }> = {
  templates: {
    url: 'https://raw.githubusercontent.com/jgraph/drawio-libs/master/libs/templates.xml',
    description: 'General diagram templates (sequence, flowchart, etc.)',
  },
  digitalocean: {
    url: 'https://raw.githubusercontent.com/jgraph/drawio-libs/master/libs/digitalocean.xml',
    description: 'DigitalOcean cloud infrastructure icons',
  },
  'material-design-icons': {
    url: 'https://raw.githubusercontent.com/jgraph/drawio-libs/master/libs/material-design-icons.xml',
    description: 'Google Material Design icons',
  },
  'font-awesome': {
    url: 'https://raw.githubusercontent.com/jgraph/drawio-libs/master/libs/font-awesome.xml',
    description: 'Font Awesome icons',
  },
  'flat-color-icons': {
    url: 'https://raw.githubusercontent.com/jgraph/drawio-libs/master/libs/flat-color-icons.xml',
    description: 'Flat Color icons collection',
  },
  arista: {
    url: 'https://raw.githubusercontent.com/jgraph/drawio-libs/master/libs/arista.xml',
    description: 'Arista networking icons',
  },
  'osa-icons': {
    url: 'https://raw.githubusercontent.com/jgraph/drawio-libs/master/libs/osa-icons.xml',
    description: 'Open System Architecture icons',
  },
  vmware: {
    url: 'https://raw.githubusercontent.com/jgraph/drawio-libs/master/libs/vmware.xml',
    description: 'VMware infrastructure icons',
  },
};

// ---------------------------------------------------------------------------
// Core helpers
// ---------------------------------------------------------------------------

/**
 * Decompress a base64-encoded, deflate-compressed mxGraphModel XML string.
 *
 * @param compressed - Base64-encoded deflate-compressed XML
 * @returns Decompressed UTF-8 XML string
 * @throws Error if decompression fails
 */
export function decompressXml(compressed: string): string {
  try {
    const buffer = Buffer.from(compressed, 'base64');
    const inflated = inflateRawSync(buffer);
    return decodeURIComponent(inflated.toString('utf-8'));
  } catch (err) {
    throw new Error(
      `Failed to decompress XML: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Parse an mxlibrary XML string into a structured ExternalLibrary.
 *
 * @param xml - Raw XML content containing `<mxlibrary>...</mxlibrary>`
 * @param name - Library name
 * @param source - Source URL or file path
 * @returns Parsed external library
 * @throws Error if the mxlibrary tag is missing or JSON is malformed
 */
export function parseMxLibrary(xml: string, name: string, source: string): ExternalLibrary {
  const startTag = '<mxlibrary>';
  const endTag = '</mxlibrary>';
  const startIdx = xml.indexOf(startTag);
  const endIdx = xml.indexOf(endTag);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Invalid mxlibrary format: missing <mxlibrary> tags in "${name}"`);
  }

  const jsonStr = xml.slice(startIdx + startTag.length, endIdx);
  const rawEntries: Array<{ title?: string; xml?: string; data?: string; w: number; h: number }> =
    JSON.parse(jsonStr);

  const entries: ExternalLibEntry[] = [];
  for (const raw of rawEntries) {
    const title = raw.title || '';

    // Image-based entry (data URI, e.g., data:image/png;base64,...)
    if (raw.data && !raw.xml) {
      entries.push({
        title,
        xml: '',
        data: raw.data,
        w: raw.w,
        h: raw.h,
      });
      continue;
    }

    // XML-based entry (compressed mxGraphModel)
    if (raw.xml) {
      try {
        const decompressed = decompressXml(raw.xml);
        entries.push({
          title,
          xml: decompressed,
          w: raw.w,
          h: raw.h,
        });
      } catch {
        // Skip entries that fail to decompress
      }
    }
  }

  return { name, source, entries };
}

// ---------------------------------------------------------------------------
// Library loading
// ---------------------------------------------------------------------------

/**
 * Fetch and parse an external library from a URL.
 *
 * @param url - URL to the mxlibrary XML file
 * @param name - Optional library name (derived from URL filename if omitted)
 * @returns Parsed external library
 * @throws Error if fetch fails or response is non-200
 */
export async function fetchLibrary(url: string, name?: string): Promise<ExternalLibrary> {
  const derivedName = name ?? deriveNameFromPath(url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch library "${derivedName}" from ${url}: ${response.status} ${response.statusText}`
    );
  }

  const text = await response.text();
  return parseMxLibrary(text, derivedName, url);
}

/**
 * Load and parse an external library from a local file.
 *
 * @param filePath - Path to the mxlibrary XML file
 * @param name - Optional library name (derived from filename if omitted)
 * @returns Parsed external library
 * @throws Error if file cannot be read
 */
export async function loadLibraryFromFile(
  filePath: string,
  name?: string
): Promise<ExternalLibrary> {
  const derivedName = name ?? deriveNameFromPath(filePath);
  const text = await fs.readFile(filePath, 'utf-8');
  return parseMxLibrary(text, derivedName, filePath);
}

// ---------------------------------------------------------------------------
// Caching
// ---------------------------------------------------------------------------

/**
 * Get the default cache directory for downloaded libraries.
 *
 * @returns Path to `~/.fireworks-drawio-graph/libs`
 */
export function getDefaultCacheDir(): string {
  return path.join(os.homedir(), '.fireworks-drawio-graph', 'libs');
}

/**
 * Load a previously cached library by name.
 *
 * @param name - Library name (filename stem)
 * @param cacheDir - Optional cache directory (defaults to `getDefaultCacheDir()`)
 * @returns Parsed external library
 * @throws Error if cached file is not found
 */
export async function loadCachedLibrary(
  name: string,
  cacheDir?: string
): Promise<ExternalLibrary> {
  const dir = cacheDir ?? getDefaultCacheDir();
  const filePath = path.join(dir, `${name}.xml`);
  const text = await fs.readFile(filePath, 'utf-8');
  return parseMxLibrary(text, name, filePath);
}

/**
 * List all cached library names.
 *
 * @param cacheDir - Optional cache directory (defaults to `getDefaultCacheDir()`)
 * @returns Array of library names (filename stems) or empty array if directory missing
 */
export async function listCachedLibraries(cacheDir?: string): Promise<string[]> {
  const dir = cacheDir ?? getDefaultCacheDir();

  try {
    const files = await fs.readdir(dir);
    return files
      .filter((f) => f.endsWith('.xml'))
      .map((f) => f.slice(0, f.length - 4));
  } catch {
    return [];
  }
}

/**
 * Download an external library from a URL and cache it locally.
 *
 * Saves the raw (unparsed) XML to disk and returns the parsed library.
 *
 * @param url - URL to the mxlibrary XML file
 * @param name - Optional library name (derived from URL if omitted)
 * @param cacheDir - Optional cache directory (defaults to `getDefaultCacheDir()`)
 * @returns Parsed external library
 * @throws Error if fetch fails
 */
export async function downloadLibrary(
  url: string,
  name?: string,
  cacheDir?: string
): Promise<ExternalLibrary> {
  const derivedName = name ?? deriveNameFromPath(url);
  const dir = cacheDir ?? getDefaultCacheDir();

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to download library "${derivedName}" from ${url}: ${response.status} ${response.statusText}`
    );
  }

  const rawText = await response.text();

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${derivedName}.xml`), rawText, 'utf-8');

  return parseMxLibrary(rawText, derivedName, url);
}

// ---------------------------------------------------------------------------
// Shape lookup and XML generation
// ---------------------------------------------------------------------------

/**
 * List all shapes available in an external library.
 *
 * @param lib - Parsed external library
 * @returns Array of shape descriptors with index, title, and dimensions
 */
export function listExternalShapes(
  lib: ExternalLibrary
): Array<{ index: number; title: string; w: number; h: number }> {
  return lib.entries.map((entry, index) => ({
    index,
    title: entry.title || `Shape ${index}`,
    w: entry.w,
    h: entry.h,
  }));
}

/**
 * Find a shape entry by title (case-insensitive).
 *
 * @param lib - Parsed external library
 * @param title - Shape title to search for
 * @returns Entry index or -1 if not found
 */
export function findEntryByTitle(lib: ExternalLibrary, title: string): number {
  const lower = title.toLowerCase();
  return lib.entries.findIndex((e) => e.title?.toLowerCase() === lower);
}

/**
 * Build an mxCell XML string for an external library shape.
 *
 * Extracts the style from the entry's decompressed mxGraphModel XML and
 * creates a positioned, sized mxCell suitable for embedding in a diagram.
 *
 * @param id - Cell ID for the new mxCell
 * @param lib - Parsed external library
 * @param entryIndex - Index of the entry to use
 * @param x - X position
 * @param y - Y position
 * @param overrides - Optional overrides for width, height, label, style, and parent
 * @returns mxCell XML string
 * @throws Error if entryIndex is out of range
 */
export function buildExternalShapeXml(
  id: string,
  lib: ExternalLibrary,
  entryIndex: number,
  x: number,
  y: number,
  overrides?: { w?: number; h?: number; label?: string; style?: string; parent?: string }
): string {
  const entry = lib.entries[entryIndex];
  if (!entry) {
    throw new Error(
      `Entry index ${entryIndex} out of range (library "${lib.name}" has ${lib.entries.length} entries)`
    );
  }

  const width = overrides?.w ?? entry.w;
  const height = overrides?.h ?? entry.h;
  const parent = overrides?.parent ?? '1';

  let style: string;
  if (entry.data) {
    // Image-based entry — embed data URI as image shape
    style = overrides?.style ?? `shape=image;verticalLabelPosition=bottom;labelBackgroundColor=default;verticalAlign=top;aspect=fixed;imageAspect=0;image=${entry.data};`;
  } else {
    // XML-based entry — extract style from decompressed mxGraphModel
    const extractedStyle = extractStyleFromXml(entry.xml);
    style = overrides?.style ?? extractedStyle;
  }

  let labelAttr = '';
  if (overrides?.label) {
    labelAttr = `value="${escapeAttrValue(overrides.label)}"`;
  }

  const lines: string[] = [];
  lines.push(`      <mxCell id="${id}" ${labelAttr}`);
  lines.push(`        style="${escapeAttrValue(style)}"`);
  lines.push(`        vertex="1" parent="${parent}">`);
  lines.push(`        <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/>`);
  lines.push(`      </mxCell>`);

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Derive a library name from a URL or file path by extracting the filename
 * stem (without extension).
 */
function deriveNameFromPath(urlOrPath: string): string {
  const base = path.basename(urlOrPath);
  const dotIdx = base.lastIndexOf('.');
  return dotIdx > 0 ? base.slice(0, dotIdx) : base;
}

/**
 * Extract the style attribute from the first non-root mxCell in a
 * decompressed mxGraphModel XML.
 */
function extractStyleFromXml(xml: string): string {
  // Match style="..." on mxCell elements, skip id="0" (root) and id="1" (default parent)
  const styleMatch = xml.match(/<mxCell[^>]+id="(?!0|1)\d*"[^>]*style="([^"]*)"/);
  if (styleMatch) {
    return styleMatch[1];
  }

  // Fallback: try any mxCell with a style attribute
  const fallbackMatch = xml.match(/<mxCell[^>]*style="([^"]*)"/);
  return fallbackMatch ? fallbackMatch[1] : '';
}
