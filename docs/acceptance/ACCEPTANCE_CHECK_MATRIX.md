# Acceptance Check Matrix

| Feature | Spec source | Primary checks | Quality target | Status |
|---|---|---|---|---|
| Foundation aliases | `openspec/specs/foundation/spec.md` | `tests/unit/foundation.test.ts`, `scripts/quality/check_no_raw_visual_values.ts` | `foundation` | active |
| Component registry | `openspec/specs/component-registry/spec.md` | `tests/unit/registry.test.ts`, `tests/schema/component-schema.test.ts` | `component-registry` | active |
| Renderer | `openspec/specs/renderer/spec.md` | `tests/renderer/renderer-smoke.test.ts`, `tests/e2e/generate-basic-deck.test.ts` | `renderer` | partial |
| Template pack | `openspec/specs/template-pack/spec.md` | `src/template-pack/*.ts`, `scripts/check-no-template-identity-leak.ts` | `template-pack` | partial |
| Quality harness | `openspec/specs/quality-harness/spec.md` | `tests/unit/harness.test.ts`, `scripts/harness/doctor.sh` | `harness` | active |
| Agent runtime | `openspec/specs/agent-runtime/spec.md` | `scripts/agent_hooks/*`, `scripts/hooks/*` | `hook-runtime` | partial |

## 覆盖缺口

- `renderer` target 仍需要真实 PPTX inspect 和 preview artifact 检查。
- `hook-runtime` target 仍需要 active change guard、evidence writer 和 stop artifact 检查。
- `template-pack` target 仍需要模板身份泄漏规则源和 manifest 深度校验。
- 后续应新增 `scripts/quality/validate_test_contract_mapping.ts`，用机器检查本矩阵和测试入口是否同步。
