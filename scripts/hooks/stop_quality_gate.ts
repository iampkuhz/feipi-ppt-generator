import { access } from 'node:fs/promises';

const changeId = process.argv[2] ?? 'bootstrap';
const target = process.argv[3] ?? 'harness';
const path = `tmp/quality/${changeId}/quality-gate-summary.${target}.json`;

try {
  await access(path);
  console.log(`PASS 已找到 quality artifact：${path}`);
} catch {
  console.error(`BLOCKED 缺少 quality artifact：${path}`);
  console.error(`下一步执行：pnpm lord quality --target ${target} --change-id ${changeId}`);
  process.exitCode = 1;
}
