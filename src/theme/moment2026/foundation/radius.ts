/**
 * Moment2026 Radius Foundation
 *
 * 5 个圆角别名。删除 sharp、tag 等不必要 alias。
 * 不允许用户或组件自由输入任意圆角数值。
 */

export const radii = {
  smRadius:     { px: 4,  usage: '小型短标签、小色块、紧凑容器' },
  mdRadius:     { px: 12, usage: '默认卡片、图表容器、内容模块' },
  lgRadius:     { px: 24, usage: '大面积面板、section card、视觉主容器' },
  pillRadius:   { px: 9999, usage: '胶囊标签、状态标签、短 badge、进度条' },
  circleRadius: { px: '50%' as const, usage: '正圆容器：头像、icon 圆容器、圆形节点' }
} as const;

export type RadiusAlias = keyof typeof radii;
