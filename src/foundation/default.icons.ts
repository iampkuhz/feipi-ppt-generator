export type IconRegistryEntry = {
  id: string;
  source: string;
  file: string;
  tags: string[];
  style: string;
  defaultColor?: string;
  defaultSize?: string;
  description?: string;
};

export const defaultIconRegistry: IconRegistryEntry[] = [
  {
    id: 'icon.placeholder',
    source: 'assets/templates/default/extracted/icons/placeholder.svg',
    file: 'assets/templates/default/icons/placeholder.svg',
    style: 'template-pack-icons',
    tags: ['占位', '默认'],
    defaultColor: 'accentCyan',
    defaultSize: 'iconMD',
    description: '默认模板包的占位 icon，用于真实模板包接入前的渲染 smoke path。'
  }
];
