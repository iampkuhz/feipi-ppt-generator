# Color System for Moment2026

> Repo target: `docs/design-system/color-system.md`  
> Status: proposed standard. This document defines the canonical color aliases and how to organize color roles/pairings in the repo.

## 1. 原则

颜色系统分三层组织，避免“同一个颜色在不同组件里叫不同名字”：

1. `palette`：唯一的 12 个 hex 颜色候选。这里是事实来源。
2. `roles`：语义用途，例如 `text.primary`、`title.primary`、`accent.primary`、`chart.series1`。role 只能引用 palette alias，不能拥有自己的 hex。
3. `pairings`：被批准的颜色组合和渐变组合。组件只能选 pairings，不应该自己拼 `copyNavy + cyanAccent` 或 `copyNavy + iconCyan`。

组件输入里优先使用 role 或 pairing；底层 renderer 最终都解析到 palette alias。

## 2. Palette：12 个 canonical aliases

| alias | hex | 用途 | 备注 |
|---|---:|---|---|
| `copyNavy` | `#002060` | 正文、bullet、深色说明文字 | 模板明确标注 copywriting 色 |
| `titleIndigo` | `#4E4EA1` | 页面标题、小节标题、稳定标题色 | 不作为正文色大量使用 |
| `white` | `#FFFFFF` | 白色文字、卡片底、浅色描边 | 透明度不在 palette 定义 |
| `neutralSlate` | `#9AA0B5` | 次级说明、图表轴、弱标签 | 只做低优先级信息 |
| `cyanAccent` | `#32DEFF` | 全局唯一主要青色强调 | 取代历史 `cyanCore` / `iconCyan` 分裂命名 |
| `brandViolet` | `#8343FF` | 品牌紫、主强调、渐变端点 | CTA/高亮默认紫色 |
| `brandBlue` | `#3B48F6` | 品牌蓝、数据强调、渐变端点 | 与 brandViolet 配套 |
| `gradientBlue` | `#3064F6` | 紫蓝渐变的蓝端 | 不单独作为正文色 |
| `royalBlue` | `#3E00FF` | 强蓝强调、深色图形 | 少量使用，避免整页过重 |
| `periwinkle` | `#5655FF` | 圆形渐变、辅助数据色 | 常与 lavender 配套 |
| `lavender` | `#9984FF` | 圆形渐变、柔和紫蓝 | 常与 periwinkle 配套 |
| `strokeLavender` | `#A493F4` | 连接线、辅助描边、弱分隔线 | 不用于大面积填充 |

不再保留 `iconCyan` 与 `cyanCore` 两个并列 alias。模板中接近青色的 icon/强调色统一映射到 `cyanAccent`，避免各组件出现不同 cyan 命名。

## 3. Roles：组件应该使用的语义颜色

建议仓库未来组织为：

```text
src/theme/moment2026/foundation/colors/
  palette.ts    # 只放 12 个 hex aliases
  roles.ts      # text/title/accent/icon/chart/surface 的语义映射
  pairings.ts   # 被批准的颜色组合、渐变组合
  README.md
```

Role 示例：

```ts
export const colorRoles = {
  text: {
    primary: "copyNavy",
    secondary: "neutralSlate",
    inverse: "white"
  },
  title: {
    primary: "titleIndigo",
    inverse: "white"
  },
  accent: {
    primary: "brandViolet",
    secondary: "brandBlue",
    cyan: "cyanAccent"
  },
  icon: {
    primary: "brandViolet",
    secondary: "cyanAccent",
    inverse: "white"
  },
  stroke: {
    subtle: "strokeLavender",
    inverse: "white"
  },
  chart: {
    axis: "neutralSlate",
    label: "copyNavy",
    series1: "brandViolet",
    series2: "brandBlue",
    series3: "cyanAccent",
    series4: "lavender",
    series5: "periwinkle"
  }
} as const
```

## 4. Pairings：批准组合

组件不应该自由拼颜色。先使用下列组合：

| pairing alias | text | accent/fill | stroke | 场景 |
|---|---|---|---|---|
| `titleOnLight` | `titleIndigo` | none | none | 常规页面标题 |
| `copyOnLight` | `copyNavy` | none | none | 正文、说明文字 |
| `inverseOnBrand` | `white` | `brandViolet` or `brandBlue` | none | 深色渐变面上的文字/icon |
| `primaryAccent` | `copyNavy` | `brandViolet` | `strokeLavender` | KPI、重点数字、badge |
| `blueAccent` | `copyNavy` | `brandBlue` | `strokeLavender` | 数据高亮、图表强调 |
| `cyanAccentPair` | `copyNavy` | `cyanAccent` | `cyanAccent` | icon 辅助强调、轻量高亮 |
| `softCircle` | `white` | `periwinkle → lavender` | none | 圆形 icon 容器、柔和节点 |
| `brandGradient` | `white` | `brandViolet → brandBlue` | none | 大面积品牌条、深色面板 |
| `chartCategorical` | `copyNavy` | series roles | `neutralSlate` | 图表 series / axis / label |

## 5. 渐变标准

渐变不是任意颜色组合，只允许先注册后使用：

```ts
export const colorPairings = {
  gradients: {
    brandGradient: ["brandViolet", "brandBlue"],
    violetToBlue: ["brandViolet", "gradientBlue"],
    softCircle: ["periwinkle", "lavender"]
  }
} as const
```

默认线性渐变角度：左到右。除非组件明确有方向语义，否则不要让用户自由输入角度。

## 6. 禁止项

- 禁止新增 `iconCyan`、`cyanCore`、`chartCyan` 等同色不同名 alias。
- 禁止组件自己写 hex。
- 禁止把 opacity 写进 palette alias，例如不要创建 `white40`。透明度属于 surface/fill style，等 surface 标准确认后再处理。
- 禁止 title 用 `brandViolet` 代替 `titleIndigo`，除非是品牌大封面或强调词。
