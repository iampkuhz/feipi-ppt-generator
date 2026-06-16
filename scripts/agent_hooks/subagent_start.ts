import { validateAgentRuntime } from '../harness/validate_agent_runtime.js';

const errors = await validateAgentRuntime();
if (errors.length > 0) {
  for (const error of errors) console.error(`FAIL SubagentStart 配置不一致：${error}`);
  process.exitCode = 1;
} else {
  console.log('PASS SubagentStart agent runtime 检查通过');
}
