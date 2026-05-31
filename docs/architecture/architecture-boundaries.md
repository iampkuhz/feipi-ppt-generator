# Architecture Boundaries

本文件定义 TypeScript 层级边界，是后续 architecture rules gate 的规则来源。

## 允许方向

推荐依赖方向：

```text
foundation -> schema -> registry -> components -> patterns -> layout -> renderer -> cli
```

其中 `harness`、`scripts` 和 `tests` 可以引用业务层以做检查，但不得被 `src/**` 反向依赖。

## 禁止方向

| From | Forbidden to | 原因 |
|---|---|---|
| `src/foundation/**` | `src/renderer/**`, `src/components/**` | foundation 是底层 token，不应依赖绘制或组合层 |
| `src/schema/**` | `src/renderer/**`, `src/cli/**` | schema 不应依赖运行层或命令行 |
| `src/components/**` | `src/cli/**`, `examples/**` | components 是可复用库，不读取示例或 CLI |
| `src/patterns/**` | `src/cli/**` | patterns 不应依赖命令行 |
| `src/renderer/**` | `tests/**`, `examples/**` | renderer 不读取测试和示例输入 |
| `src/**` | `tmp/**`, `assets/templates/*/extracted/raw/**` | core 代码不依赖运行态或 raw extraction |

## 后续 gate

后续可以引入 `.dependency-cruiser.cjs` 或等价脚本，将本文件转为机器检查。引入依赖前必须通过 OpenSpec change，并更新 `scripts/quality/quality_targets.ts`。
