import type { TemplatePackManifest } from './types.js';

export class TemplatePackRegistry {
  private readonly manifests = new Map<string, TemplatePackManifest>();

  register(manifest: TemplatePackManifest): void {
    this.manifests.set(manifest.id, manifest);
  }

  get(templateId: string): TemplatePackManifest | undefined {
    return this.manifests.get(templateId);
  }
}
