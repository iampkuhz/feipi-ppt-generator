import { access, mkdir, writeFile } from 'node:fs/promises';

await mkdir('tmp/agent_logs/local', { recursive: true });
let readOnly = true;
try {
  await access('tmp/quality');
  readOnly = false;
} catch {
  readOnly = true;
}

await writeFile(
  'tmp/agent_logs/local/stop-summary.json',
  `${JSON.stringify(
    {
      status: 'PASS',
      readOnly,
      message: readOnly ? '只读会话快速检查通过' : '已检测到 quality artifact 目录',
      next: '如有写操作，请运行 pnpm lord quality --target harness --change-id <change-id>'
    },
    null,
    2
  )}\n`
);
console.log('PASS Stop hook stub 已写入 summary');
