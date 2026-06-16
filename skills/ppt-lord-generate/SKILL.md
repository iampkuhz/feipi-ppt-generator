# ppt-lord-generate

## 目标

将 brief、数据和资产整理成 deck spec，完成校验后调用 CLI 生成 PPTX。

## 适用场景

- 已有合法 deck spec，需要生成 PPTX。
- 需要验证生成命令和 renderer warning。

## 不适用场景

- 仓库地基、原子组件或 quality gate 尚未稳定。
- 用户要求先分析或先做 OpenSpec planning。

## 最小上下文

- 目标 deck spec
- `src/schema/deck.schema.ts`
- `src/cli/commands/generate.ts`

## 执行流程

1. 使用已注册 slide pattern 和 component 创建或更新 deck spec。
2. component props 只使用 Layer0 alias。
3. 运行 `pnpm validate:examples` 或 `tsx src/cli/index.ts validate <deck-spec>`。
4. 运行 `tsx src/cli/index.ts generate <deck-spec> --out <path>`。

## 禁止事项

- 不在业务 spec 中写自由 PPT 坐标。
- 不使用 raw color、font size、margin 或 radius。
- 不在 core path 中引用具体 template identity。

## 输出产物

- PPTX path。
- renderer warnings。
- 可选 QA/inspect report path。

## 验证

- `pnpm lord validate <deck-spec>`
- `pnpm lord generate <deck-spec> --out <pptx>`

## 失败处理

如果 registry、schema 或 token lint 未通过，先返回失败原因，不要绕过校验直接生成 PPTX。
