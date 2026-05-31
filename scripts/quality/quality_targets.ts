export const qualityTargets = [
  'foundation',
  'schema',
  'component-registry',
  'renderer',
  'template-pack',
  'visual-harness',
  'hook-runtime',
  'harness'
] as const;

export type QualityTarget = (typeof qualityTargets)[number];

export function isQualityTarget(value: string): value is QualityTarget {
  return qualityTargets.includes(value as QualityTarget);
}
