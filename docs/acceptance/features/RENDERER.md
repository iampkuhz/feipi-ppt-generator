# Renderer Acceptance

## 契约

Renderer 只负责把合法 deck spec、foundation alias 和模板资产渲染为 PPTX。Renderer 不读取示例目录，不内置业务文案，不输出主观质量评分。

## 验收检查

- `tests/renderer/renderer-smoke.test.ts`
- `tests/e2e/generate-basic-deck.test.ts`
- `pnpm generate:example`
- `pnpm lord quality --target renderer --change-id <change-id>`

## 风险

`check_pptx_structure.ts` 已基于 PPTX zip 结构做 deterministic inspection。图像预览、视觉 diff 和文本溢出检查仍属于后续 PPT QA change。
