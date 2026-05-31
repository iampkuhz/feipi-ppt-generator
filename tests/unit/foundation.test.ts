import { describe, expect, it } from 'vitest';
import { defaultFoundation } from '../../src/foundation/default.foundation.js';
import { defaultIconRegistry } from '../../src/foundation/default.icons.js';

describe('default foundation', () => {
  it('contains required alias groups', () => {
    expect(Object.keys(defaultFoundation.typography)).toContain('title');
    expect(Object.keys(defaultFoundation.colors)).toContain('inkPrimary');
    expect(Object.keys(defaultFoundation.spacing)).toContain('marginDefault');
    expect(Object.keys(defaultFoundation.radius)).toContain('md');
    expect(defaultIconRegistry.length).toBeGreaterThan(0);
  });

  it('does not contain empty alias groups', () => {
    for (const [key, value] of Object.entries(defaultFoundation)) {
      if (key === 'id') continue;
      expect(Object.keys(value as Record<string, unknown>).length, key).toBeGreaterThan(0);
    }
  });
});
