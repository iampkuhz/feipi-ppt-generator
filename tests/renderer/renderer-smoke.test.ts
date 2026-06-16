import { mkdtemp, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { DeckSpecSchema } from '../../src/schema/deck.schema.js';
import { inspectPptx } from '../../src/harness/inspect-pptx.js';
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

  it('可以生成原子组件样例并检查 PPTX 文本结构', async () => {
    const raw = parse(readFileSync('examples/decks/atom-components.deck.yaml', 'utf8'));
    const spec = DeckSpecSchema.parse(raw);
    const dir = await mkdtemp(join(tmpdir(), 'ppt-lord-atoms-'));
    const out = join(dir, 'atoms.pptx');
    const result = await new PptxRenderer().renderDeck(spec, { out });
    const inspection = await inspectPptx(out);

    expect(result.warnings.filter((item) => item.code === 'renderer.stub_component')).toHaveLength(0);
    expect(inspection.slideCount).toBe(spec.slides.length);
    expect(inspection.texts.join('\n')).toContain('PageTitle sample');
    expect(inspection.texts.join('\n')).toContain('Example card');
  });
});
