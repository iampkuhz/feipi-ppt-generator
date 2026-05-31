import type { DeckSpec } from '../schema/deck.schema.js';
import { defaultFoundation } from '../foundation/default.foundation.js';
import { defaultIconRegistry } from '../foundation/default.icons.js';

export type TokenLintWarning = {
  code: string;
  message: string;
  path: string;
};

export type TokenLintResult = {
  warnings: TokenLintWarning[];
};

const rawHexPattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
const visualNumberKeys = new Set(['pt', 'fontSize', 'radius', 'margin', 'gap', 'padding']);

export function lintDeckTokens(deck: DeckSpec): TokenLintResult {
  const warnings: TokenLintWarning[] = [];
  deck.slides.forEach((slide, slideIndex) => {
    slide.components.forEach((component, componentIndex) => {
      inspectValue(
        component.props,
        `slides.${slideIndex}.components.${componentIndex}.props`,
        warnings
      );
    });
  });
  return { warnings };
}

function inspectValue(value: unknown, path: string, warnings: TokenLintWarning[]): void {
  if (typeof value === 'string') {
    if (rawHexPattern.test(value)) {
      warnings.push({ code: 'raw_hex', message: `Raw hex color is not allowed at ${path}`, path });
    }
    if (path.endsWith('.color') && !(value in defaultFoundation.colors)) {
      warnings.push({
        code: 'unknown_color',
        message: `Unknown color alias at ${path}: ${value}`,
        path
      });
    }
    if (
      (path.endsWith('.size') || path.endsWith('.font')) &&
      !(value in defaultFoundation.typography)
    ) {
      warnings.push({
        code: 'unknown_typography',
        message: `Unknown typography alias at ${path}: ${value}`,
        path
      });
    }
    if (path.endsWith('.surface') && !(value in defaultFoundation.surfaces)) {
      warnings.push({
        code: 'unknown_surface',
        message: `Unknown surface alias at ${path}: ${value}`,
        path
      });
    }
    if (path.endsWith('.radius') && !(value in defaultFoundation.radius)) {
      warnings.push({
        code: 'unknown_radius',
        message: `Unknown radius alias at ${path}: ${value}`,
        path
      });
    }
    if (path.endsWith('.icon') && !defaultIconRegistry.some((icon) => icon.id === value)) {
      warnings.push({
        code: 'unknown_icon',
        message: `Unknown icon id at ${path}: ${value}`,
        path
      });
    }
    return;
  }

  if (typeof value === 'number') {
    const lastKey = path.split('.').at(-1) ?? '';
    if (visualNumberKeys.has(lastKey)) {
      warnings.push({
        code: 'raw_number',
        message: `Raw visual number is not allowed at ${path}`,
        path
      });
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => inspectValue(item, `${path}.${index}`, warnings));
    return;
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, child]) =>
      inspectValue(child, `${path}.${key}`, warnings)
    );
  }
}
