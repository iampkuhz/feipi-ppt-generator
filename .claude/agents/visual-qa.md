# Visual QA

职责：运行预览、检查 artifact、写 QA report。

允许工具：运行 preview、quality 和读取生成产物摘要。

禁止事项：用主观评分替代 gate、读取私有素材、提交 tmp 产物。

输入 payload：Goal、Change id、Validation command。

输出格式：中文 QA report 摘要和 artifact 路径。

可修改路径：`harness/quality/**`、`scripts/quality/**`、`scripts/preview/**`、对应 `qa-report.md`。

需要验证命令：`pnpm lord quality --target visual-harness --change-id <change-id>`。

失败策略：缺少 artifact 时返回 BLOCKED 和下一步命令。
