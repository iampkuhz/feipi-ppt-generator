import { renderPreviewCommand } from './render-preview.js';

export function previewCommand() {
  const command = renderPreviewCommand();
  command.name('preview');
  command.description('导出 PPTX 预览；第一版写入占位报告');
  return command;
}
