export const typeScale = {
  microLabel: { latexAlias: 'tiny', pt: 6, usage: '极小标签、图表细标注' },
  caption: { latexAlias: 'scriptsize', pt: 8, usage: '图标标题、徽章、小注释' },
  bodySmall: { latexAlias: 'footnotesize', pt: 10, usage: '短正文、指标说明' },
  body: { latexAlias: 'normalsize', pt: 12, usage: '正文、列表、说明文字' },
  subtitle: { latexAlias: 'large', pt: 16, usage: '副标题、重要短语、指标值' },
  title: { latexAlias: 'Large', pt: 20, usage: '页面标题、模块标题' },
  hero: { latexAlias: 'huge', pt: 30, usage: '封面主标题、大 headline' },
  sectionHero: { latexAlias: 'Huge', pt: 32, usage: '章节页主标题、总结句' },
  micro: { latexAlias: 'tiny', pt: 6, usage: '兼容旧示例：极小标签' },
  note: { latexAlias: 'footnotesize', pt: 10, usage: '兼容旧示例：说明文字' },
  lead: { latexAlias: 'large', pt: 16, usage: '兼容旧示例：强调短语' },
  headline: { latexAlias: 'huge', pt: 30, usage: '兼容旧示例：封面标题' },
  display: { latexAlias: 'Huge', pt: 32, usage: '兼容旧示例：大结论句' }
} as const;

export const colors = {
  inkPrimary: { hex: '#111827', value: '#111827', usage: '主正文、深色标题' },
  inkSecondary: { hex: '#64748B', value: '#64748B', usage: '辅助说明' },
  accentPrimary: { hex: '#4F46E5', value: '#4F46E5', usage: '主强调、标题强调' },
  accentBlue: { hex: '#2563EB', value: '#2563EB', usage: '蓝色强调' },
  accentViolet: { hex: '#7C3AED', value: '#7C3AED', usage: '紫色强调' },
  accentCyan: { hex: '#06B6D4', value: '#06B6D4', usage: '青色强调、icon 默认色' },
  surfaceWhite: { hex: '#FFFFFF', value: '#FFFFFF', usage: '白色卡面' },
  surfacePale: { hex: '#F8FAFC', value: '#F8FAFC', usage: '浅色背景' },
  lineMuted: { hex: '#CBD5E1', value: '#CBD5E1', usage: '弱描边、网格线' },
  surfacePrimary: { hex: '#FFFFFF', value: '#FFFFFF', usage: '兼容旧示例：默认卡面' },
  surfaceMuted: { hex: '#F3F6FA', value: '#F3F6FA', usage: '兼容旧示例：弱背景' },
  accentSecondary: { hex: '#06B6D4', value: '#06B6D4', usage: '兼容旧示例：次强调' },
  lineDefault: { hex: '#D8E0EA', value: '#D8E0EA', usage: '兼容旧示例：默认线条' },
  lineAccent: { hex: '#A5B4FC', value: '#A5B4FC', usage: '兼容旧示例：强调线条' }
} as const;

export const spacing = {
  marginNone: { inch: 0, usage: '全出血背景' },
  marginHairline: { inch: 0.08, usage: '内部微间距' },
  marginTight: { inch: 0.2, usage: '高密度信息页' },
  marginCompact: { inch: 0.35, usage: '信息密集页' },
  marginDefault: { inch: 0.55, usage: '默认页面安全区' },
  marginRelaxed: { inch: 0.75, usage: '图片、卡片、章节页' },
  marginWide: { inch: 1.0, usage: '封面、留白型页面' },
  gapXS: { inch: 0.06, usage: '组内极小间距' },
  gapSM: { inch: 0.1, usage: '标签和小 icon 间距' },
  gapMD: { inch: 0.16, usage: '默认组件间距' },
  gapLG: { inch: 0.24, usage: '卡片间距' },
  gapXL: { inch: 0.36, usage: '大模块间距' }
} as const;

export const radii = {
  radiusNone: { px: 0, usage: '表格、图表、硬边容器' },
  radiusXS: { px: 4, usage: '小标签、细分隔块' },
  radiusSM: { px: 8, usage: '小徽章、小卡片' },
  radiusMD: { px: 14, usage: '默认卡片' },
  radiusLG: { px: 20, usage: '玻璃卡、图表卡' },
  radiusXL: { px: 30, usage: '大面积 hero 卡片' },
  radiusPill: { px: 999, usage: '胶囊标签' },
  radiusCircle: { px: '50%', usage: '头像、icon 圆容器' },
  none: { px: 0, usage: '兼容旧示例：硬边容器' },
  xs: { px: 4, usage: '兼容旧示例：小标签' },
  sm: { px: 8, usage: '兼容旧示例：小卡片' },
  md: { px: 14, usage: '兼容旧示例：默认卡片' },
  lg: { px: 20, usage: '兼容旧示例：大卡片' },
  xl: { px: 30, usage: '兼容旧示例：大面积容器' },
  pill: { px: 999, usage: '兼容旧示例：胶囊' },
  circle: { px: '50%', usage: '兼容旧示例：圆形容器' }
} as const;

