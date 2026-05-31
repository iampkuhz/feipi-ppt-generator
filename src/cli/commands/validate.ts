import { readFile } from 'node:fs/promises';
import { Command } from 'commander';
import { parse } from 'yaml';
import { DeckSpecSchema } from '../../schema/deck.schema.js';
import { defaultComponentRegistry } from '../../registry/component-registry.js';
import { lintDeckTokens } from '../../harness/token-lint.js';

export async function loadDeckSpec(path: string): Promise<unknown> {
  const source = await readFile(path, 'utf8');
  return parse(source);
}

export function validateCommand(): Command {
  return new Command('validate')
    .description('校验 deck spec 的 schema、registry 和 token 规则')
    .argument('<deck-spec>', 'deck YAML 或 JSON 路径')
    .action(async (deckSpecPath: string) => {
      const raw = await loadDeckSpec(deckSpecPath);
      const spec = DeckSpecSchema.parse(raw);
      for (const slide of spec.slides) {
        for (const component of slide.components) {
          defaultComponentRegistry.validate(component);
        }
      }
      const lintResult = lintDeckTokens(spec);
      if (lintResult.warnings.length > 0) {
        throw new Error(lintResult.warnings.map((item) => item.message).join('\n'));
      }
      console.log(`PASS 已校验 ${deckSpecPath}`);
    });
}
