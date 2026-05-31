# Agent Runtime 上下文

适用场景：修改 `.claude/`、`.codex/`、hooks、subagent 文档或运行态日志策略。

必须读取的文件：`.claude/hooks/README.md`、`harness/workflow/hook-runtime-lifecycle.md`、`scripts/agent_hooks/**`。

禁止读取的文件：密钥、本地配置、`tmp/agent_logs/**` 全文。

允许修改的路径：`.claude/**`、`.codex/**`、`scripts/agent_hooks/**`、`scripts/hooks/**`、`harness/workflow/**`。

需要运行的最小验证：`pnpm lord doctor`、`pnpm lord quality --target hook-runtime --change-id <change-id>`。

失败处理：hook shell 只能做薄入口，复杂策略必须放入 TypeScript 脚本。
