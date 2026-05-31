export function estimateTextWidth(text: string, fontSizePt: number): number {
  return text.length * fontSizePt * 0.006;
}
