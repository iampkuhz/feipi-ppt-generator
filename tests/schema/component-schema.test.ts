import { describe, expect, it } from 'vitest';
import { ComponentSpecSchema } from '../../src/schema/component.schema.js';

describe('component schema', () => {
  it('接受最小组件 spec', () => {
    expect(() => ComponentSpecSchema.parse({ type: 'PageTitle', props: { text: '标题' } })).not.toThrow();
  });

  it('接受原子组件样例中的 SurfaceCard spec', () => {
    expect(() =>
      ComponentSpecSchema.parse({
        type: 'SurfaceCard',
        props: { title: '标题', body: '正文', surface: 'white', radius: 'mdRadius' }
      })
    ).not.toThrow();
  });
});
