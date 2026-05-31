# Agent Runtime 规格

## Requirements

### Requirement: hook 只做薄入口

`.claude/hooks/*.sh` 只能定位仓库根目录并调用对应 TypeScript 脚本，复杂策略必须放在 `scripts/agent_hooks/` 或 `scripts/hooks/`。

#### Scenario: Stop hook 检查 artifact

- Given 会话有写操作
- When Stop hook 执行
- Then 它只检查已有 quality artifact，不直接运行重型测试
