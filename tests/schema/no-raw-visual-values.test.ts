import { describe, expect, it } from 'vitest';
import { DeckSpecSchema } from '../../src/schema/deck.schema.js';
import { lintDeckTokens } from '../../src/harness/token-lint.js';

describe('raw 视觉值检查', () => {
  it('发现 raw hex 时返回警告', () => {
    const deck = DeckSpecSchema.parse({
      id: 'raw-check',
      slides: [
        {
          id: 'slide-001',
          type: 'CoverSlide',
          components: [{ type: 'PageTitle', props: { text: '标题', color: '#123456' } }]
        }
      ]
    });
    expect(lintDeckTokens(deck).warnings.some((item) => item.code === 'raw_hex')).toBe(true);
  });
});
