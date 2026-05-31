import { defaultIconRegistry } from '../foundation/default.icons.js';

export class AssetResolver {
  icon(id: string): string | undefined {
    return defaultIconRegistry.find((entry) => entry.id === id)?.file;
  }
}
