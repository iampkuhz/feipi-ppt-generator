import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import { templatePackPath } from '../config/paths.js';
import { TemplatePackManifestSchema } from './template-pack.schema.js';
import type { TemplatePackManifest } from './types.js';

export async function loadTemplatePackManifest(templateId: string): Promise<TemplatePackManifest> {
  const source = await readFile(join(templatePackPath(templateId), 'manifest.yaml'), 'utf8');
  return TemplatePackManifestSchema.parse(parse(source));
}
