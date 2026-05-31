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
  'openspec/config.yaml',
  'openspec/schemas/ppt-change/schema.yaml',
  'harness/manifest.yaml',
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
