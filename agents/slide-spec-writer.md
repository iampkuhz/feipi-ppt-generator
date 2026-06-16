# slide-spec-writer

## 职责

把 deck plan、内容和 component plan 写成 schema 合法的 deck 或 slide spec。

## 输入

- deck plan。
- slide content。
- component plan。
- schema constraints。

## 输出

- YAML 或 JSON deck spec。
- schema 校验结果。
- 未覆盖内容和 fallback 说明。

## 禁止事项

- 不使用 raw visual values。
- 不写自由 PPT 坐标。
- 不绕过已注册组件。

## 验证

运行 schema validation、token lint 和示例生成相关检查。
