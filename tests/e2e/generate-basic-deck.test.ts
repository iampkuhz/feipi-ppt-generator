import { mkdtemp, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { describe, expect, it } from 'vitest';

describe('generate 基础 deck 命令', () => {
  it('第一版 CLI 可以生成基础 PPTX', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'ppt-lord-e2e-'));
    const out = join(dir, 'basic.pptx');
    await new Promise<void>((resolve, reject) => {
      const child = spawn('pnpm', [
        'exec',
        'tsx',
        'src/cli/index.ts',
        'generate',
        'examples/decks/basic.deck.yaml',
        '--out',
        out
      ]);
      child.on('exit', (code: number | null) =>
        code === 0 ? resolve() : reject(new Error(`exit ${code}`))
      );
      child.on('error', reject);
    });
    expect((await stat(out)).isFile()).toBe(true);
  });
});
