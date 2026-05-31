# Deterministic Quality Gate

质量门禁只能输出 `PASS|FAIL|BLOCKED|SKIPPED`。禁止使用 LLM 主观评分、`score`、`rating` 或 `qualityScore`。

required gate 为 `SKIPPED` 时，overall 必须是 `FAIL` 或 `BLOCKED`。Stop hook 只检查已有 artifact，不直接运行重型测试。
