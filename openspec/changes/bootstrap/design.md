# Design

## 方案

保留已有 PPTX smoke renderer，在其上增量补齐 v2 治理骨架。`doctor` 做结构化检查，`quality` 写入确定性 summary artifact，hook shell 只转发到 TypeScript stub。

## 影响面

影响 `.claude/`、`.codex/`、`harness/`、`openspec/`、`scripts/`、`src/cli/`、`src/foundation/`、`src/registry/`、`tests/` 和 `examples/`。

## 替代方案

未选择重建空仓，因为当前仓库已有可通过测试的基础 PPT 生成骨架。

## 风险

第一版 quality gate 对非 harness target 仍是轻量 stub；预览导出只写占位报告；archive 流程保留人工合并 TODO。
