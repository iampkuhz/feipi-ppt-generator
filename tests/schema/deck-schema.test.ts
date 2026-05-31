import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { DeckSpecSchema } from '../../src/schema/deck.schema.js';

describe('deck schema 示例', () => {
  it('基础示例可以通过 schema 校验', () => {
    const raw = parse(readFileSync('examples/decks/basic.deck.yaml', 'utf8'));
    expect(() => DeckSpecSchema.parse(raw)).not.toThrow();
  });
});
