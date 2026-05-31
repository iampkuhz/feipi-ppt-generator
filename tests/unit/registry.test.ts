import { describe, expect, it } from 'vitest';
import {
  ComponentRegistry,
  createDefaultComponentRegistry,
  defaultComponentRegistry
} from '../../src/registry/component-registry.js';
import { z } from 'zod';

describe('component registry', () => {
  it('registers base components', () => {
    expect(defaultComponentRegistry.get('TextPrimitive').type).toBe('TextPrimitive');
    expect(defaultComponentRegistry.get('PageTitle').type).toBe('PageTitle');
    expect(defaultComponentRegistry.get('ChartCard').type).toBe('ChartCard');
  });

  it('rejects duplicate registration', () => {
    const registry = new ComponentRegistry();
    const entry = {
      type: 'Example',
      version: '0.1.0',
      layer: 'atom' as const,
      status: 'experimental' as const,
      propsSchema: z.object({}),
      examples: [],
      description: 'Example'
    };
    registry.register(entry);
    expect(() => registry.register(entry)).toThrow();
  });

  it('rejects unknown components', () => {
    const registry = createDefaultComponentRegistry();
    expect(() => registry.get('Missing')).toThrow();
  });
});
