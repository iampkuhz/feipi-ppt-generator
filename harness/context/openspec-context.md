# OpenSpec 上下文

适用场景：创建、校验、归档 OpenSpec-style change。

必须读取的文件：`openspec/config.yaml`、`openspec/schemas/ppt-change/schema.yaml`、`openspec/templates/change/**`。

禁止读取的文件：本地-only 文件、运行态日志全文。

允许修改的路径：`openspec/changes/**`；归档时可修改对应长期 `openspec/specs/**`。

需要运行的最小验证：`pnpm lord doctor`、`pnpm tsx scripts/openspec/validate_change.ts <change-id>`。

失败处理：缺少 proposal、design、tasks 或 delta spec 时必须 BLOCKED。
