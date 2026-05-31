import { describe, expect, it } from 'vitest';
import { defaultFoundation } from '../../src/foundation/default.foundation.js';
import { defaultIconRegistry } from '../../src/foundation/default.icons.js';

describe('默认 foundation', () => {
  it('包含必需 alias 分组', () => {
    expect(Object.keys(defaultFoundation.typography)).toContain('title');
    expect(Object.keys(defaultFoundation.typography)).toContain('hero');
    expect(Object.keys(defaultFoundation.colors)).toContain('inkPrimary');
    expect(Object.keys(defaultFoundation.spacing)).toContain('marginDefault');
    expect(Object.keys(defaultFoundation.radius)).toContain('radiusMD');
    expect(Object.keys(defaultFoundation.iconSizes)).toContain('iconMD');
    expect(defaultIconRegistry.length).toBeGreaterThan(0);
  });

  it('不存在空 alias 分组', () => {
    for (const [key, value] of Object.entries(defaultFoundation)) {
      if (key === 'id') continue;
      expect(Object.keys(value as Record<string, unknown>).length, key).toBeGreaterThan(0);
    }
  });
});
