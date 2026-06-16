import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { AtomComponentCatalogSchema } from '../../src/schema/atom-component.schema.js';
import { defaultComponentRegistry } from '../../src/registry/component-registry.js';

describe('atom component catalog schema', () => {
  it.each(['examples/components/atom-components.json', 'examples/components/atom-component-variants.json'])(
    '接受原子组件 JSON 契约并可被 registry 校验：%s',
    (path) => {
      const catalog = AtomComponentCatalogSchema.parse(JSON.parse(readFileSync(path, 'utf8')));
    expect(catalog.components.length).toBeGreaterThan(0);
    for (const item of catalog.components) {
      defaultComponentRegistry.validate(item.component);
    }
    }
  );
});
