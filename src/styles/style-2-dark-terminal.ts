/**
 * Style 2: Dark Terminal
 *
 * Neon-on-dark hacker aesthetic. Matches CLAUDE.md standard tech diagram style.
 * Best for: GitHub, dev articles, terminal-style docs.
 */

import type { StyleTheme } from './index.js';

export const style2DarkTerminal: StyleTheme = {
  number: 2,
  name: 'Dark Terminal',
  background: '#0f0f1a',
  fillColor: '#0f172a',
  strokeColor: '#334155',
  textPrimary: '#e2e8f0',
  textSecondary: '#94a3b8',
  textMuted: '#475569',
  fontSize: 13,
  borderRadius: 6,
  arrowColors: {
    primary: '#3b82f6',
    control: '#f97316',
    memoryRead: '#10b981',
    memoryWrite: '#10b981',
    async: '#6b7280',
    embedding: '#a855f7',
    feedback: '#a855f7',
  },
  accents: {
    blue: '#1e3a5f',
    green: '#052e16',
    orange: '#1c1917',
    purple: '#1e1b4b',
    red: '#450a0a',
    teal: '#042f2e',
  },
  useShadow: false,
  isDark: true,
};
