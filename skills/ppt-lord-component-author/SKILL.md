# ppt-lord-component-author

## 目标

通过代码、schema、registry、examples、tests 和 QA fixture 新增或修改组件及 variant。

## 适用场景

- 新增或修改 primitive、atom、composite 的组件契约。
- 需要同步 props schema、registry entry、example、fixture 和测试。

## 不适用场景

- 只是生成完整 PPT 或规划 deck。
- 只是修改 renderer layout 或 preview 后端。

## 最小上下文

- `src/registry/component-registry.ts`
- `src/schema/component.schema.ts`
- 当前组件相关 `src/components/**`
- 当前组件相关 `examples/components/**`、`tests/**`

## 必备产物

- props schema。
- registry entry。
- example spec。
- unit test。
- visual fixture placeholder。
- usage boundary。

## 验证

- `pnpm test tests/unit/registry.test.ts tests/schema/component-schema.test.ts`
- `pnpm lord quality --target component-registry --change-id <change-id>`

## 失败处理

缺少任一 required artifact 时返回 `BLOCKED` 或 `FAIL`，不要把 schema-only 组件描述为已具备视觉效果。

修改行为前必须先创建 OpenSpec-style change。
