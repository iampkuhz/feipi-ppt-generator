# Quality Harness Acceptance

## 契约

Quality harness 只能输出确定性的 `PASS`、`FAIL`、`BLOCKED` 或 `SKIPPED`。required gate 被跳过时，overall 不得为 `PASS`。

## 验收检查

- `scripts/harness/doctor.sh`
- `tests/unit/harness.test.ts`
- `pnpm lord quality --target harness --change-id <change-id>`

## 风险

非 harness target 仍存在 stub gate，后续应按 path-based gate map 拆分真实命令和 artifact contract。
