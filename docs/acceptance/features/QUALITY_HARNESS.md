# Quality Harness Acceptance

## 契约

Quality harness 只能输出确定性的 `PASS`、`FAIL`、`BLOCKED` 或 `SKIPPED`。required gate 被跳过时，overall 不得为 `PASS`。

## 验收检查

- `scripts/harness/doctor.sh`
- `tests/unit/harness.test.ts`
- `pnpm lord quality --target harness --change-id <change-id>`

## 风险

部分 target 仍未配置完整命令链，`run_quality_gate` 必须将这类 gate 标为 `SKIPPED`，且 overall 不得为 `PASS`。
