export type TemplatePackManifest = {
  id: string;
  name: string;
  version: string;
  slideSize?: {
    ratio: string;
    widthInch: number;
    heightInch: number;
  };
};
