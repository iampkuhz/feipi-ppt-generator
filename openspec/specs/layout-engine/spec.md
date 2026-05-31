# Layout Engine 规格

## Requirements

### Requirement: 布局由引擎解析

业务 spec 不直接写自由 PPT 坐标，layout engine 负责把组件意图解析为 PPT 坐标。

#### Scenario: renderer 请求布局

- Given 合法 slide spec
- When renderer 生成 PPTX
- Then renderer 通过 layout engine 取得组件区域
