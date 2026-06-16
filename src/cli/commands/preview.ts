import { renderPreviewCommand } from './render-preview.js';

export function previewCommand() {
  const command = renderPreviewCommand();
  command.name('preview');
  command.description('导出 PPTX 结构预览报告');
  return command;
}
