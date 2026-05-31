import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { DeckSpecSchema } from '../../src/schema/deck.schema.js';

describe('deck schema', () => {
  it('accepts the basic deck example', () => {
    const raw = parse(readFileSync('examples/decks/basic.deck.yaml', 'utf8'));
    expect(() => DeckSpecSchema.parse(raw)).not.toThrow();
  });

  it('rejects a missing id', () => {
    expect(() => DeckSpecSchema.parse({ slides: [] })).toThrow();
  });

  it('rejects an unknown size', () => {
    expect(() => DeckSpecSchema.parse({ id: 'bad', size: 'square', slides: [] })).toThrow();
  });
});
