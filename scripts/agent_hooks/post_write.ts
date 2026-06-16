import { validateLocalOnlyAccess } from '../hooks/local_only_guard.js';

const blocked = await validateLocalOnlyAccess(process.argv.slice(2));
if (blocked.length > 0) {
  for (const path of blocked) console.error(`BLOCKED 写入后发现 local-only 路径：${path}`);
  process.exitCode = 1;
} else {
  console.log('PASS 写入后检查通过');
}
