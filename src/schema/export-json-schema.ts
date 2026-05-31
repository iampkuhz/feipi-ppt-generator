import { zodToJsonSchema } from 'zod-to-json-schema';
import { DeckSpecSchema } from './deck.schema.js';

export function exportDeckJsonSchema(): unknown {
  return zodToJsonSchema(DeckSpecSchema, 'DeckSpec');
}
