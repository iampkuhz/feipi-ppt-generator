# Component Registry 规格

## Requirements

### Requirement: 组件必须注册后使用

所有业务组件必须存在 registry entry，并提供 props schema、版本、层级、状态、示例和 usage boundary。

#### Scenario: 拒绝未知组件

- Given deck spec 引用了未知组件类型
- When 执行 validate
- Then 系统返回校验错误
