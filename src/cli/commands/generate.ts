import { Command } from 'commander';
import { DeckSpecSchema } from '../../schema/deck.schema.js';
import { PptxRenderer } from '../../renderer/PptxRenderer.js';
import { loadDeckSpec } from './validate.js';

export function generateCommand(): Command {
  return new Command('generate')
    .description('根据 deck spec 生成 PPTX')
    .argument('<deck-spec>', 'deck YAML 或 JSON 路径')
    .requiredOption('--out <path>', '输出 PPTX 路径')
    .action(async (deckSpecPath: string, options: { out: string }) => {
      const raw = await loadDeckSpec(deckSpecPath);
      const spec = DeckSpecSchema.parse(raw);
      const renderer = new PptxRenderer();
      const result = await renderer.renderDeck(spec, { out: options.out });
      console.log(`PASS 已生成 ${result.pptxPath}`);
      if (result.warnings.length > 0) {
        console.warn(JSON.stringify(result.warnings, null, 2));
      }
    });
}
