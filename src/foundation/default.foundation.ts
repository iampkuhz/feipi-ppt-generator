/**
 * Moment2026 Layer0 Style Foundation 常量
 *
 * 本文件定义视觉基准层的稳定常量：字号、颜色、间距、圆角。
 * surface 不在此文件定义，详见 docs/design-system/surface-audit.md。
 */

// ---------------------------------------------------------------------------
// Typography：7 个标准字号，禁止 30pt
// ---------------------------------------------------------------------------

export const typeScale = {
  microLabel:   { latexAlias: 'tiny',       pt: 6,  usage: '极小标签、图表细标注' },
  captionLabel: { latexAlias: 'scriptsize',  pt: 8,  usage: 'icon caption、badge、图例、短标签' },
  supportText:  { latexAlias: 'footnotesize',pt: 10, usage: 'KPI 说明、小卡片正文、二级说明' },
  bodyText:     { latexAlias: 'small',       pt: 12, usage: '正文、bullet、段落说明' },
  subtitleText: { latexAlias: 'normalsize',  pt: 16, usage: 'subtitle、指标值、小节标题' },
  pageTitle:    { latexAlias: 'large',       pt: 20, usage: '常规页面标题、模块标题' },
  heroTitle:    { latexAlias: 'Large',       pt: 32, usage: '章节页标题、结束页、hero 文字' }
} as const;

// ---------------------------------------------------------------------------
// Colors：12 个 canonical palette aliases
// ---------------------------------------------------------------------------

export const colors = {
  copyNavy:       { hex: '#002060', usage: '正文、bullet、深色说明文字' },
  titleIndigo:    { hex: '#4E4EA1', usage: '页面标题、小节标题、稳定标题色' },
  white:          { hex: '#FFFFFF', usage: '白色文字、卡片底、浅色描边' },
  neutralSlate:   { hex: '#9AA0B5', usage: '次级说明、图表轴、弱标签' },
  cyanAccent:     { hex: '#32DEFF', usage: '全局唯一主要青色强调' },
  brandViolet:    { hex: '#8343FF', usage: '品牌紫、主强调、渐变端点' },
  brandBlue:      { hex: '#3B48F6', usage: '品牌蓝、数据强调、渐变端点' },
  gradientBlue:   { hex: '#3064F6', usage: '紫蓝渐变的蓝端' },
  royalBlue:      { hex: '#3E00FF', usage: '强蓝强调、深色图形' },
  periwinkle:     { hex: '#5655FF', usage: '圆形渐变、辅助数据色' },
  lavender:       { hex: '#9984FF', usage: '圆形渐变、柔和紫蓝' },
  strokeLavender: { hex: '#A493F4', usage: '连接线、辅助描边、弱分隔线' }
} as const;

// 颜色角色映射（语义层，引用 palette alias）
export const colorRoles = {
  text: {
    primary: 'copyNavy' as const,
    secondary: 'neutralSlate' as const,
    inverse: 'white' as const
  },
  title: {
    primary: 'titleIndigo' as const,
    inverse: 'white' as const
  },
  accent: {
    primary: 'brandViolet' as const,
    secondary: 'brandBlue' as const,
    cyan: 'cyanAccent' as const
  },
  icon: {
    primary: 'brandViolet' as const,
    secondary: 'cyanAccent' as const,
    inverse: 'white' as const
  },
  stroke: {
    subtle: 'strokeLavender' as const,
    inverse: 'white' as const
  },
  chart: {
    axis: 'neutralSlate' as const,
    label: 'copyNavy' as const,
    series1: 'brandViolet' as const,
    series2: 'brandBlue' as const,
    series3: 'cyanAccent' as const,
    series4: 'lavender' as const,
    series5: 'periwinkle' as const
  }
} as const;

