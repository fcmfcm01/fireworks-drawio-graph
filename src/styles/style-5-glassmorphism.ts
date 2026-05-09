/**
 * Style 5: Glassmorphism
 *
 * Frosted glass cards on dark gradient. Designed for product sites, keynotes.
 * Best for: Product sites, keynotes, hero sections.
 */

import type { StyleTheme } from './index.js';

export const style5Glassmorphism: StyleTheme = {
  number: 5,
  name: 'Glassmorphism',
  background: '#0d1117',
  fillColor: '#161b22',
  strokeColor: '#30363d',
  textPrimary: '#f0f6fc',
  textSecondary: '#8b949e',
  textMuted: '#484f58',
  fontSize: 14,
  borderRadius: 12,
  arrowColors: {
    primary: '#58a6ff',
    control: '#f78166',
    memoryRead: '#3fb950',
    memoryWrite: '#3fb950',
    async: '#8b949e',
    embedding: '#bc8cff',
    feedback: '#bc8cff',
  },
  accents: {
    blue: '#0d1b2a',
    green: '#0d1f0d',
    orange: '#2d1600',
    purple: '#1a0d2e',
    red: '#2d0000',
    teal: '#002d24',
  },
  useShadow: true,
  isDark: true,
};
