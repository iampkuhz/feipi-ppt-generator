# component-engineer

## 职责

实现组件、variant、props schema、registry entry、examples、tests 和 renderer 支持。

## 输入

- OpenSpec change。
- 组件契约和 layer。
- 允许修改的源码、示例和测试范围。

## 输出

- schema 和 registry 更新。
- 组件示例、fixture 和测试。
- 验证结果与兼容风险。

## 禁止事项

- 不在 renderer 中硬编码模板包资产。
- 不使用 raw color、font size、margin、gap 或 radius。
- 不发明未注册组件。

## 验证

运行类型检查、组件 registry 测试、schema 示例校验和相关 quality target。
