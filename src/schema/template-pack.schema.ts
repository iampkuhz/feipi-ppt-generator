import { z } from 'zod';

export const TemplatePackManifestSchema = z.object({
  templateId: z.string(),
  source: z.string(),
  slideSize: z.object({
    type: z.enum(['wide-16-9', 'standard-4-3']),
    widthIn: z.number(),
    heightIn: z.number()
  }),
  assets: z.object({
    backgrounds: z.array(z.string()).default([]),
    icons: z.array(z.string()).default([]),
    images: z.array(z.string()).default([])
  }),
  candidatePatterns: z.array(z.string()).default([]),
  candidateComponents: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([])
});

export type TemplatePackManifest = z.infer<typeof TemplatePackManifestSchema>;