export const strokes = {
  strokeNone: { color: 'transparent', widthPt: 0, usage: '无描边' },
  strokeThin: { color: 'lineMuted', widthPt: 0.75, usage: '默认细描边' },
  strokeAccent: { color: 'accentPrimary', widthPt: 1.25, usage: '强调描边' },
  none: { color: 'transparent', widthPt: 0, usage: '兼容旧示例：无描边' },
  thin: { color: 'lineDefault', widthPt: 0.75, usage: '兼容旧示例：细描边' },
  accent: { color: 'lineAccent', widthPt: 1.25, usage: '兼容旧示例：强调描边' }
} as const;

export const shadows = {
  shadowNone: { usage: '无阴影' },
  shadowSoft: { opacity: 0.16, blur: 8, distance: 2, usage: '轻微浮起阴影' },
  none: { usage: '兼容旧示例：无阴影' },
  soft: { opacity: 0.16, blur: 8, distance: 2, usage: '兼容旧示例：轻阴影' }
} as const;

export const surfaces = {
  surfacePlain: {
    fill: 'surfaceWhite',
    stroke: 'lineMuted',
    shadow: 'shadowNone',
    usage: '白色普通卡面'
  },
  surfaceMuted: {
    fill: 'surfacePale',
    stroke: 'lineMuted',
    shadow: 'shadowNone',
    usage: '浅色背景模块'
  },
  surfaceGlass: {
    fill: 'surfaceWhite',
    opacity: 0.88,
    stroke: 'surfaceWhite',
    shadow: 'shadowSoft',
    usage: '半透明亮色卡面'
  },
  surfaceOutline: {
    fill: 'transparent',
    stroke: 'accentPrimary',
    shadow: 'shadowNone',
    usage: '仅描边容器'
  }
} as const;

export const iconSizes = {
  iconXS: { pt: 10, usage: '极小辅助 icon' },
  iconSM: { pt: 14, usage: '行内 icon' },
  iconMD: { pt: 20, usage: '默认 icon' },
  iconLG: { pt: 28, usage: '卡片主 icon' },
  iconXL: { pt: 40, usage: '章节或封面 icon' }
} as const;

export const chartColors = {
  dataPrimary: { color: 'accentPrimary', usage: '主数据系列' },
  dataSecondary: { color: 'accentCyan', usage: '次数据系列' },
  dataBlue: { color: 'accentBlue', usage: '蓝色数据系列' },
  dataViolet: { color: 'accentViolet', usage: '紫色数据系列' },
  dataMuted: { color: 'inkSecondary', usage: '弱化对比数据' }
} as const;

export const mediaPlaceholders = {
  mediaEmpty: { surface: 'surfaceMuted', icon: 'icon.placeholder', usage: '缺省媒体占位' },
  imagePlaceholder: { surface: 'surfacePlain', icon: 'icon.placeholder', usage: '图片占位' }
} as const;

export const progressRingStrokePresets = {
  default: { track: 'lineMuted', value: 'accentPrimary', width: 'strokeThin' }
} as const;

export const axisGridlineAliases = {
  axisDefault: { color: 'lineMuted', width: 'strokeThin' },
  gridlineDefault: { color: 'lineMuted', width: 'strokeThin' }
} as const;

export const defaultFoundation = {
  id: 'default',
  typography: typeScale,
  colors,
  spacing,
  radius: radii,
  strokes,
  shadows,
  surfaces,
  iconSizes,
  dataColors: chartColors,
  chartColors,
  mediaPlaceholders,
  progressRings: progressRingStrokePresets,
  axisGridlines: axisGridlineAliases
} as const;

export type DefaultFoundation = typeof defaultFoundation;
export type TypographyAlias = keyof typeof typeScale;
export type ColorAlias = keyof typeof colors;
export type SpacingAlias = keyof typeof spacing;
export type RadiusAlias = keyof typeof radii;
export type SurfaceAlias = keyof typeof surfaces;
