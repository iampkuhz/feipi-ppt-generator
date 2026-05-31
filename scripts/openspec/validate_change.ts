import { access } from 'node:fs/promises';
import { join } from 'node:path';

const changeId = process.argv[2];
if (!changeId) throw new Error('缺少 change id');

const root = join('openspec/changes', changeId);
const required = ['proposal.md', 'design.md', 'tasks.md'];
for (const file of required) {
  await access(join(root, file));
}
await access(join(root, 'specs'));
console.log(`PASS change ${changeId} 结构有效`);
