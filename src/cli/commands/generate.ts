import { Command } from 'commander';
import { DeckSpecSchema } from '../../schema/deck.schema.js';
import { PptxRenderer } from '../../renderer/PptxRenderer.js';
import { loadDeckSpec } from './validate.js';

export function generateCommand(): Command {
  return new Command('generate')
    .description('Generate a PPTX from a deck spec')
    .argument('<deck-spec>', 'Path to deck YAML or JSON')
    .requiredOption('--out <path>', 'Output PPTX path')
    .action(async (deckSpecPath: string, options: { out: string }) => {
      const raw = await loadDeckSpec(deckSpecPath);
      const spec = DeckSpecSchema.parse(raw);
      const renderer = new PptxRenderer();
      const result = await renderer.renderDeck(spec, { out: options.out });
      console.log(`Generated ${result.pptxPath}`);
      if (result.warnings.length > 0) {
        console.warn(JSON.stringify(result.warnings, null, 2));
      }
    });
}
