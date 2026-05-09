/**
 * AI/LLM 相关 SVG 图标库。
 *
 * 设计原则：
 * - viewBox 统一为 0 0 64 64，方便缩放
 * - 颜色使用主题无关占位符，生成时替换
 * - 每个图标均可独立使用或作为节点背景
 *
 * 替换规则（生成时替换）:
 *   {{PRIMARY}}  →  主题主色（fillColor）
 *   {{SECONDARY}} →  主题次色（strokeColor）
 *   {{TEXT}}      →  文本色（fontColor）
 */

import type { StyleTheme } from '../styles/index.js';

/** 将主题色注入 SVG 模板 */
export function applyTheme(svg: string, theme: StyleTheme): string {
  return svg
    .replace(/\{\{PRIMARY\}\}/g, theme.fillColor)
    .replace(/\{\{SECONDARY\}\}/g, theme.strokeColor)
    .replace(/\{\{TERTIARY\}\}/g, theme.textSecondary ?? theme.strokeColor);
}

/** SVG 图标模板（包含占位符） */
export const ICON_TEMPLATES = {
  /** 大语言模型 / AI 核心 */
  llm: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{{PRIMARY}}"/>
      <stop offset="100%" stop-color="{{SECONDARY}}"/>
    </linearGradient>
  </defs>
  <circle cx="32" cy="32" r="28" fill="url(#g)"/>
  <circle cx="32" cy="26" r="8" fill="white" opacity="0.95"/>
  <rect x="20" y="38" width="24" height="12" rx="4" fill="white" opacity="0.95"/>
</svg>`,

  /** AI Agent（多模块代理） */
  agent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="8" y="8" width="48" height="48" rx="10" fill="{{PRIMARY}}" stroke="{{SECONDARY}}" stroke-width="2"/>
  <circle cx="24" cy="24" r="4" fill="white" opacity="0.9"/>
  <circle cx="40" cy="24" r="4" fill="white" opacity="0.9"/>
  <path d="M20 40 Q32 52 44 40" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`,

  /** 数据库 / 向量存储 */
  database: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <ellipse cx="32" cy="16" rx="20" ry="8" fill="{{PRIMARY}}"/>
  <path d="M12 16 L12 48 Q12 56 32 56 Q52 56 52 48 L52 16" fill="{{PRIMARY}}"/>
  <ellipse cx="32" cy="16" rx="20" ry="8" fill="none" stroke="{{SECONDARY}}" stroke-width="1.5"/>
  <path d="M12 32 Q12 40 32 40 Q52 40 52 32" fill="none" stroke="white" stroke-opacity="0.4" stroke-width="1.5"/>
  <ellipse cx="32" cy="32" rx="20" ry="8" fill="none" stroke="white" stroke-opacity="0.4" stroke-width="1.5"/>
  <ellipse cx="32" cy="48" rx="20" ry="8" fill="none" stroke="white" stroke-opacity="0.3" stroke-width="1"/>
</svg>`,

  /** 工具 / Function Call */
  tool: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="32" r="26" fill="none" stroke="{{PRIMARY}}" stroke-width="5"/>
  <circle cx="32" cy="32" r="11" fill="{{PRIMARY}}"/>
  <rect x="28" y="1" width="8" height="13" rx="3" fill="{{PRIMARY}}"/>
  <rect x="28" y="50" width="8" height="13" rx="3" fill="{{PRIMARY}}"/>
  <rect x="1" y="28" width="13" height="8" rx="3" fill="{{PRIMARY}}"/>
  <rect x="50" y="28" width="13" height="8" rx="3" fill="{{PRIMARY}}"/>
</svg>`,

  /** API 网关 */
  api: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <polygon points="32,4 60,18 60,46 32,60 4,46 4,18" fill="{{PRIMARY}}" stroke="{{SECONDARY}}" stroke-width="2"/>
  <text x="32" y="38" text-anchor="middle" fill="white" font-size="16" font-weight="bold" font-family="monospace">API</text>
</svg>`,

  /** 短期记忆 */
  memoryShort: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="8" y="20" width="48" height="32" rx="4" fill="{{PRIMARY}}" stroke="{{SECONDARY}}" stroke-width="2" stroke-dasharray="6 3"/>
  <rect x="20" y="10" width="24" height="12" rx="3" fill="{{SECONDARY}}"/>
  <rect x="16" y="30" width="32" height="4" rx="2" fill="white" opacity="0.5"/>
  <rect x="16" y="38" width="20" height="4" rx="2" fill="white" opacity="0.3"/>
</svg>`,

  /** 长期记忆 / 知识库 */
  memoryLong: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <ellipse cx="32" cy="14" rx="20" ry="8" fill="{{PRIMARY}}"/>
  <path d="M12 14 L12 50 Q12 58 32 58 Q52 58 52 50 L52 14" fill="{{PRIMARY}}"/>
  <ellipse cx="32" cy="14" rx="20" ry="8" fill="none" stroke="{{SECONDARY}}" stroke-width="1.5"/>
  <path d="M12 30 Q12 38 32 38 Q52 38 52 30" fill="none" stroke="white" stroke-opacity="0.4" stroke-width="1.5"/>
  <ellipse cx="32" cy="30" rx="20" ry="8" fill="none" stroke="white" stroke-opacity="0.4" stroke-width="1.5"/>
  <ellipse cx="32" cy="46" rx="20" ry="8" fill="none" stroke="white" stroke-opacity="0.25" stroke-width="1"/>
  <rect x="16" y="38" width="32" height="3" rx="1" fill="white" opacity="0.3"/>
</svg>`,

  /** 向量数据库 / Embedding Store */
  vectorStore: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="4" y="4" width="56" height="56" rx="6" fill="{{PRIMARY}}" stroke="{{SECONDARY}}" stroke-width="2"/>
  <line x1="4" y1="22" x2="60" y2="22" stroke="white" stroke-opacity="0.3" stroke-width="1.5"/>
  <line x1="4" y1="42" x2="60" y2="42" stroke="white" stroke-opacity="0.3" stroke-width="1.5"/>
  <line x1="22" y1="4" x2="22" y2="60" stroke="white" stroke-opacity="0.3" stroke-width="1.5"/>
  <line x1="42" y1="4" x2="42" y2="60" stroke="white" stroke-opacity="0.3" stroke-width="1.5"/>
  <circle cx="33" cy="33" r="5" fill="white" opacity="0.8"/>
  <circle cx="22" cy="12" r="3" fill="white" opacity="0.5"/>
  <circle cx="50" cy="50" r="3" fill="white" opacity="0.5"/>
  <line x1="28" y1="28" x2="12" y2="12" stroke="white" stroke-opacity="0.4" stroke-width="1" stroke-dasharray="2 2"/>
  <line x1="38" y1="38" x2="50" y2="50" stroke="white" stroke-opacity="0.4" stroke-width="1" stroke-dasharray="2 2"/>
</svg>`,

  /** 浏览器 / Web */
  browser: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="4" y="4" width="56" height="56" rx="6" fill="{{PRIMARY}}" stroke="{{SECONDARY}}" stroke-width="2"/>
  <rect x="4" y="4" width="56" height="14" rx="6" fill="{{SECONDARY}}"/>
  <circle cx="14" cy="11" r="3" fill="#ef4444"/>
  <circle cx="24" cy="11" r="3" fill="#f59e0b"/>
  <circle cx="34" cy="11" r="3" fill="#22c55e"/>
  <rect x="10" y="26" width="44" height="26" rx="2" fill="white" opacity="0.15"/>
  <line x1="10" y1="34" x2="54" y2="34" stroke="white" stroke-opacity="0.3" stroke-width="1.5"/>
  <line x1="10" y1="42" x2="54" y2="42" stroke="white" stroke-opacity="0.3" stroke-width="1.5"/>
</svg>`,

  /** 云服务 */
  cloud: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <path d="M16 44 Q4 44 4 32 Q4 20 16 20 Q18 6 32 6 Q46 6 48 20 Q60 20 60 32 Q60 44 48 44 Z" fill="{{PRIMARY}}" stroke="{{SECONDARY}}" stroke-width="2"/>
  <circle cx="22" cy="32" r="3" fill="white" opacity="0.8"/>
  <circle cx="32" cy="27" r="3" fill="white" opacity="0.8"/>
  <circle cx="42" cy="32" r="3" fill="white" opacity="0.8"/>
</svg>`,

  /** 函数 / Function */
  fn: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="8" y="12" width="48" height="40" rx="6" fill="{{PRIMARY}}" stroke="{{SECONDARY}}" stroke-width="2"/>
  <text x="32" y="37" text-anchor="middle" fill="white" font-size="13" font-family="monospace" font-weight="bold">fn()</text>
</svg>`,

  /** 用户 / 人物 */
  user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="20" r="12" fill="{{PRIMARY}}"/>
  <path d="M8 60 Q8 40 32 40 Q56 40 56 60" fill="{{PRIMARY}}"/>
  <circle cx="32" cy="20" r="12" fill="none" stroke="{{SECONDARY}}" stroke-width="2"/>
  <path d="M8 60 Q8 40 32 40 Q56 40 56 60" fill="none" stroke="{{SECONDARY}}" stroke-width="2"/>
</svg>`,

  /** 文档 */
  document: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <path d="M8 4 L44 4 L56 16 L56 60 L8 60 Z" fill="{{PRIMARY}}" stroke="{{SECONDARY}}" stroke-width="2"/>
  <path d="M44 4 L44 16 L56 16" fill="{{SECONDARY}}" stroke="{{SECONDARY}}" stroke-width="1"/>
  <line x1="16" y1="24" x2="48" y2="24" stroke="white" stroke-opacity="0.5" stroke-width="2"/>
  <line x1="16" y1="34" x2="48" y2="34" stroke="white" stroke-opacity="0.5" stroke-width="2"/>
  <line x1="16" y1="44" x2="32" y2="44" stroke="white" stroke-opacity="0.5" stroke-width="2"/>
</svg>`,

  /** 队列 / Message Queue */
  queue: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <polygon points="8,12 56,12 56,52 8,52" fill="{{PRIMARY}}" stroke="{{SECONDARY}}" stroke-width="2"/>
  <line x1="20" y1="4" x2="20" y2="60" stroke="{{SECONDARY}}" stroke-width="2" stroke-dasharray="4 4"/>
  <rect x="28" y="16" width="24" height="6" rx="2" fill="white" opacity="0.5"/>
  <rect x="28" y="28" width="24" height="6" rx="2" fill="white" opacity="0.4"/>
  <rect x="28" y="40" width="24" height="6" rx="2" fill="white" opacity="0.3"/>
  <path d="M4 26 L20 26" stroke="{{PRIMARY}}" stroke-width="3" marker-end="url(#arr)"/>
</svg>`,

  /** 反馈 / Response */
  response: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="4" y="4" width="56" height="56" rx="8" fill="{{PRIMARY}}" stroke="{{SECONDARY}}" stroke-width="2"/>
  <path d="M20 20 L44 20 M20 32 L44 32 M20 44 L36 44" stroke="white" stroke-width="3" stroke-linecap="round"/>
  <circle cx="48" cy="44" r="10" fill="white" opacity="0.2"/>
  <path d="M44 44 L48 48 L54 38" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  /** 检索 / Search */
  search: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="28" cy="28" r="18" fill="none" stroke="{{PRIMARY}}" stroke-width="5"/>
  <line x1="42" y1="42" x2="58" y2="58" stroke="{{PRIMARY}}" stroke-width="5" stroke-linecap="round"/>
  <circle cx="28" cy="28" r="8" fill="white" opacity="0.2"/>
</svg>`,

  /** 评估 / Evaluation */
  evaluation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="4" y="20" width="56" height="36" rx="6" fill="{{PRIMARY}}" stroke="{{SECONDARY}}" stroke-width="2"/>
  <rect x="10" y="28" width="20" height="4" rx="2" fill="white" opacity="0.5"/>
  <rect x="10" y="36" width="44" height="4" rx="2" fill="white" opacity="0.3"/>
  <rect x="10" y="44" width="32" height="4" rx="2" fill="white" opacity="0.3"/>
  <circle cx="48" cy="30" r="10" fill="white" opacity="0.2"/>
  <path d="M44 30 L47 33 L52 27" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  /** 嵌入 / Embedding */
  embedding: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="4" y="4" width="24" height="56" rx="4" fill="{{PRIMARY}}" stroke="{{SECONDARY}}" stroke-width="2"/>
  <rect x="36" y="4" width="24" height="56" rx="4" fill="{{SECONDARY}}" stroke="{{PRIMARY}}" stroke-width="2" opacity="0.6"/>
  <line x1="28" y1="10" x2="36" y2="10" stroke="white" stroke-opacity="0.6" stroke-width="1.5"/>
  <line x1="28" y1="18" x2="36" y2="18" stroke="white" stroke-opacity="0.6" stroke-width="1.5"/>
  <line x1="28" y1="26" x2="36" y2="26" stroke="white" stroke-opacity="0.6" stroke-width="1.5"/>
  <line x1="28" y1="34" x2="36" y2="34" stroke="white" stroke-opacity="0.6" stroke-width="1.5"/>
  <line x1="28" y1="42" x2="36" y2="42" stroke="white" stroke-opacity="0.6" stroke-width="1.5"/>
  <line x1="28" y1="50" x2="36" y2="50" stroke="white" stroke-opacity="0.6" stroke-width="1.5"/>
  <path d="M32 20 L40 20" stroke="white" stroke-width="2" stroke-dasharray="3 2" marker-end="url(#arr)"/>
</svg>`,

  /** RAG 管道 */
  rag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="4" y="4" width="56" height="56" rx="6" fill="{{PRIMARY}}" stroke="{{SECONDARY}}" stroke-width="2"/>
  <circle cx="32" cy="20" r="8" fill="white" opacity="0.3"/>
  <rect x="14" y="36" width="36" height="6" rx="2" fill="white" opacity="0.3"/>
  <rect x="14" y="46" width="20" height="6" rx="2" fill="white" opacity="0.2"/>
  <line x1="32" y1="28" x2="32" y2="36" stroke="white" stroke-width="1.5" stroke-dasharray="3 2"/>
  <line x1="22" y1="42" x2="22" y2="46" stroke="white" stroke-width="1" stroke-dasharray="2 2"/>
</svg>`,
} as const;

/** 图标名称类型 */
export type IconName = keyof typeof ICON_TEMPLATES;

/** 所有图标名称列表 */
export const ICON_NAMES = Object.keys(ICON_TEMPLATES) as IconName[];
