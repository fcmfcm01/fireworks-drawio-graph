/**
 * Style 3: Blueprint
 *
 * Engineering blueprint aesthetic with grid background and technical annotation style.
 * Best for: Architecture docs, technical specifications.
 */

import type { StyleTheme } from './index.js';

export const style3Blueprint: StyleTheme = {
  number: 3,
  name: 'Blueprint',
  background: '#0a1628',
  fillColor: 'none',
  strokeColor: '#4fc3f7',
  textPrimary: '#caf0f8',
  textSecondary: '#90e0ef',
  textMuted: '#48cae4',
  fontSize: 13,
  borderRadius: 2,
  arrowColors: {
    primary: '#00b4d8',
    control: '#f77f00',
    memoryRead: '#06d6a0',
    memoryWrite: '#06d6a0',
    async: '#48cae4',
    embedding: '#90e0ef',
    feedback: '#90e0ef',
  },
  accents: {
    blue: '#0d1f3c',
    green: '#0d2818',
    orange: '#2d1b00',
    purple: '#1a1040',
    red: '#3d0000',
    teal: '#003d33',
  },
  useShadow: false,
  isDark: true,
};
