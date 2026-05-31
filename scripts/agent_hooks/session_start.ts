import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('tmp/agent_logs/local', { recursive: true });
await writeFile(
  'tmp/agent_logs/local/session.json',
  `${JSON.stringify({ event: 'SessionStart', at: new Date().toISOString(), message: '会话开始' })}\n`
);
console.log('PASS SessionStart hook 已记录');
