import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { DeckSpecSchema } from '../../src/schema/deck.schema.js';

const paths = process.argv.slice(2);
const targets = paths.length > 0 ? paths : ['examples/decks/basic.deck.yaml'];
const errors: string[] = [];

for (const path of targets) {
  try {
    const raw = parse(await readFile(path, 'utf8'));
    DeckSpecSchema.parse(raw);
  } catch (error) {
    errors.push(`${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`FAIL ${error}`);
  process.exitCode = 1;
} else {
  console.log(`PASS schema 示例检查通过：${targets.join(', ')}`);
}
