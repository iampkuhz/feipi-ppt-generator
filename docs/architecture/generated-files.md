# Generated Files Contract

生成文件必须有明确 owner、生成命令和提交策略。没有写入本文件的生成物不得作为长期真源。

| Path | Source | Command | Commit policy |
|---|---|---|---|
| `src/foundation/default.foundation.schema.ts` | `src/foundation/default.foundation.ts` | `pnpm schema:generate` | 可提交，手改前必须说明原因 |
| `src/foundation/default.foundation.json` | foundation 定义 | `pnpm schema:generate` | 可提交，需与 TypeScript 真源同步 |
| `src/foundation/default.icons.json` | icon registry | 手工维护或模板导入脚本 | 可提交，禁止包含模板品牌身份 |
| `assets/templates/*/extracted/**` | 模板解析产物 | `scripts/template/*` | 仅提交脱敏、可复跑、非 raw 客户素材 |
| `tmp/rendered/**` | 本地生成 PPTX | `pnpm generate:example` | 本地-only，不提交 |
| `tmp/previews/**` | 本地 preview | `pnpm lord preview` | 本地-only，不提交 |
| `tmp/quality/**` | quality summary artifact | `pnpm lord quality` | 本地-only，不提交 |

## 规则

- 生成命令改变时必须更新本文件和 acceptance matrix。
- CI 中若生成命令会改动已提交文件，必须作为失败处理。
- raw extraction、真实客户素材、密钥和运行日志不得进入长期目录。
