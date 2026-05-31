export type Rect = { x: number; y: number; w: number; h: number };

export class LayoutEngine {
  titleRect(index: number): Rect {
    return { x: 0.55, y: index === 0 ? 0.65 : 0.45, w: 8.9, h: 0.6 };
  }

  contentRect(row: number): Rect {
    return { x: 0.75, y: 1.25 + row * 0.42, w: 8.5, h: 0.3 };
  }
}
