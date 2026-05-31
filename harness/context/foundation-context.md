# Foundation 上下文

适用场景：修改 Layer0 视觉基准、别名或 token 检查。

必须读取的文件：`src/foundation/**`、`src/harness/token-lint.ts`、`tests/unit/foundation.test.ts`。

禁止读取的文件：本地-only 文件、真实素材和运行态日志。

允许修改的路径：`src/foundation/**`、`tests/unit/**`、`examples/**`、对应 OpenSpec change。

需要运行的最小验证：`pnpm typecheck`、`pnpm test tests/unit/foundation.test.ts`、`pnpm lord quality --target foundation --change-id <change-id>`。

失败处理：保留错误输出摘要，更新 `qa-report.md`，不要把失败说成通过。
