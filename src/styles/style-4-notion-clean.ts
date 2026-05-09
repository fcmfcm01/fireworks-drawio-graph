/**
 * Style 4: Notion Clean
 *
 * Minimal, documentation-friendly. Designed to embed in Notion, Confluence, or GitHub wikis.
 * Best for: Notion pages, documentation, wiki embeds.
 */

import type { StyleTheme } from './index.js';

export const style4NotionClean: StyleTheme = {
  number: 4,
  name: 'Notion Clean',
  background: '#ffffff',
  fillColor: '#f9fafb',
  strokeColor: '#e5e7eb',
  textPrimary: '#111827',
  textSecondary: '#374151',
  textMuted: '#9ca3af',
  fontSize: 14,
  borderRadius: 4,
  arrowColors: {
    primary: '#3b82f6',
    control: '#3b82f6',
    memoryRead: '#3b82f6',
    memoryWrite: '#3b82f6',
    async: '#d1d5db',
    embedding: '#3b82f6',
    feedback: '#3b82f6',
  },
  accents: {
    blue: '#eff6ff',
    green: '#f0fdf4',
    orange: '#fff7ed',
    purple: '#faf5ff',
    red: '#fef2f2',
    teal: '#f0fdfa',
  },
  useShadow: false,
  isDark: false,
};
