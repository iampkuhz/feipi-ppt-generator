export type RenderWarning = {
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  slideId?: string;
  componentType?: string;
};

export function warning(
  code: string,
  message: string,
  extra: Partial<RenderWarning> = {}
): RenderWarning {
  return { code, message, severity: 'warning', ...extra };
}
