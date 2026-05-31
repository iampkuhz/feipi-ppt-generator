import { writeFile, mkdir } from 'node:fs/promises';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { DeckSpecSchema } from '../src/schema/deck.schema.js';

await mkdir('dist/schema', { recursive: true });
await writeFile(
  'dist/schema/deck.schema.json',
  `${JSON.stringify(zodToJsonSchema(DeckSpecSchema), null, 2)}\n`
);
console.log('Generated dist/schema/deck.schema.json');
