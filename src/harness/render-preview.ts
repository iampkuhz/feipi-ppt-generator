export type PreviewRenderResult = {
  pdfPath?: string;
  previewPaths: string[];
  contactSheetPath?: string;
  warnings: string[];
};

export async function renderPreview(
  _pptxPath: string,
  _outDir: string
): Promise<PreviewRenderResult> {
  return { previewPaths: [], warnings: ['Preview rendering is a stub.'] };
}
