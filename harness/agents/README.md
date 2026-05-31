# Agent Registry

`harness/agents/` 是 agent 配置的长期真源目录。现阶段 `registry.yaml` 记录各 agent 的职责、输入、输出、授权范围和验证责任；`.claude/agents/`、`.codex/agents/`、`agents/` 仍保留为运行时入口。

后续如果引入生成脚本，应从 `registry.yaml` 生成或校验各运行时配置，避免多份 agent 描述长期漂移。
