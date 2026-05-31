import { access } from 'node:fs/promises';

export type StructureCheck = {
  path: string;
  ok: boolean;
  message: string;
};

export const requiredRepoPaths = [
  'README.md',
  'AGENTS.md',
  'CLAUDE.md',
  'VERSION',
  'package.json',
  'pnpm-workspace.yaml',
  'tsconfig.json',
  'vitest.config.ts',
  'eslint.config.js',
  'prettier.config.cjs',
  '.gitignore',
  '.dockerignore',
  'env/.env.example',
  'compose/docker-compose.yml',
  '.claude/settings.json',
  '.codex/hooks.json',
  '.github/workflows/ci.yml',
  '.github/CODEOWNERS',
  '.github/dependabot.yml',
  'openspec/config.yaml',
  'openspec/schemas/ppt-change/schema.yaml',
  'harness/manifest.yaml',
  'harness/agents/registry.yaml',
  'docs/acceptance/ACCEPTANCE_CHECK_MATRIX.md',
  'docs/acceptance/features/FOUNDATION.md',
  'docs/acceptance/features/COMPONENT_REGISTRY.md',
  'docs/acceptance/features/RENDERER.md',
  'docs/acceptance/features/TEMPLATE_PACK.md',
  'docs/acceptance/features/QUALITY_HARNESS.md',
  'docs/architecture/architecture-boundaries.md',
  'docs/architecture/generated-files.md',
  'docs/architecture/branch-protection.md',
  'scripts/harness/doctor.sh',
  'scripts/quality/run_quality_gate.ts',
  'src/cli/index.ts',
  'src/foundation/default.foundation.ts',
  'src/registry/component-registry.ts',
  'src/renderer/PptxRenderer.ts',
  'examples/decks/basic.deck.yaml',
  'assets/templates/default/manifest.yaml'
];

export async function validateRepoStructure(): Promise<StructureCheck[]> {
  return Promise.all(
    requiredRepoPaths.map(async (path) => {
      try {
        await access(path);
        return { path, ok: true, message: '存在' };
      } catch {
        return { path, ok: false, message: '缺失' };
      }
    })
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const checks = await validateRepoStructure();
  const failed = checks.filter((item) => !item.ok);
  for (const item of checks) {
    console.log(`${item.ok ? 'PASS' : 'FAIL'} ${item.path} ${item.message}`);
  }
  if (failed.length > 0) {
    console.error(`仓库结构检查失败：${failed.map((item) => item.path).join(', ')}`);
    process.exitCode = 1;
  }
}
