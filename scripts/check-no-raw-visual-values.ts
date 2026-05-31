import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { DeckSpecSchema } from '../src/schema/deck.schema.js';
import { lintDeckTokens } from '../src/harness/token-lint.js';

const target = process.argv[2] ?? 'examples/decks/basic.deck.yaml';
const raw = parse(await readFile(target, 'utf8'));
const spec = DeckSpecSchema.parse(raw);
const result = lintDeckTokens(spec);

if (result.warnings.length > 0) {
  console.error(result.warnings.map((item) => item.message).join('\n'));
  process.exit(1);
}

console.log(`No raw visual values found in ${target}`);
