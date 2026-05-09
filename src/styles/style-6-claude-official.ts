/**
 * Style 6: Claude Official
 *
 * Inspired by Anthropic's Claude blog technical diagrams — warm, approachable, professional.
 * Best for: Anthropic-style diagrams, warm-tone presentations.
 */

import type { StyleTheme } from './index.js';

export const style6ClaudeOfficial: StyleTheme = {
  number: 6,
  name: 'Claude Official',
  background: '#f8f6f3',
  fillColor: '#FFF8F0',
  strokeColor: '#D97757',
  textPrimary: '#1a1a1a',
  textSecondary: '#6a6a6a',
  textMuted: '#9a9a9a',
  fontSize: 14,
  borderRadius: 12,
  arrowColors: {
    primary: '#5a5a5a',
    control: '#D97757',
    memoryRead: '#9dd4c7',
    memoryWrite: '#9dd4c7',
    async: '#9a9a9a',
    embedding: '#a8c5e6',
    feedback: '#a8c5e6',
  },
  accents: {
    blue: '#a8c5e6',
    green: '#9dd4c7',
    orange: '#f4e4c1',
    purple: '#d4c5e6',
    red: '#e6b5b5',
    teal: '#b5d4d4',
  },
  useShadow: false,
  isDark: false,
};
