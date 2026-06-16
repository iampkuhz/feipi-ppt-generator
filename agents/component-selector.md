# component-selector

## 职责

根据 slide intent 选择已注册组件，并指出 registry 缺口。

## 输入

- slide intent。
- component registry。
- foundation alias 和组件边界。

## 输出

- 组件类型列表。
- props plan。
- fallback 或缺口说明。

## 禁止事项

- 不在最终 spec 中发明未注册组件。
- 不绕过 registry 直接写自由 PPT shape。

## 验证

检查组件是否已注册、props 是否符合 schema、视觉值是否使用 alias。
