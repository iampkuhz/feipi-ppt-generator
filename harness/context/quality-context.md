# Quality 上下文

适用场景：修改质量门禁、artifact schema、视觉回归或检查脚本。

必须读取的文件：`harness/quality/**`、`scripts/quality/**`、`scripts/hooks/**`。

禁止读取的文件：`tmp/quality/**` 历史全文、密钥、本地配置。

允许修改的路径：`harness/quality/**`、`scripts/quality/**`、`scripts/hooks/**`、`tests/**`。

需要运行的最小验证：`pnpm typecheck`、`pnpm lord quality --target harness --change-id <change-id>`。

失败处理：required gate 出现 `SKIPPED` 时 overall 不能是 `PASS`。
