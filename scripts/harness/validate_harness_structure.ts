import { access } from 'node:fs/promises';

const requiredPaths = [
  'harness/README.md',
  'harness/manifest.yaml',
  'harness/context/README.md',
  'harness/context/foundation-context.md',
  'harness/context/renderer-context.md',
  'harness/context/component-context.md',
  'harness/context/template-pack-context.md',
  'harness/context/quality-context.md',
  'harness/context/openspec-context.md',
  'harness/context/agent-runtime-context.md',
  'harness/governance/protected-paths.md',
  'harness/governance/language-policy.md',
  'harness/governance/local-only-policy.md',
  'harness/governance/agent-delegation-policy.md',
  'harness/quality/deterministic-quality-gate.md',
  'harness/quality/quality-gate-matrix.md',
  'harness/quality/visual-regression-contract.md',
  'harness/quality/pptx-inspection-contract.md',
  'harness/quality/schema-contract.md',
  'harness/workflow/hook-runtime-lifecycle.md',
  'harness/workflow/openspec-change-lifecycle.md',
  'harness/workflow/subagent-execution.md',
  'harness/workflow/release-lifecycle.md'
];

export async function validateHarnessStructure(): Promise<string[]> {
  const errors: string[] = [];
  for (const path of requiredPaths) {
    try {
      await access(path);
    } catch {
      errors.push(`缺少 harness 路径：${path}`);
    }
  }
  return errors;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const errors = await validateHarnessStructure();
  if (errors.length > 0) {
    for (const error of errors) console.error(`FAIL ${error}`);
    process.exitCode = 1;
  } else {
    console.log('PASS harness 目录结构有效');
  }
}
