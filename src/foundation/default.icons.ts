export type IconRegistryEntry = {
  id: string;
  source: string;
  file: string;
  tags: string[];
  style: string;
  description?: string;
};

export const defaultIconRegistry: IconRegistryEntry[] = [
  {
    id: 'icon.placeholder',
    source: 'template-pack-placeholder',
    file: 'assets/templates/default/icons/placeholder.svg',
    style: 'template-pack-icons',
    tags: ['placeholder'],
    description: 'Placeholder entry used until a template pack provides real icons.'
  }
];
