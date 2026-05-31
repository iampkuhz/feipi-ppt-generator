import type { LayoutRect } from './layout-engine.js';

export function splitGrid(rect: LayoutRect, columns: number, rows: number): LayoutRect[] {
  const cells: LayoutRect[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      cells.push({
        x: rect.x + (rect.w / columns) * column,
        y: rect.y + (rect.h / rows) * row,
        w: rect.w / columns,
        h: rect.h / rows
      });
    }
  }
  return cells;
}
