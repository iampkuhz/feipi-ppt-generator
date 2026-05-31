# Layer Model

## Layer0: Style Foundation

Defines legal visual aliases and default rules: typography, colors, spacing, radius, surfaces, strokes, shadows, icons, background assets, data colors, progress ring stroke presets, and axis/gridline defaults.

Layer0 does not draw PPT shapes, carry business text, define charts, define page layouts, or compose components.

Emoji is not a default icon style. If a user explicitly needs emoji inside a shape, it must be text in the same AutoShape with centered horizontal and vertical alignment, zero internal margin, and renderer-owned optical correction. Emoji font metrics differ across systems, so exact centering can vary.

Layer0 keeps only data aliases and basic chart defaults. Chart components, legends, labels, and chart cards belong to higher layers.

## Layer1: Drawing Primitives

Smallest PPT drawing objects: `TextPrimitive`, `ShapePrimitive`, `LinePrimitive`, `IconPrimitive`, `ImagePrimitive`, `ChartPrimitive`, and `MediaPlaceholderPrimitive`.

## Layer2: Semantic Atoms

Small semantic elements: `PageTitle`, `SectionHeader`, `Subtitle`, `BadgePill`, `IconLabel`, `SurfaceCard`, `MetricBlock`, `BulletList`, `PictureCaption`, and `LegendItem`.

## Layer3: Composite Blocks

Reusable blocks assembled from atoms: `IconGrid`, `KpiStrip`, `ChartCard`, `ProcessLoop`, `PictureGrid`, `LogoWall`, `ComparisonMatrix`, and `SummaryPanel`.

## Layer4: Slide Patterns

Whole-slide structures: `CoverSlide`, `SectionSlide`, `TitleContentSlide`, `IconGridSlide`, `DashboardSlide`, `ChartSlide`, `PictureGridSlide`, `ComparisonSlide`, `SummarySlide`, and `ThankYouSlide`.

## Layer5: Deck Recipes

Deck-level narratives: `businessReportRecipe`, `salesDeckRecipe`, `researchReportRecipe`, `productLaunchRecipe`, `projectReviewRecipe`, and `proposalRecipe`.
