import { defaultFoundation } from '../foundation/default.foundation.js';

export class ThemeResolver {
  fontFace(): string {
    return 'Poppins';
  }

  color(alias = 'copyNavy'): string {
    const entry = defaultFoundation.colors[alias as keyof typeof defaultFoundation.colors];
    return entry?.hex?.replace('#', '') ?? defaultFoundation.colors.copyNavy.hex.replace('#', '');
  }

  fontSize(alias = 'bodyText'): number {
    return (
      defaultFoundation.typography[alias as keyof typeof defaultFoundation.typography]?.pt ?? 12
    );
  }

  rectRadius(alias = 'mdRadius'): number {
    if (alias === 'smRadius') return 0.02;
    if (alias === 'mdRadius') return 0.08;
    if (alias === 'lgRadius') return 0.16;
    if (alias === 'pillRadius') return 0.45;
    return 0.08;
  }
}
