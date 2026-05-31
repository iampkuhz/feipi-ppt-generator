import { describe, expect, it } from 'vitest';
import {
  ComponentRegistry,
  createDefaultComponentRegistry,
  defaultComponentRegistry
} from '../../src/registry/component-registry.js';
import { z } from 'zod';

describe('component registry', () => {
  it('注册基础组件', () => {
    expect(defaultComponentRegistry.get('TextPrimitive').type).toBe('TextPrimitive');
    expect(defaultComponentRegistry.get('PageTitle').type).toBe('PageTitle');
    expect(defaultComponentRegistry.get('ChartCard').type).toBe('ChartCard');
  });

  it('拒绝重复注册', () => {
    const registry = new ComponentRegistry();
    const entry = {
      type: 'Example',
      version: '0.1.0',
      layer: 'atom' as const,
      status: 'experimental' as const,
      propsSchema: z.object({}),
      allowedVariants: [],
      allowedTokens: [],
      examples: [],
      visualFixtures: [],
      usageBoundary: '测试组件边界。',
      description: '测试组件。'
    };
    registry.register(entry);
    expect(() => registry.register(entry)).toThrow();
  });

  it('拒绝未知组件', () => {
    const registry = createDefaultComponentRegistry();
    expect(() => registry.get('Missing')).toThrow();
  });
});