// 批准的颜色组合与渐变
export const colorPairings = {
  gradients: {
    brandGradient:  ['brandViolet', 'brandBlue'] as const,
    violetToBlue:   ['brandViolet', 'gradientBlue'] as const,
    softCircle:     ['periwinkle', 'lavender'] as const
  },
  pairings: {
    titleOnLight:    { text: 'titleIndigo' as const, accent: null, stroke: null, usage: '常规页面标题' },
    copyOnLight:     { text: 'copyNavy' as const, accent: null, stroke: null, usage: '正文、说明文字' },
    inverseOnBrand:  { text: 'white' as const, accent: 'brandViolet' as const, stroke: null, usage: '深色渐变面上的文字/icon' },
    primaryAccent:   { text: 'copyNavy' as const, accent: 'brandViolet' as const, stroke: 'strokeLavender' as const, usage: 'KPI、重点数字、badge' },
    blueAccent:      { text: 'copyNavy' as const, accent: 'brandBlue' as const, stroke: 'strokeLavender' as const, usage: '数据高亮、图表强调' },
    cyanAccentPair:  { text: 'copyNavy' as const, accent: 'cyanAccent' as const, stroke: 'cyanAccent' as const, usage: 'icon 辅助强调、轻量高亮' },
    softCircle:      { text: 'white' as const, accent: 'periwinkle' as const, stroke: null, usage: '圆形 icon 容器、柔和节点' },
    brandGradient:   { text: 'white' as const, accent: 'brandViolet' as const, stroke: null, usage: '大面积品牌条、深色面板' }
  }
} as const;

// ---------------------------------------------------------------------------
// Spacing：page margins + internal gaps，全部为 4px 倍数
// 不保留 bleedMargin（全屏背景由 background/image primitive fit:cover 处理）
// ---------------------------------------------------------------------------

export const spacing = {
  // Page margins
  tightMargin:   { px: 48,  inch: 0.30,  usage: '高密度 icon wall、表格、图表页' },
  compactMargin: { px: 64,  inch: 0.40,  usage: '常规商务内容页，信息较多时使用' },
  safeMargin:    { px: 96,  inch: 0.60,  usage: '默认安全区，推荐大多数页面使用' },
  wideMargin:    { px: 128, inch: 0.80,  usage: '封面、章节页、图片页、留白较大的页面' },

  // Internal gaps
  hairGap: { px: 4,  inch: 0.025, usage: '极小分隔、图例内部' },
  xsGap:   { px: 8,  inch: 0.05,  usage: 'badge/icon 与文字的紧密间距' },
  smGap:   { px: 12, inch: 0.075, usage: '小卡片内部元素间距' },
  mdGap:   { px: 16, inch: 0.10,  usage: '默认组件 gap' },
  lgGap:   { px: 24, inch: 0.15,  usage: '卡片之间、图表与说明之间' },
  xlGap:   { px: 32, inch: 0.20,  usage: '大区块之间' }
} as const;

// ---------------------------------------------------------------------------
// Radii：不超过 5 个，删除 sharp/tag 等过细 alias
// ---------------------------------------------------------------------------

export const radii = {
  smRadius:     { px: 4,  usage: '小型短标签、小色块、紧凑容器' },
  mdRadius:     { px: 12, usage: '默认卡片、图表容器、内容模块' },
  lgRadius:     { px: 24, usage: '大面积面板、section card、视觉主容器' },
  pillRadius:   { px: 9999, usage: '胶囊标签、状态标签、短 badge、进度条' },
  circleRadius: { px: '50%' as const, usage: '正圆容器：头像、icon 圆容器、圆形节点' }
} as const;

// ---------------------------------------------------------------------------
// 默认值
// ---------------------------------------------------------------------------

export const spacingDefaults = {
  pageMargin: {
    default: 'safeMargin' as const,
    dense:   'compactMargin' as const,
    iconWall:'tightMargin' as const,
    hero:    'wideMargin' as const
  }
} as const;

export const radiusDefaults = {
  smallBadge: 'pillRadius' as const,
  smallSwatch:'smRadius' as const,
  card:       'mdRadius' as const,
  largePanel: 'lgRadius' as const,
  avatar:     'circleRadius' as const,
  iconBubble: 'circleRadius' as const
} as const;

// ---------------------------------------------------------------------------
// 聚合导出
// ---------------------------------------------------------------------------

export const defaultFoundation = {
  id: 'default',
  typography: typeScale,
  colors,
  colorRoles,
  colorPairings,
  spacing,
  radius: radii
} as const;

export type DefaultFoundation = typeof defaultFoundation;
export type TypographyAlias = keyof typeof typeScale;
export type ColorAlias = keyof typeof colors;
export type SpacingAlias = keyof typeof spacing;
export type RadiusAlias = keyof typeof radii;
