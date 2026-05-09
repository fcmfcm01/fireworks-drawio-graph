/**
 * Icon Node — 在 draw.io 图表中嵌入自定义 SVG 图标的工具。
 *
 * draw.io 支持通过 `image=` style 属性嵌入 SVG。
 * 本模块提供两种编码方式和便捷的节点构建 API。
 */

import { escapeAttrValue } from '../utils/xml-escape.js';
import type { StyleTheme } from '../styles/index.js';

/**
 * SVG 编码方式。
 * - `utf8`: URL-encode 直接内嵌，XML 更可读，推荐用于源码/调试
 * - `base64`: Base64 编码，兼容性更好，推荐用于生产文件
 */
export type SvgEncoding = 'utf8' | 'base64';

/**
 * 将 SVG 字符串编码为 data URI。
 */
export function svgToDataUri(svg: string, encoding: SvgEncoding = 'utf8'): string {
  if (encoding === 'base64') {
    // Buffer is available in Node.js
    const encoded = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${encoded}`;
  }
  // UTF-8: URL-encode special chars
  const encoded = encodeURIComponent(svg)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')   // Single quote — critical for double-quoted attrs
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Icon Node 的布局选项。
 */
export interface IconNodeConfig {
  /** 节点显示的标签文本 */
  label: string;
  /** SVG 内容 */
  svgContent: string;
  /** SVG 编码方式 */
  encoding?: SvgEncoding;
  /**
   * 标签位置。
   * 默认 "bottom": 标签在图标下方
   * "center": 标签覆盖在图标中央
   * "top": 标签在图标上方
   * "none": 不显示标签
   */
  labelPosition?: 'bottom' | 'center' | 'top' | 'none';
  /** 节点宽度（默认 64） */
  width?: number;
  /** 节点高度（默认 64） */
  height?: number;
}

/**
 * 构建一个完整的 mxCell XML 片段（icon node）。
 *
 * Icon node 使用 draw.io 的 image shape 来渲染 SVG。
 * 样式参数通过 theme 参数从当前主题继承。
 */
export function buildIconCell(
  id: string,
  config: IconNodeConfig,
  theme: StyleTheme,
): string {
  const {
    label,
    svgContent,
    encoding = 'utf8',
    labelPosition = 'bottom',
    width = 64,
    height = 64,
  } = config;

  const imageUri = svgToDataUri(svgContent, encoding);
  const fontSize = Math.max(9, Math.min(14, Math.floor(height * 0.15)));

  // Label style based on position
  let vLabelPos: string;
  let vAlign: string;
  let spacing: string;
  let labelStyle: string;

  switch (labelPosition) {
    case 'center':
      vLabelPos = 'middle';
      vAlign = 'center';
      spacing = '0';
      labelStyle = `align=center;verticalLabelPosition=middle;verticalAlign=middle;`;
      break;
    case 'top':
      vLabelPos = 'top';
      vAlign = 'center';
      spacing = '4';
      labelStyle = `align=center;verticalLabelPosition=top;verticalAlign=bottom;spacingBottom=${spacing};`;
      break;
    case 'none':
      vLabelPos = 'middle';
      vAlign = 'center';
      spacing = '0';
      labelStyle = `align=center;verticalLabelPosition=middle;verticalAlign=middle;`;
      break;
    case 'bottom':
    default:
      vLabelPos = 'bottom';
      vAlign = 'center';
      spacing = '4';
      labelStyle = `align=center;verticalLabelPosition=bottom;verticalAlign=top;spacingTop=${spacing};`;
      break;
  }

  // Build complete style string
  // image= URI goes first in style for draw.io to recognize it
  const style = [
    `image=${imageUri}`,
    `imageBorder=0`,
    `imageBackgroundColor=none`,
    `fillColor=none`,
    `strokeColor=none`,
    `html=1`,
    `shape=image`,
    labelStyle,
    labelPosition !== 'none' ? `fontColor=${theme.textPrimary}` : '',
    labelPosition !== 'none' ? `fontSize=${fontSize}` : '',
    `resizable=1`,
  ].filter(Boolean).join(';');

  const labelAttr = labelPosition !== 'none' ? `value="${escapeAttrValue(label)}"` : '';

  return [
    `    <mxCell id="${id}" ${labelAttr}`,
    `      style="${style}"`,
    `      vertex="1" parent="1">`,
    `      <mxGeometry x="0" y="0" width="${width}" height="${height}" as="geometry"/>`,
    `    </mxCell>`,
  ].join('\n');
}

/**
 * 构建带图标的组合节点：上方 SVG 图标 + 下方标签文字。
 *
 * 这是最常用的模式，用于技术架构图中的 AI/LLM/数据库等概念节点。
 *
 * 生成两个 mxCell：
 * - iconCell: SVG 图标（无标签）
 * - labelCell: 标签文字（位于图标下方，使用透明背景）
 */
export function buildIconWithLabel(
  iconId: string,
  labelId: string,
  iconSvg: string,
  label: string,
  x: number,
  y: number,
  width: number,
  height: number,
  theme: StyleTheme,
  encoding: SvgEncoding = 'utf8',
): { iconCell: string; labelCell: string } {
  const imageUri = svgToDataUri(iconSvg, encoding);

  // Icon cell: SVG without label
  const iconStyle = [
    `image=${imageUri}`,
    `fillColor=none`,
    `strokeColor=none`,
    `imageBorder=0`,
    `imageBackgroundColor=none`,
    `resizable=1`,
  ].join(';');

  const iconCell = [
    `    <mxCell id="${iconId}"`,
    `      style="${iconStyle}"`,
    `      vertex="1" parent="1">`,
    `      <mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/>`,
    `    </mxCell>`,
  ].join('\n');

  // Label cell: text below icon, transparent background
  const fontSize = Math.max(9, Math.min(12, Math.floor(width * 0.15)));
  const labelY = y + height + 2;
  const labelWidth = width;

  const labelCell = [
    `    <mxCell id="${labelId}" value="${escapeAttrValue(label)}"`,
    `      style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalLabelPosition=bottom;verticalAlign=top;fontColor=${theme.textPrimary};fontSize=${fontSize};fontStyle=0;whiteSpace=wrap;overflow=hidden;"`,
    `      vertex="1" parent="1">`,
    `      <mxGeometry x="${x}" y="${labelY}" width="${labelWidth}" height="20" as="geometry"/>`,
    `    </mxCell>`,
  ].join('\n');

  return { iconCell, labelCell };
}

/**
 * 将 SVG 中的 {{COLOR}} 占位符替换为主题色。
 * 便捷包装。
 */
export function applyThemeToSvg(
  svg: string,
  theme: StyleTheme,
  primaryKey = 'PRIMARY',
  secondaryKey = 'SECONDARY',
): string {
  return svg
    .replace(new RegExp(`\\{\\{${primaryKey}\\}\\}`, 'g'), theme.fillColor)
    .replace(new RegExp(`\\{\\{${secondaryKey}\\}\\}`, 'g'), theme.strokeColor);
}
