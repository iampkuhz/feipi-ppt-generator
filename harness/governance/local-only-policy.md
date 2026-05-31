# Local-only 规则

禁止读取、提交或输出 `.env`、`.env.*`、`.mcp.json`、`.claude/settings.local.json`、`.codex/local.json`、密钥、token、私有素材、真实客户 PPT、运行态日志全文、`tmp/agent_logs/**` 和 `tmp/quality/**`。

可以提交 `.env.example`、manifest 示例、脱敏 fixture、空目录占位、文档、schema 和测试样例。
