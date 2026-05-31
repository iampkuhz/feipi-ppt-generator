# Quality Harness 规格

## Requirements

### Requirement: 质量门禁必须确定性

质量门禁只能输出 `PASS|FAIL|BLOCKED|SKIPPED`，不得输出 score、rating 或 qualityScore。

#### Scenario: required gate 被跳过

- Given required gate 状态为 `SKIPPED`
- When 生成 quality summary
- Then overall status 必须为 `FAIL` 或 `BLOCKED`
