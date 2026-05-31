import { defaultFoundation } from '../foundation/default.foundation.js';

export class ThemeResolver {
  color(alias = 'copyNavy'): string {
    const entry = defaultFoundation.colors[alias as keyof typeof defaultFoundation.colors];
    return entry?.hex?.replace('#', '') ?? defaultFoundation.colors.copyNavy.hex.replace('#', '');
  }

  fontSize(alias = 'bodyText'): number {
    return (
      defaultFoundation.typography[alias as keyof typeof defaultFoundation.typography]?.pt ?? 12
    );
  }
}
