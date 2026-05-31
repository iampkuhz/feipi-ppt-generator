import type { LayoutContext } from './layout-context.js';

export type LayoutRect = { x: number; y: number; w: number; h: number };

export function defaultContentRect(context: LayoutContext): LayoutRect {
  return { x: 0.55, y: 0.8, w: context.slideWidthInch - 1.1, h: context.slideHeightInch - 1.35 };
}
