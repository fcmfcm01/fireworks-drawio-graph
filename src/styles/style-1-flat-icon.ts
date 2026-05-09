/**
 * Style 1: Flat Icon (Default)
 *
 * Inspired by draw.io defaults and Apple documentation style.
 * White background, flat colors, clean lines.
 * Best for: Blogs, docs, presentations.
 */

import type { StyleTheme } from './index.js';

export const style1FlatIcon: StyleTheme = {
  number: 1,
  name: 'Flat Icon',
  background: '#ffffff',
  fillColor: '#ffffff',
  strokeColor: '#d1d5db',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  fontSize: 14,
  borderRadius: 8,
  arrowColors: {
    primary: '#2563eb',
    control: '#ea580c',
    memoryRead: '#059669',
    memoryWrite: '#059669',
    async: '#6b7280',
    embedding: '#7c3aed',
    feedback: '#7c3aed',
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
