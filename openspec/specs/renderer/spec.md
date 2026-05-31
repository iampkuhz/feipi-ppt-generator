# Renderer 规格

## Requirements

### Requirement: renderer 返回可追踪结果

renderer 必须返回 PPTX 路径、warnings 和 artifact 信息。

#### Scenario: 生成基础 deck

- Given 合法 basic deck
- When 执行 `pnpm lord generate`
- Then 生成 PPTX 文件并返回中文日志
