/**
 * Style 7: OpenAI Official
 *
 * Clean, modern aesthetic matching OpenAI's documentation and research diagrams.
 * Best for: OpenAI-style diagrams, research papers.
 */

import type { StyleTheme } from './index.js';

export const style7OpenAI: StyleTheme = {
  number: 7,
  name: 'OpenAI Official',
  background: '#ffffff',
  fillColor: '#F7F7F8',
  strokeColor: '#E5E5E5',
  textPrimary: '#0d0d0d',
  textSecondary: '#6e6e80',
  textMuted: '#acacbe',
  fontSize: 14,
  borderRadius: 8,
  arrowColors: {
    primary: '#1d4ed8',
    control: '#f97316',
    memoryRead: '#10a37f',
    memoryWrite: '#10a37f',
    async: '#71717a',
    embedding: '#71717a',
    feedback: '#71717a',
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
