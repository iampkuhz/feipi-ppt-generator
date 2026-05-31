# Component 上下文

适用场景：新增或修改 primitive、atom、composite、pattern 和 registry。

必须读取的文件：`src/components/**`、`src/registry/component-registry.ts`、`src/schema/component.schema.ts`。

禁止读取的文件：本地-only 文件、未脱敏素材、运行态日志全文。

允许修改的路径：`src/components/**`、`src/registry/**`、`examples/components/**`、`tests/**`、对应 OpenSpec change。

需要运行的最小验证：`pnpm typecheck`、`pnpm test tests/unit/registry.test.ts`、`pnpm lord validate examples/decks/basic.deck.yaml`。

失败处理：新增组件缺少 schema、registry、example、test 或 usage boundary 时视为未完成。
