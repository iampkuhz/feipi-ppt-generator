import type { LayoutRect } from './layout-engine.js';

export function anchorTop(rect: LayoutRect, height: number): LayoutRect {
  return { ...rect, h: height };
}
