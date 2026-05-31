/**
 * Moment2026 Color Foundation
 *
 * 12 个 canonical palette aliases。
 * 组件、页面、agent prompt 后续只能引用 alias，不得直接写 hex。
 * 包含 palette、roles 和 pairings 三层组织。
 */

// ---------------------------------------------------------------------------
// Palette：12 个唯一颜色别名
// ---------------------------------------------------------------------------

export const palette = {
  copyNavy:       '#002060' as const,
  titleIndigo:    '#4E4EA1' as const,
  white:          '#FFFFFF' as const,
  neutralSlate:   '#9AA0B5' as const,
  cyanAccent:     '#32DEFF' as const,
  brandViolet:    '#8343FF' as const,
  brandBlue:      '#3B48F6' as const,
  gradientBlue:   '#3064F6' as const,
  royalBlue:      '#3E00FF' as const,
  periwinkle:     '#5655FF' as const,
  lavender:       '#9984FF' as const,
  strokeLavender: '#A493F4' as const
} as const;

export type PaletteAlias = keyof typeof palette;

// ---------------------------------------------------------------------------
// Roles：语义用途，引用 palette alias
// ---------------------------------------------------------------------------

export const colorRoles = {
  text: {
    primary: 'copyNavy' as PaletteAlias,
    secondary: 'neutralSlate' as PaletteAlias,
    inverse: 'white' as PaletteAlias
  },
  title: {
    primary: 'titleIndigo' as PaletteAlias,
    inverse: 'white' as PaletteAlias
  },
  accent: {
    primary: 'brandViolet' as PaletteAlias,
    secondary: 'brandBlue' as PaletteAlias,
    cyan: 'cyanAccent' as PaletteAlias
  },
  icon: {
    primary: 'brandViolet' as PaletteAlias,
    secondary: 'cyanAccent' as PaletteAlias,
    inverse: 'white' as PaletteAlias
  },
  stroke: {
    subtle: 'strokeLavender' as PaletteAlias,
    inverse: 'white' as PaletteAlias
  },
  chart: {
    axis: 'neutralSlate' as PaletteAlias,
    label: 'copyNavy' as PaletteAlias,
    series1: 'brandViolet' as PaletteAlias,
    series2: 'brandBlue' as PaletteAlias,
    series3: 'cyanAccent' as PaletteAlias,
    series4: 'lavender' as PaletteAlias,
    series5: 'periwinkle' as PaletteAlias
  }
} as const;

// ---------------------------------------------------------------------------
// Pairings：批准的颜色组合
// ---------------------------------------------------------------------------

export const colorPairings = {
  gradients: {
    brandGradient: ['brandViolet', 'brandBlue'] as const,
    violetToBlue: ['brandViolet', 'gradientBlue'] as const,
    softCircle: ['periwinkle', 'lavender'] as const
  }
} as const;

export type GradientName = keyof typeof colorPairings.gradients;
