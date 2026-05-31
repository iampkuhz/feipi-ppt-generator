# Layer0 Style Foundation v0.3 for Moment2026

> Repo target: `docs/design-system/layer0-style-foundation.md`  
> Status: proposed standard. This document defines Layer0 only. It deliberately does not define component YAML, slide patterns, or renderer implementation details.

## 1. Layer0 与 Layer1 的边界

Layer0 不叫 token layer，正式名称建议为 **Style Foundation / 视觉基准层**。

Layer0 的职责是定义“合法取值”和“组合约束”：字体字号别名、颜色别名、颜色组合、页面 margin、内部 gap、圆角别名、背景资产别名、icon registry 标签，以及未来 renderer 必须校验的禁用项。Layer0 **不画任何对象**，也不拥有 `x/y/w/h`、业务内容、组件结构或 slide layout。

Layer1 的职责是 **Drawing Primitives / 绘制原语层**：用 Layer0 里的别名去实例化单个 PowerPoint 对象，例如一个文本框、一个圆角矩形、一个 icon asset、一个图片占位符或一个 chart frame。Layer1 可以接收 `bbox`，可以调用 renderer，可以把 `typeSize: "pageTitle"` 解析为 `20pt`，但不允许发明新的颜色、字号、margin 或 radius。

### 1.1 判断规则

| 问题 | 属于 Layer0 | 属于 Layer1 |
|---|---:|---:|
| 这个值是否是全仓库共享、长期稳定的视觉约束？ | 是 | 否 |
| 是否会直接创建 PPT shape/text/picture/chart？ | 否 | 是 |
| 是否包含 `x/y/w/h` 或具体 bbox？ | 否 | 是 |
| 是否包含业务内容，比如标题文案、KPI 数字、图表数据？ | 否 | 是或更高层 |
| 是否约束“只能从这些候选里选”？ | 是 | 消费约束 |
| 是否定义“这组颜色/字号/圆角可以一起用”？ | 是 | 消费组合 |

### 1.2 例子

```ts
// Layer0: 只定义合法 alias
fontSize.pageTitle = { pt: 20, latexScale: "large" }
color.copyNavy = "#002060"
radius.mdRadius = 12

// Layer1: 用 alias 画一个 text primitive
TextPrimitive({
  text: "Market Overview",
  bbox: { x: 64, y: 48, w: 600, h: 48 },
  typeSize: "pageTitle",
  color: "titleIndigo"
})
```

## 2. Layer0 当前应纳入代码仓库的内容

本轮建议只把以下内容进入仓库标准：

1. Typography size aliases
2. Color aliases + color roles + approved pairings
3. Page margin aliases + internal gap scale
4. Radius aliases
5. Icon style rule：默认使用模板提取 icon 资产，不使用 emoji 作为默认 icon
6. Typography generation prompt

本轮不把 `surface` 作为代码级标准沉淀。Surface 先保留 audit 文档，等确认原模板里的 surface 能力覆盖后再收敛成少量 presets。

## 3. 禁止项

生成器、agent、skill、component author 都必须遵守：

- 禁止直接写裸字号，例如 `fontSize: 30`、`fontSize: 14`。
- 禁止使用 `30pt` 作为标准字号；历史模板里的 `Main headline 30pt` 迁移到 `heroTitle = 32pt` 或 `pageTitle = 20pt`。
- 禁止直接写裸颜色，例如 `#4DD9FE`、`#7B61FF`，必须使用颜色 alias。
- 禁止创建新的 cyan alias；全局只保留一个主要青色 alias：`cyanAccent`。
- 禁止用户随意输入圆角弧度，例如 `radius: 17`。圆角只能从固定 alias 中选择。
- 禁止使用 `bleedMargin`。PPT 不是印刷品，背景铺满应该由 background/image primitive 的 `fit: "cover"` 处理，不属于 margin。
- 禁止把 surface presets 提前放进代码标准；本阶段只能放 surface audit。
