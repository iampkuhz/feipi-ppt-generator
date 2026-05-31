import { defaultFoundation } from '../foundation/default.foundation.js';

export class ThemeResolver {
  color(alias = 'inkPrimary'): string {
    const value = defaultFoundation.colors[alias as keyof typeof defaultFoundation.colors]?.value;
    return value
      ? value.replace('#', '')
      : defaultFoundation.colors.inkPrimary.value.replace('#', '');
  }

  fontSize(alias = 'body'): number {
    return (
      defaultFoundation.typography[alias as keyof typeof defaultFoundation.typography]?.pt ?? 12
    );
  }
}
