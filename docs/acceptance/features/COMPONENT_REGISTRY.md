# Component Registry Acceptance

## 契约

组件必须通过 registry 暴露类型、props schema、默认 alias 和 fallback 语义。组件选择不得绕过 registry 直接写 renderer 形状。

## 验收检查

- `tests/unit/registry.test.ts`
- `tests/schema/component-schema.test.ts`
- `examples/components/*.yaml`
- `pnpm lord quality --target component-registry --change-id <change-id>`

## 风险

当前 registry 与示例覆盖关系还没有机器映射检查，后续应由 acceptance mapping 脚本补齐。
