# Spacing, Margin, and Radius System for Moment2026

> Repo target: `docs/design-system/spacing-radius-system.md`  
> Status: proposed standard.

## 1. 坐标基准

建议内部设计坐标采用 `1600 × 900 px` 的 16:9 画布，映射到 PPTX 的 `10 × 5.625 in`。

换算关系：

```text
1 in = 160 px
1 px = 0.00625 in
4 px = 0.025 in
```

所有 margin/gap/radius 的 px 值必须是 4px 的倍数，方便对齐和视觉回归检查。

## 2. Page margins

不保留 `bleedMargin`。背景、封面大图、全屏视频/图片的铺满由 background/image primitive 的 `fit: "cover"` 实现，不属于 margin。

| alias | px | inch | 场景 |
|---|---:|---:|---|
| `tightMargin` | 48 | 0.30 | 高密度 icon wall、表格、图表页 |
| `compactMargin` | 64 | 0.40 | 常规商务内容页，信息较多时使用 |
| `safeMargin` | 96 | 0.60 | 默认安全区，推荐大多数页面使用 |
| `wideMargin` | 128 | 0.80 | 封面、章节页、图片页、留白较大的页面 |

默认规则：

```ts
pageMargin.default = "safeMargin"
pageMargin.dense = "compactMargin"
pageMargin.iconWall = "tightMargin"
pageMargin.hero = "wideMargin"
```

## 3. Internal gaps

Gap 是组件内部或组件之间的间距，不等同于 page margin。

| alias | px | inch | 场景 |
|---|---:|---:|---|
| `hairGap` | 4 | 0.025 | 极小分隔、图例内部 |
| `xsGap` | 8 | 0.05 | badge/icon 与文字的紧密间距 |
| `smGap` | 12 | 0.075 | 小卡片内部元素间距 |
| `mdGap` | 16 | 0.10 | 默认组件 gap |
| `lgGap` | 24 | 0.15 | 卡片之间、图表与说明之间 |
| `xlGap` | 32 | 0.20 | 大区块之间 |

不建议继续扩展 gap scale。需要更大空间时，优先通过 layout area 或 grid 分配，而不是新增 `xxlGap`。

## 4. Radius aliases

总量不超过 5 个。删除 `sharpRadius`、`tagRadius`、`chipRadius`、`glassRadius`、`heroRadius` 等过细 alias。

| alias | px | PPTX 实现建议 | 场景 |
|---|---:|---|---|
| `smRadius` | 4 | roundRect adjustment 约 0.03 | 小型短标签、小色块、非常紧凑的容器 |
| `mdRadius` | 12 | roundRect adjustment 约 0.10 | 默认卡片、图表容器、内容模块 |
| `lgRadius` | 24 | roundRect adjustment 约 0.18 | 大面积面板、section card、视觉主容器 |
| `pillRadius` | 9999 | roundRect maximum | 胶囊标签、状态标签、短 badge |
| `circleRadius` | 50% | ellipse；必须 `w == h` | 头像、icon 圆容器、圆形节点 |

## 5. 默认值

```ts
radiusDefaults = {
  smallBadge: "pillRadius",
  smallSwatch: "smRadius",
  card: "mdRadius",
  largePanel: "lgRadius",
  avatar: "circleRadius",
  iconBubble: "circleRadius"
}
```

## 6. Lint 规则建议

```ts
forbidRawMargin: true
forbidBleedMargin: true
allowedPageMargins: ["tightMargin", "compactMargin", "safeMargin", "wideMargin"]
allowedGaps: ["hairGap", "xsGap", "smGap", "mdGap", "lgGap", "xlGap"]
allowedRadii: ["smRadius", "mdRadius", "lgRadius", "pillRadius", "circleRadius"]
requirePxMultipleOf: 4
```
