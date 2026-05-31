import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { DeckSpecSchema } from '../../src/schema/deck.schema.js';
import { lintDeckTokens } from '../../src/harness/token-lint.js';

const path = process.argv[2] ?? 'examples/decks/basic.deck.yaml';
const raw = parse(await readFile(path, 'utf8'));
const spec = DeckSpecSchema.parse(raw);
const result = lintDeckTokens(spec);
if (result.warnings.length > 0) {
  for (const warning of result.warnings) console.error(`FAIL ${warning.message}`);
  process.exitCode = 1;
} else {
  console.log('PASS 未发现 raw 视觉值');
}
