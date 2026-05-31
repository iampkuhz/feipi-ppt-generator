import { z } from 'zod';

export const ComponentSpecSchema = z.object({
  type: z.string(),
  version: z.string().optional(),
  props: z.record(z.string(), z.unknown()).default({})
});

export type ComponentSpec = z.infer<typeof ComponentSpecSchema>;
