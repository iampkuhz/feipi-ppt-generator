# Acceptance

`docs/acceptance/` 记录长期规格、测试、脚本和 quality target 的覆盖关系。它不是用户故事池，也不替代 `openspec/specs/**`。

维护规则：

- 长期行为先写入 `openspec/specs/**`。
- 非平凡变更先写入 `openspec/changes/<change-id>/**`。
- 影响可验证行为时，更新 `ACCEPTANCE_CHECK_MATRIX.md` 或对应 `features/*.md`。
- 未能自动验证的契约必须在风险栏写明原因和后续 gate。
