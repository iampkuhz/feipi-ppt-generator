# ppt-lord-visual-qa

## 目标

生成 preview、运行 QA checks，并产出 report。

## 适用场景

- 已有 PPTX、preview 或 inspect report，需要确定性 QA。

## 不适用场景

- 只是主观评价视觉好不好。
- 缺少待检查 artifact。

## 最小上下文

- 指定 PPTX 或 inspect report
- `scripts/quality/**`
- 当前 change 的 `qa-report.md`

## 执行流程

1. 校验 deck spec。
2. 生成 PPTX。
3. 运行 `render-preview`。
4. 运行 `qa`。

preview rendering 当前输出结构预览报告；visual diff 尚未实现，不能描述为已经完成视觉回归。

## 输出产物

- PASS、FAIL 或 BLOCKED
- artifact path
- failing gate 和中文修复提示

## 验证

- `pnpm lord quality --target visual-harness --change-id <change-id>`
- 或针对 PPTX 使用结构 inspect gate

## 失败处理

缺少 artifact 时返回 `BLOCKED`；不得输出 subjective score、rating 或 qualityScore。
