# Template Pack 规格

## Requirements

### Requirement: 模板包不得污染仓库身份

模板包必须以独立 `template-id` 管理，核心仓库身份不得引用特定品牌、客户或活动来源。

#### Scenario: 加载默认模板包

- Given `assets/templates/default/manifest.yaml`
- When template pack loader 读取 manifest
- Then 系统获得 slide size、foundation 和资产目录信息
