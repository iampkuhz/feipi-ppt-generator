import { describe, expect, it } from 'vitest';
import { runQualityGate } from '../../scripts/quality/run_quality_gate.js';

describe('quality summary', () => {
  it('harness target 输出确定性状态', async () => {
    const summary = await runQualityGate({ target: 'harness', changeId: 'test' });
    expect(['PASS', 'FAIL', 'BLOCKED']).toContain(summary.status);
    expect(JSON.stringify(summary)).not.toMatch(/qualityScore|rating|score/);
    expect(summary.requiredGates).toHaveProperty('repoStructure');
  });
});
