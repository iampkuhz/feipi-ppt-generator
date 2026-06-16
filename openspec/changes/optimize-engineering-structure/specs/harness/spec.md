# Delta Spec

## ADDED Requirements

### Requirement: Agent 运行面必须以 registry 为真源

仓库必须用 `harness/agents/registry.yaml` 表达 active、deferred 和 shared agent 的职责、输入、输出、授权范围和验证责任。运行时入口不得复制完整通用规则。

#### Scenario: active agent 文件完整

- Given 执行 agent runtime 校验
- When registry 声明 active agent
- Then `.claude/agents/<agent>.md` 和 `.codex/agents/<agent>.toml` 必须存在
- And Claude agent 文件必须包含标准 frontmatter
- And Codex agent name 必须与文件名一致

#### Scenario: agent 工具策略不再漂移

- Given 执行 agent runtime 校验
- When 检查 `.claude/agents/*.md` 和 `.codex/agents/*.toml`
- Then active 工具面不得继续依赖旧的 `Glob` / `Grep` 策略
- And 默认搜索约定必须收敛到受限 `find` 和 `rg`

### Requirement: 文档型入口必须遵守中文规约

仓库文档、agent、skill、harness 说明、测试描述、schema 说明、错误提示、日志和 QA report 必须默认中文。英文仅用于标识符、路径、命令、API、类型名和标准术语。

#### Scenario: language policy 校验

- Given 执行 language policy 校验
- When 扫描 `AGENTS.md`、`agents/`、`skills/`、`.claude/agents`、`.claude/skills`、`.codex/agents` 和 `harness/`
- Then 每个文档型入口必须包含中文说明

### Requirement: Hook 和 quality gate 必须输出确定性状态

仍被 hook 或 CLI 调用的脚本必须执行轻量确定性检查或记录事件；未配置完整 gate 的 target 必须输出 `SKIPPED`，overall 不得为 `PASS`。

#### Scenario: hook runtime 检查

- Given 修改受保护路径或 local-only 路径
- When 执行对应 guard 脚本
- Then 脚本必须返回中文 `BLOCKED` 或 `FAIL` 提示
- And 不得只输出占位 `PASS`

#### Scenario: 未支持 target

- Given 执行尚未配置真实命令链的 quality target
- When `run_quality_gate` 生成 summary
- Then summary 必须包含 `SKIPPED`
- And overall status 必须为 `FAIL`

### Requirement: 原子组件样例必须由 catalog 驱动

原子组件样例必须通过结构化 catalog 描述组件类型、layer、maturity、props、expectedTexts 和 fixture。生成脚本必须产出 deck、PPTX、fixture manifest 和 inspect report。

#### Scenario: 生成原子组件 review PPTX

- Given `examples/components/atom-components.json`
- When 执行 `pnpm tsx scripts/components/generate_atom_samples.ts --out tmp/atom-samples`
- Then 必须生成 `tmp/atom-samples/atom-components.deck.yaml`
- And 必须生成 `tmp/atom-samples/atom-components.pptx`
- And inspect report 必须包含 slide 数量和 expected text
