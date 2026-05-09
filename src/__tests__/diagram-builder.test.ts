import { describe, it, expect, beforeEach } from 'vitest';
import { resetIdCounter } from '../utils/id-generator.js';
import { DiagramBuilder } from '../builder/diagram-builder.js';

describe('DiagramBuilder', () => {
  beforeEach(() => {
    resetIdCounter();
  });

  it('should generate valid mxGraphModel XML', () => {
    const builder = new DiagramBuilder({ style: 1 });
    const xml = builder.toXml();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<mxGraphModel');
    expect(xml).toContain('<mxCell id="0"/>');
    expect(xml).toContain('<mxCell id="1" parent="0"/>');
    expect(xml).toContain('</mxGraphModel>');
  });

  it('should add nodes with correct XML structure', () => {
    const builder = new DiagramBuilder({ style: 1, title: 'Test' });
    const id = builder.addNode({
      type: 'process', label: 'Hello', x: 100, y: 100, width: 160, height: 60,
    });
    expect(id).toBe('2');
    const xml = builder.toXml();
    expect(xml).toContain('id="2"');
    expect(xml).toContain('Hello');
    expect(xml).toContain('vertex="1"');
  });

  it('should escape special characters in labels', () => {
    const builder = new DiagramBuilder({ style: 1 });
    builder.addNode({
      type: 'process', label: 'A&B<>"', x: 100, y: 100, width: 160, height: 60,
    });
    const xml = builder.toXml();
    // escapeAttrValue escapes &, <, >, " but not ' (inside double-quoted attr)
    expect(xml).toContain('A&amp;B&lt;&gt;&quot;');
    expect(xml).not.toContain('A&B<');
  });

  it('should add edges between nodes', () => {
    const builder = new DiagramBuilder({ style: 1 });
    const n1 = builder.addNode({ type: 'process', label: 'A', x: 100, y: 100, width: 160, height: 60 });
    const n2 = builder.addNode({ type: 'process', label: 'B', x: 100, y: 300, width: 160, height: 60 });
    builder.addEdge({ source: n1, target: n2, label: 'calls' });
    const xml = builder.toXml();
    expect(xml).toContain('edge="1"');
    expect(xml).toContain('calls');
    expect(xml).toContain(`source="${n1}"`);
    expect(xml).toContain(`target="${n2}"`);
  });

  it('should add groups', () => {
    const builder = new DiagramBuilder({ style: 1 });
    const gId = builder.addGroup({ label: 'Group A', x: 50, y: 50, width: 400, height: 300 });
    expect(gId).toBeTruthy();
    const xml = builder.toXml();
    expect(xml).toContain('Group A');
    expect(xml).toContain('connectable="0"');
  });

  it('should generate .drawio file format', () => {
    const builder = new DiagramBuilder({ style: 1 });
    builder.addNode({ type: 'process', label: 'Test', x: 100, y: 100, width: 160, height: 60 });
    const file = builder.toDrawioFile();
    expect(file).toContain('<mxfile');
    expect(file).toContain('<diagram');
    expect(file).toContain('</mxfile>');
  });

  it('should apply different styles', () => {
    const builder1 = new DiagramBuilder({ style: 1 });
    builder1.addNode({ type: 'process', label: 'A', x: 100, y: 100, width: 160, height: 60 });
    const xml1 = builder1.toXml();

    const builder2 = new DiagramBuilder({ style: 2 });
    builder2.addNode({ type: 'process', label: 'A', x: 100, y: 100, width: 160, height: 60 });
    const xml2 = builder2.toXml();

    // Style 1 (flat) and Style 2 (dark) should have different colors
    expect(xml1).not.toBe(xml2);
  });

  it('should support styleOverrides', () => {
    const builder = new DiagramBuilder({ style: 1 });
    builder.addNode({
      type: 'process', label: 'Custom', x: 100, y: 100, width: 160, height: 60,
      styleOverrides: { fillColor: '#ff0000' },
    });
    const xml = builder.toXml();
    expect(xml).toContain('fillColor=#ff0000');
  });

  it('should sanitize malicious styleOverrides', () => {
    const builder = new DiagramBuilder({ style: 1 });
    builder.addNode({
      type: 'process', label: 'Hack', x: 100, y: 100, width: 160, height: 60,
      styleOverrides: { fillColor: 'red"><inject' },
    });
    const xml = builder.toXml();
    // Quotes and > should be stripped from style values, preventing attribute breakout
    // Verify the style attribute doesn't contain the breakout pattern
    const styleMatch = xml.match(/style="([^"]*)"/g);
    expect(styleMatch).toBeTruthy();
    for (const m of styleMatch!) {
      // No unescaped quote+angle bracket breakout inside style
      expect(m).not.toMatch(/fillColor=[^;]*"/);
    }
    // The dangerous chars " and > are stripped from the value
    expect(xml).toContain('fillColor=red<inject;');
  });
});
