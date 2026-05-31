import { describe, expect, it } from 'vitest';
import { defaultFoundation } from '../../src/foundation/default.foundation.js';
import { defaultIconRegistry } from '../../src/foundation/default.icons.js';

describe('默认 foundation', () => {
  it('包含必需 alias 分组', () => {
    expect(Object.keys(defaultFoundation.typography)).toContain('pageTitle');
    expect(Object.keys(defaultFoundation.typography)).toContain('heroTitle');
    expect(Object.keys(defaultFoundation.colors)).toContain('copyNavy');
    expect(Object.keys(defaultFoundation.spacing)).toContain('safeMargin');
    expect(Object.keys(defaultFoundation.radius)).toContain('mdRadius');
    expect(Object.keys(defaultFoundation.colors)).toContain('brandViolet');
    expect(defaultIconRegistry.length).toBeGreaterThan(0);
  });

  it('不存在空 alias 分组', () => {
    for (const [key, value] of Object.entries(defaultFoundation)) {
      if (key === 'id') continue;
      expect(Object.keys(value as Record<string, unknown>).length, key).toBeGreaterThan(0);
    }
  });

  it('不包含 30pt 字号', () => {
    const pts = Object.values(defaultFoundation.typography).map((t) => t.pt);
    expect(pts).not.toContain(30);
  });

  it('radius alias 不超过 5 个', () => {
    expect(Object.keys(defaultFoundation.radius).length).toBeLessThanOrEqual(5);
  });

  it('不包含 bleedMargin', () => {
    expect(Object.keys(defaultFoundation.spacing)).not.toContain('bleedMargin');
  });
});
