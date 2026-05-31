/**
 * Moment2026 Spacing Foundation
 *
 * Page margins 和 internal gaps，全部为 4px 倍数。
 * 不保留 bleedMargin（全屏背景由 background/image primitive fit:cover 处理）。
 */

export const pageMargins = {
  tightMargin:   { px: 48,  inch: 0.30 as const, usage: '高密度 icon wall、表格、图表页' },
  compactMargin: { px: 64,  inch: 0.40 as const, usage: '常规商务内容页，信息较多时使用' },
  safeMargin:    { px: 96,  inch: 0.60 as const, usage: '默认安全区，推荐大多数页面使用' },
  wideMargin:    { px: 128, inch: 0.80 as const, usage: '封面、章节页、图片页、留白较大的页面' }
} as const;

export const internalGaps = {
  hairGap: { px: 4,  inch: 0.025 as const, usage: '极小分隔、图例内部' },
  xsGap:   { px: 8,  inch: 0.05 as const,  usage: 'badge/icon 与文字的紧密间距' },
  smGap:   { px: 12, inch: 0.075 as const, usage: '小卡片内部元素间距' },
  mdGap:   { px: 16, inch: 0.10 as const,  usage: '默认组件 gap' },
  lgGap:   { px: 24, inch: 0.15 as const,  usage: '卡片之间、图表与说明之间' },
  xlGap:   { px: 32, inch: 0.20 as const,  usage: '大区块之间' }
} as const;

export type MarginAlias = keyof typeof pageMargins;
export type GapAlias = keyof typeof internalGaps;
