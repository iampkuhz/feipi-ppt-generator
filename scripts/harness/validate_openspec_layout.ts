import { access, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const requiredPaths = [
  'openspec/README.md',
  'openspec/config.yaml',
  'openspec/project.md',
  'openspec/schemas/ppt-change/schema.yaml',
  'openspec/templates/change/proposal.md',
  'openspec/templates/change/design.md',
  'openspec/templates/change/tasks.md',
  'openspec/templates/change/delta-spec.md',
  'openspec/templates/change/qa-report.md',
  'openspec/specs/foundation/spec.md',
  'openspec/specs/template-pack/spec.md',
  'openspec/specs/component-registry/spec.md',
  'openspec/specs/layout-engine/spec.md',
  'openspec/specs/renderer/spec.md',
  'openspec/specs/quality-harness/spec.md',
  'openspec/specs/agent-runtime/spec.md',
  'openspec/changes/archive'
];

export async function validateOpenSpecLayout(): Promise<string[]> {
  const errors: string[] = [];
  for (const path of requiredPaths) {
    try {
      await access(path);
    } catch {
      errors.push(`缺少 OpenSpec 路径：${path}`);
    }
  }

  try {
    const changes = await readdir('openspec/changes');
    for (const changeId of changes.filter((item) => !item.startsWith('.') && item !== 'archive')) {
      const changePath = join('openspec/changes', changeId);
      if (!(await stat(changePath)).isDirectory()) continue;
      for (const required of ['proposal.md', 'design.md', 'tasks.md']) {
        try {
          await access(join(changePath, required));
        } catch {
          errors.push(`change ${changeId} 缺少 ${required}`);
        }
      }
    }
  } catch {
    errors.push('无法读取 openspec/changes');
  }

  return errors;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const errors = await validateOpenSpecLayout();
  if (errors.length > 0) {
    for (const error of errors) console.error(`FAIL ${error}`);
    process.exitCode = 1;
  } else {
    console.log('PASS OpenSpec 目录结构有效');
  }
}
