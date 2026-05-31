export type OverflowWarning = {
  slide: number;
  shapeId?: string;
  message: string;
};

export async function checkTextOverflow(_pptxPath: string): Promise<OverflowWarning[]> {
  return [];
}
