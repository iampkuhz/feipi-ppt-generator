import { describe, expect, it } from 'vitest';
import { ComponentSpecSchema } from '../../src/schema/component.schema.js';

describe('component schema', () => {
  it('接受最小组件 spec', () => {
    expect(() => ComponentSpecSchema.parse({ type: 'PageTitle', props: { text: '标题' } })).not.toThrow();
  });
});
