import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { DeckSpecSchema } from '../../src/schema/deck.schema.js';

describe('deck schema', () => {
  it('接受基础 deck 示例', () => {
    const raw = parse(readFileSync('examples/decks/basic.deck.yaml', 'utf8'));
    expect(() => DeckSpecSchema.parse(raw)).not.toThrow();
  });

  it('拒绝缺失 id', () => {
    expect(() => DeckSpecSchema.parse({ slides: [] })).toThrow();
  });

  it('拒绝未知尺寸', () => {
    expect(() => DeckSpecSchema.parse({ id: 'bad', size: 'square', slides: [] })).toThrow();
  });
});
