# QA Report

## 验证命令

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm lord doctor
pnpm lord validate examples/decks/basic.deck.yaml
pnpm lord generate examples/decks/basic.deck.yaml --out tmp/rendered/basic.pptx
pnpm lord preview tmp/rendered/basic.pptx --out tmp/previews/basic
pnpm lord quality --target harness --change-id bootstrap
pnpm build
pnpm lint
bash scripts/harness/doctor.sh
```

## 结果

全部通过。`quality` 已写入 `tmp/quality/bootstrap/quality-gate-summary.harness.json`。

## 失败和风险

未发现命令失败。第一版仍有 TODO：非 harness target 的 quality gate 是轻量 stub，预览导出是占位报告，OpenSpec archive 尚未自动合并长期 specs。
