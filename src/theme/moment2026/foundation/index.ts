/**
 * Moment2026 Layer0 Style Foundation 常量入口
 *
 * 只放稳定常量：typography、colors、spacing、radius。
 * surface 不在此模块，详见 docs/design-system/surface-audit.md。
 */

export { typeScale, fontFamily } from './typography.js';
export type { TypographyAlias, TypeScaleEntry } from './typography.js';

export { palette, colorRoles, colorPairings } from './colors.js';
export type { PaletteAlias, GradientName } from './colors.js';

export { pageMargins, internalGaps } from './spacing.js';
export type { MarginAlias, GapAlias } from './spacing.js';

export { radii } from './radius.js';
export type { RadiusAlias } from './radius.js';
