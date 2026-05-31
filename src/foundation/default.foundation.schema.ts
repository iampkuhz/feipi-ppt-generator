import { z } from 'zod';

const AliasValueSchema = z.record(z.string(), z.unknown());

export const StyleFoundationSchema = z.object({
  id: z.string(),
  typography: z.record(AliasValueSchema),
  colors: z.record(AliasValueSchema),
  spacing: z.record(AliasValueSchema),
  radius: z.record(AliasValueSchema),
  strokes: z.record(AliasValueSchema),
  shadows: z.record(AliasValueSchema),
  surfaces: z.record(AliasValueSchema),
  iconSizes: z.record(AliasValueSchema).optional(),
  dataColors: z.record(AliasValueSchema),
  chartColors: z.record(AliasValueSchema).optional(),
  mediaPlaceholders: z.record(AliasValueSchema).optional(),
  progressRings: z.record(AliasValueSchema),
  axisGridlines: z.record(AliasValueSchema)
});

export type StyleFoundation = z.infer<typeof StyleFoundationSchema>;
