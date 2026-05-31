import { describe, expect, it } from 'vitest';
import { DeckSpecSchema } from '../../src/schema/deck.schema.js';
import { lintDeckTokens } from '../../src/harness/token-lint.js';

function deckWithProps(props: Record<string, unknown>) {
  return DeckSpecSchema.parse({
    id: 'lint-test',
    slides: [
      { id: 'slide-001', type: 'TitleContentSlide', components: [{ type: 'PageTitle', props }] }
    ]
  });
}

describe('token lint', () => {
  it('拦截 raw hex', () => {
    const result = lintDeckTokens(deckWithProps({ text: 'Bad', color: '#123456' }));
    expect(result.warnings.some((item) => item.code === 'raw_hex')).toBe(true);
  });

  it('拦截 raw pt 数字', () => {
    const result = lintDeckTokens(deckWithProps({ text: 'Bad', pt: 19 }));
    expect(result.warnings.some((item) => item.code === 'raw_number')).toBe(true);
  });

  it('拦截 raw radius 数字', () => {
    const result = lintDeckTokens(deckWithProps({ text: 'Bad', radius: 13 }));
    expect(result.warnings.some((item) => item.code === 'raw_number')).toBe(true);
  });

  it('拦截未知 icon', () => {
    const spec = DeckSpecSchema.parse({
      id: 'lint-test',
      slides: [
        {
          id: 'slide-001',
          type: 'IconGridSlide',
          components: [{ type: 'IconLabel', props: { icon: 'icon.missing', label: 'Missing' } }]
        }
      ]
    });
    const result = lintDeckTokens(spec);
    expect(result.warnings.some((item) => item.code === 'unknown_icon')).toBe(true);
  });

  it('接受合法 alias', () => {
    const result = lintDeckTokens(
      deckWithProps({ text: 'Good', color: 'inkPrimary', size: 'title' })
    );
    expect(result.warnings).toHaveLength(0);
  });
});
