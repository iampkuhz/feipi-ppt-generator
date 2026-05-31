import { runQualityGate } from './run_quality_gate.js';
import { writeQualitySummary } from './quality_artifact.js';

const target = process.argv[2] ?? 'harness';
const changeId = process.argv[3] ?? 'local';
const summary = await runQualityGate({ target, changeId });
const path = await writeQualitySummary(summary);
console.log(`${summary.status} required quality gates 已写入 ${path}`);
if (summary.status !== 'PASS') process.exitCode = 1;
