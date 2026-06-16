import { access, readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { ComponentSpecSchema } from '../../src/schema/component.schema.js';
import { defaultComponentRegistry } from '../../src/registry/component-registry.js';

const errors: string[] = [];

for (const entry of defaultComponentRegistry.list()) {
  if (!entry.maturity) errors.push(`${entry.type} 缺少 maturity`);
  if (!entry.usageBoundary) errors.push(`${entry.type} 缺少 usageBoundary`);
  if (!entry.description) errors.push(`${entry.type} 缺少 description`);
  if (entry.examples.length === 0) errors.push(`${entry.type} 缺少 example spec`);
  if (entry.visualFixtures.length === 0) errors.push(`${entry.type} 缺少 visual fixture`);

  for (const example of entry.examples) {
    try {
      const raw = parse(await readFile(example, 'utf8'));
      const spec = ComponentSpecSchema.parse(raw);
      if (spec.type !== entry.type) {
        errors.push(`${entry.type} example 类型不一致：${example} -> ${spec.type}`);
      }
      defaultComponentRegistry.validate(spec);
    } catch (error) {
      errors.push(`${entry.type} example 无效：${example} ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  for (const fixture of entry.visualFixtures) {
    try {
      await access(fixture);
    } catch {
      errors.push(`${entry.type} fixture 不存在：${fixture}`);
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`FAIL ${error}`);
  process.exitCode = 1;
} else {
  console.log('PASS component registry 契约检查通过');
}
