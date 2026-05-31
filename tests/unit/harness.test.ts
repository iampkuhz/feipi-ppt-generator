import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { validateHarnessStructure } from '../../scripts/harness/validate_harness_structure.js';
import { validateLanguagePolicy } from '../../scripts/harness/validate_language_policy.js';
import { validateOpenSpecLayout } from '../../scripts/harness/validate_openspec_layout.js';
import { validateRepoStructure } from '../../scripts/harness/validate_repo_structure.js';

describe('harness 治理检查', () => {
  it('manifest 包含 quality targets', () => {
    const manifest = parse(readFileSync('harness/manifest.yaml', 'utf8'));
    expect(manifest.quality.targets).toContain('harness');
    expect(manifest.runtime.log_dir).toBe('tmp/agent_logs/');
  });

  it('关键结构检查通过', async () => {
    const repo = await validateRepoStructure();
    expect(repo.filter((item) => !item.ok)).toEqual([]);
    await expect(validateOpenSpecLayout()).resolves.toEqual([]);
    await expect(validateHarnessStructure()).resolves.toEqual([]);
  });

  it('中文规约快速检查通过', async () => {
    await expect(validateLanguagePolicy()).resolves.toEqual([]);
  });
});
