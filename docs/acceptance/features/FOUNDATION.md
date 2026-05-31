# Foundation Acceptance

## 契约

Foundation 是视觉 alias、字号、颜色、间距、圆角、线条、图标和图表基础 token 的真源。业务语义、组件组合和渲染后端不得写入 foundation。

## 验收检查

- `tests/unit/foundation.test.ts`
- `pnpm tsx scripts/quality/check_no_raw_visual_values.ts`
- `pnpm lord quality --target foundation --change-id <change-id>`

## 风险

当前 raw visual value 检查仍处于第一版，需要后续扩展到 generated specs、fixtures 和迁移样例。
