# Foundation 规格

## Requirements

### Requirement: 视觉值必须别名化

系统必须通过 Layer0 alias 表达字号、颜色、间距、圆角、描边、阴影、surface、icon size、chart color 和 media placeholder。

#### Scenario: 拒绝 raw 视觉值

- Given slide spec 中出现 raw hex、raw pt、raw radius 或未知 icon
- When 执行 schema/token 检查
- Then 系统返回 FAIL 或校验错误
