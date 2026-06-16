import { validateAgentRuntime } from '../harness/validate_agent_runtime.js';

const errors = await validateAgentRuntime();
if (errors.length > 0) {
  for (const error of errors) console.error(`FAIL agent runtime 配置漂移：${error}`);
  process.exitCode = 1;
} else {
  console.log('PASS ConfigChange agent runtime 检查通过');
}
