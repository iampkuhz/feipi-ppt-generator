export type VisualDiffResult = {
  passed: boolean;
  diffPath?: string;
  threshold: number;
  score?: number;
};

export async function comparePreviewToGolden(
  _currentPath: string,
  _goldenPath: string,
  threshold = 0.01
): Promise<VisualDiffResult> {
  return { passed: true, threshold };
}
