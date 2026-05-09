import { describe, it, expect, beforeEach } from 'vitest';
import { escapeXml, escapeAttrValue, unescapeXml } from '../utils/xml-escape.js';

describe('escapeXml', () => {
  it('should escape all 5 XML special characters', () => {
    expect(escapeXml('&<>\"\'')).toBe('&amp;&lt;&gt;&quot;&apos;');
  });

  it('should escape ampersand first to prevent double-escaping', () => {
    expect(escapeXml('&amp;')).toBe('&amp;amp;');
  });

  it('should return empty string unchanged', () => {
    expect(escapeXml('')).toBe('');
  });

  it('should return string without special chars unchanged', () => {
    expect(escapeXml('hello world')).toBe('hello world');
  });

  it('should handle unicode', () => {
    expect(escapeXml('中文')).toBe('中文');
  });
});

describe('escapeAttrValue', () => {
  it('should escape ", <, >, & for attribute values', () => {
    expect(escapeAttrValue('a"b<c>d&e')).toBe('a&quot;b&lt;c&gt;d&amp;e');
  });

  it('should not escape apostrophe (not needed for double-quoted attrs)', () => {
    expect(escapeAttrValue("it's")).toBe("it's");
  });

  it('should return empty string unchanged', () => {
    expect(escapeAttrValue('')).toBe('');
  });
});

describe('unescapeXml', () => {
  it('should reverse escapeXml for round-trip', () => {
    const original = 'hello & world < > " \' ';
    const escaped = escapeXml(original);
    const unescaped = unescapeXml(escaped);
    expect(unescaped).toBe(original);
  });

  it('should unescape all 5 entities', () => {
    expect(unescapeXml('&amp;&lt;&gt;&quot;&apos;')).toBe('&<>"\'');
  });

  it('should handle empty string', () => {
    expect(unescapeXml('')).toBe('');
  });
});
