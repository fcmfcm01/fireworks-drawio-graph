/**
 * XML special character escaping utilities.
 * Ensures all text content in mxGraphModel XML is properly escaped.
 */

/**
 * Escape special XML characters in a string.
 * Handles: & < > " '
 */
export function escapeXml(str: string): string {
  if (!str) return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Escape text for use inside XML attribute values (e.g., value="...").
 * In draw.io mxCell, the value attribute contains the label text.
 */
export function escapeAttrValue(str: string): string {
  if (!str) return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Unescape XML entities back to characters (for display/debugging).
 */
export function unescapeXml(str: string): string {
  if (!str) return str;
  return str
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}
