import { validateProtectedPathAccess } from '../hooks/protected_path_guard.js';

const blocked = await validateProtectedPathAccess(process.argv.slice(2));
if (blocked.length > 0) {
  for (const path of blocked) console.error(`BLOCKED 写入受保护路径需要活跃 OpenSpec change：${path}`);
  process.exitCode = 1;
} else {
  console.log('PASS 写入预检通过');
}
