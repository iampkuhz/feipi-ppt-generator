export type PptxInspection = {
  slideCount?: number;
  slideSize?: string;
  missingImages: string[];
  unsupportedMedia: string[];
  unknownFonts: string[];
  outOfBoundsShapes: string[];
};

export async function inspectPptx(_pptxPath: string): Promise<PptxInspection> {
  return {
    missingImages: [],
    unsupportedMedia: [],
    unknownFonts: [],
    outOfBoundsShapes: []
  };
}
