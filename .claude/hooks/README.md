# Hook 入口

本目录的 `.sh` 文件只做薄入口：启用严格模式、定位仓库根目录、调用对应 TypeScript 脚本，并原样返回失败码。复杂策略放在 `scripts/agent_hooks/`、`scripts/hooks/` 或 `scripts/quality/`。
