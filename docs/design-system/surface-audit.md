# Surface Audit for Moment2026 Template

> Repo target: `docs/design-system/surface-audit.md`  
> Status: audit only. Do **not** convert this into `surface.ts` or component presets yet.

## 1. 为什么本轮不把 surface 放进代码标准

原模板里的 surface 不是单一风格：有背景图片、有白色半透明玻璃卡、有纯品牌渐变面板、有半透明渐变叠层、有灰色视频/图片 placeholder、有圆形渐变 icon bubble，还有少量阴影。现在如果直接沉淀 `plainSurface / glassSurface / tintedSurface / outlineSurface`，很容易覆盖不全，又会把 surface 和 card/component 混在一起。

本轮建议只做两件事：

1. 在 renderer 能力上确保可以表达原模板中出现过的 surface 技法。
2. 先记录 surface taxonomy，等 Layer1/Layer2 组件明确后再收敛成少量 presets。

## 2. 原模板中观察到的 surface 类型

| audit id | 观察到的形态 | 典型页面 | 需要的底层能力 | 是否现在进入代码标准 |
|---|---|---|---|---|
| `backgroundCoverBeam` | 封面整页动态光束背景图 | slide 01 | image background, cover crop | 只作为 background asset registry，不作为 surface preset |
| `backgroundLightAurora` | 正文页浅蓝紫渐变背景图 | 多数正文页 | image background, cover crop | 只作为 background asset registry，不作为 surface preset |
| `whiteTranslucentPanel` | 白色/浅色半透明圆角卡片，透明度约 19% / 40% / 50% | slides 03, 13, 14, 16, 18, 19, 20 | solid fill + opacity + optional stroke + radius | 暂不标准化 |
| `brandGradientPanel` | 紫到蓝的实色渐变圆角面板 | slide 04, slide 13 title bars, slide 16 top KPI cards | linear gradient + radius + inverse text | 暂不标准化 |
| `softGradientOverlay` | 低透明度蓝紫渐变叠层，用在局部卡片/流程块 | slides 13, 19 | gradient stops + per-stop opacity | 暂不标准化 |
| `neutralPlaceholder` | 灰色视频/图片占位 | slides 11, 17 | neutral fill + centered placeholder text | 应作为 media/image primitive 的 placeholder，而不是 surface preset |
| `gradientCircleBubble` | 圆形渐变 icon 容器/节点 | slides 12, 14, 15, 19 | ellipse + gradient fill + optional white icon/text | 应归入 icon container / node primitive，不作为通用 surface preset |
| `progressBarFrame` | 细长圆角数据条/进度条 | slide 02 | rounded rect + vertical gradient | 归入 progress/data primitive，不作为 Layer0 data palette |
| `subtleShadow` | 极少量外阴影 | slide 19 附近 | outer shadow with opacity | renderer 可支持，但先不开放给用户 |

## 3. Renderer 需要优先覆盖的能力

为了后续 surface preset 能覆盖原模板，Layer1 renderer 至少要支持：

```ts
fill: {
  kind: "solid" | "linearGradient" | "image" | "none",
  color?: PaletteAlias,
  opacity?: number,
  stops?: Array<{ color: PaletteAlias, opacity?: number, position: number }>,
  angle?: "leftToRight" | "topToBottom"
}

stroke: {
  color: PaletteAlias,
  opacity?: number,
  widthPx?: number
}

radius: "smRadius" | "mdRadius" | "lgRadius" | "pillRadius" | "circleRadius"

shadow?: {
  kind: "outer",
  color: PaletteAlias,
  opacity: number,
  blurPx: number,
  distancePx: number
}
```

注意：这里是 renderer 能力，不是组件 API，也不是用户可自由输入的 surface preset。

## 4. 后续可能收敛的 surface presets

等 Layer1/Layer2 定下来后，再讨论是否只保留下面 3~4 种：

| candidate preset | 可能用途 | 备注 |
|---|---|---|
| `glassPanel` | 白色半透明内容卡片 | 需要确认统一 opacity/stroke |
| `brandPanel` | 深色品牌渐变面板 | 需要确认渐变方向和文本反白规则 |
| `softPanel` | 低透明度浅色信息底 | 需要确认是否真的高频 |
| `placeholderPanel` | 图片/视频占位 | 可能不属于 surface，而属于 media primitive |

当前不要把这些写进 `src/theme/.../surface.ts`。最多只在文档里记录 audit。

## 5. 与 Layer0 的关系

Surface 本身更接近“复合视觉样式”。它会组合颜色、透明度、stroke、radius、可能还有 shadow，所以不应该和 palette、typeSize、margin、radius 放在同一优先级。Layer0 可以定义它依赖的基础 alias，例如颜色、圆角、opacity 约束；但 `glassPanel` 这种 preset 是否存在，应该等组件层稳定后再定。
