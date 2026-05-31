# Renderer 上下文

适用场景：修改 renderer 接口、PPTX 后端、资产解析、预览导出。

必须读取的文件：`src/renderer/**`、`src/layout/**`、`tests/renderer/**`、`harness/quality/pptx-inspection-contract.md`。

禁止读取的文件：真实客户 PPT、私有素材、密钥和运行态日志全文。

允许修改的路径：`src/renderer/**`、`src/layout/**`、`scripts/preview/**`、`tests/**`、对应 OpenSpec change。

需要运行的最小验证：`pnpm typecheck`、`pnpm test tests/renderer tests/e2e`。

失败处理：renderer 可以输出明确 TODO artifact，但不能伪造预览或视觉通过结论。
