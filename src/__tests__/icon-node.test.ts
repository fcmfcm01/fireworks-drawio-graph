import { describe, it, expect } from 'vitest';
import { svgToDataUri, buildIconCell, buildIconWithLabel, applyThemeToSvg } from '../builder/icon-node.js';
import { ICON_TEMPLATES, ICON_NAMES, applyTheme } from '../icons/ai-icons.js';
import { getStyleTheme } from '../styles/index.js';

const THEME = getStyleTheme(1);

describe('svgToDataUri', () => {
  it('should encode SVG as base64 data URI', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="20"/></svg>';
    const uri = svgToDataUri(svg, 'base64');
    expect(uri).toContain('data:image/svg+xml;base64,');
    expect(uri).not.toContain('<svg');
  });

  it('should encode SVG as UTF-8 data URI', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="20"/></svg>';
    const uri = svgToDataUri(svg, 'utf8');
    expect(uri).toContain('data:image/svg+xml,');
    expect(uri).toContain('xmlns');
    expect(uri).toContain('viewBox');
  });

  it('should escape single quotes in utf8 mode', () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><text>it's</text></svg>`;
    const uri = svgToDataUri(svg, 'utf8');
    expect(uri).not.toContain("'");
    expect(uri).toContain('%27');
  });

  it('should not modify SVG content', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><text>Hello</text></svg>';
    const base64Uri = svgToDataUri(svg, 'base64');
    // Decode base64 and verify content
    const decoded = Buffer.from(base64Uri.split(',')[1], 'base64').toString('utf8');
    expect(decoded).toBe(svg);
  });
});

describe('buildIconCell', () => {
  it('should build valid mxCell XML with image style', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="20"/></svg>';
    const xml = buildIconCell('5', { label: 'LLM', svgContent: svg }, THEME);
    expect(xml).toContain('id="5"');
    expect(xml).toContain('value="LLM"');
    expect(xml).toContain('image=data:image/svg+xml');
    expect(xml).toContain('shape=image');
    expect(xml).toContain('fillColor=none');
    expect(xml).toContain('strokeColor=none');
    expect(xml).toContain('vertex="1"');
    expect(xml).toContain('<mxGeometry');
  });

  it('should position label at bottom by default', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"/>';
    const xml = buildIconCell('5', { label: 'Test', svgContent: svg }, THEME);
    expect(xml).toContain('verticalLabelPosition=bottom');
    expect(xml).toContain('verticalAlign=top');
  });

  it('should position label at center when specified', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"/>';
    const xml = buildIconCell('5', { label: 'Test', svgContent: svg, labelPosition: 'center' }, THEME);
    expect(xml).toContain('verticalLabelPosition=middle');
    expect(xml).toContain('verticalAlign=middle');
  });

  it('should omit label when labelPosition is none', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"/>';
    const xml = buildIconCell('5', { label: 'Test', svgContent: svg, labelPosition: 'none' }, THEME);
    expect(xml).not.toContain('value=');
  });
});

describe('buildIconWithLabel', () => {
  it('should return both icon and label cells', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="20"/></svg>';
    const { iconCell, labelCell } = buildIconWithLabel('5', '6', svg, 'LLM', 100, 50, 64, 64, THEME);

    expect(iconCell).toContain('id="5"');
    expect(iconCell).toContain('image=data:image/svg+xml');
    expect(iconCell).not.toContain('value=');
    expect(iconCell).toContain('vertex="1"');

    expect(labelCell).toContain('id="6"');
    expect(labelCell).toContain('value="LLM"');
    expect(labelCell).toContain('text;html=1');
    expect(labelCell).toContain('fillColor=none');
  });

  it('should position label below icon', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"/>';
    const { labelCell } = buildIconWithLabel('5', '6', svg, 'Test', 100, 50, 64, 64, THEME);
    // Label geometry y should be icon y + icon height + margin
    expect(labelCell).toContain('x="100"');
    expect(labelCell).toContain('y="116"'); // 50 + 64 + 2
  });
});

describe('applyThemeToSvg', () => {
  it('should replace placeholder colors with theme colors', () => {
    const svg = '<svg><rect fill="{{PRIMARY}}"/></svg>';
    const result = applyThemeToSvg(svg, THEME);
    expect(result).not.toContain('{{PRIMARY}}');
    expect(result).toContain(THEME.fillColor);
  });

  it('should replace both PRIMARY and SECONDARY', () => {
    const svg = '<svg><rect fill="{{PRIMARY}}"/><rect stroke="{{SECONDARY}}"/></svg>';
    const result = applyThemeToSvg(svg, THEME);
    expect(result).not.toContain('{{PRIMARY}}');
    expect(result).not.toContain('{{SECONDARY}}');
  });
});

describe('ICON_TEMPLATES', () => {
  it('should contain all expected icon names', () => {
    const expected = ['llm', 'agent', 'database', 'tool', 'api', 'memoryShort', 'memoryLong', 'vectorStore', 'browser', 'cloud', 'fn', 'user', 'document', 'queue', 'response', 'search', 'evaluation', 'embedding', 'rag'];
    for (const name of expected) {
      expect(ICON_NAMES).toContain(name);
    }
  });

  it('should have valid SVG XML for all icons', () => {
    for (const name of ICON_NAMES) {
      const svg = ICON_TEMPLATES[name];
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('viewBox="0 0 64 64"');
    }
  });

  it('should apply theme correctly to all icons', () => {
    for (const name of ICON_NAMES) {
      const themed = applyTheme(ICON_TEMPLATES[name], THEME);
      expect(themed).not.toContain('{{PRIMARY}}');
      expect(themed).not.toContain('{{SECONDARY}}');
    }
  });
});

describe('applyTheme', () => {
  it('should replace all color placeholders', () => {
    const svg = '<svg><rect fill="{{PRIMARY}}" stroke="{{SECONDARY}}"/></svg>';
    const result = applyTheme(svg, THEME);
    expect(result).toBe(`<svg><rect fill="${THEME.fillColor}" stroke="${THEME.strokeColor}"/></svg>`);
  });
});
