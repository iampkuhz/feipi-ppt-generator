import { z } from 'zod';

export const RenderWarningSchema = z.object({
  code: z.string(),
  message: z.string(),
  severity: z.enum(['info', 'warning', 'error']).default('warning'),
  slideId: z.string().optional(),
  componentType: z.string().optional()
});

export const RenderResultSchema = z.object({
  pptxPath: z.string(),
  pdfPath: z.string().optional(),
  previewPaths: z.array(z.string()).optional(),
  warnings: z.array(RenderWarningSchema),
  reportPath: z.string().optional()
});

export type RenderWarning = z.infer<typeof RenderWarningSchema>;
export type RenderResult = z.infer<typeof RenderResultSchema>;
