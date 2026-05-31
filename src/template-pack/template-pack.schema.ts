import { z } from 'zod';

export const TemplatePackManifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  slideSize: z
    .object({
      ratio: z.string(),
      widthInch: z.number(),
      heightInch: z.number()
    })
    .optional()
});
