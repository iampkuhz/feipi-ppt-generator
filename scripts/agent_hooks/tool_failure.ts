import { appendFile, mkdir } from 'node:fs/promises';

await mkdir('tmp/agent_logs/local', { recursive: true });
await appendFile(
  'tmp/agent_logs/local/tool-failures.jsonl',
  `${JSON.stringify({
    event: 'ToolFailure',
    at: new Date().toISOString(),
    args: process.argv.slice(2)
  })}\n`
);
console.log('PASS 工具失败事件已记录');
