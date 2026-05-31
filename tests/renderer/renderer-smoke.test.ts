import { mkdtemp, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { DeckSpecSchema } from '../../src/schema/deck.schema.js';
import { PptxRenderer } from '../../src/renderer/PptxRenderer.js';

describe('pptx renderer', () => {
  it('可以为基础 deck 示例生成 PPTX', async () => {
    const raw = parse(readFileSync('examples/decks/basic.deck.yaml', 'utf8'));
    const spec = DeckSpecSchema.parse(raw);
    const dir = await mkdtemp(join(tmpdir(), 'ppt-lord-'));
    const out = join(dir, 'basic.pptx');
    const result = await new PptxRenderer().renderDeck(spec, { out });

    expect(result.warnings).toBeDefined();
    expect((await stat(out)).isFile()).toBe(true);
  });
});
