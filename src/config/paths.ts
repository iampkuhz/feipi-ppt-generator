import { join } from 'node:path';
import { loadEnv } from './env.js';

export function templatePackPath(templateId: string): string {
  return join(loadEnv().templateRoot, templateId);
}

export function qualityPath(changeId: string): string {
  return join(loadEnv().tmpRoot, 'quality', changeId);
}
