import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { QualityTarget } from './quality_targets.js';

export type GateStatus = 'PASS' | 'FAIL' | 'BLOCKED' | 'SKIPPED';

export type QualitySummary = {
  schemaVersion: 1;
  status: 'PASS' | 'FAIL' | 'BLOCKED';
  target: QualityTarget;
  changeId: string;
  startedAt: string;
  finishedAt: string;
  requiredGates: Record<string, GateStatus>;
  blockingFailures: string[];
  warnings: string[];
  artifacts: Record<string, string>;
  gateDetails: Array<{ name: string; status: GateStatus; message: string; fix?: string }>;
};

export async function writeQualitySummary(summary: QualitySummary): Promise<string> {
  const dir = join('tmp/quality', summary.changeId);
  await mkdir(dir, { recursive: true });
  const path = join(dir, `quality-gate-summary.${summary.target}.json`);
  await writeFile(path, `${JSON.stringify(summary, null, 2)}\n`);
  return path;
}
