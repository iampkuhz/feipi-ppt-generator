# Template Pack Acceptance

## 契约

Template pack 负责模板 manifest、资产索引、foundation 映射和模板身份隔离。模板导入信息不得污染 core 组件命名、示例文案或长期规格。

## 验收检查

- `assets/templates/default/manifest.yaml`
- `src/template-pack/*.ts`
- `pnpm check:identity`
- `pnpm lord quality --target template-pack --change-id <change-id>`

## 风险

模板身份泄漏规则源还未结构化，后续应新增治理配置并将 forbidden terms 纳入质量门。
