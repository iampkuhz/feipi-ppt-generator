export type TemplatePackRef = {
  id: string;
  rootDir: string;
};

export class TemplatePackRegistry {
  private readonly packs = new Map<string, TemplatePackRef>();

  register(pack: TemplatePackRef): void {
    if (this.packs.has(pack.id)) {
      throw new Error(`Template pack already registered: ${pack.id}`);
    }
    this.packs.set(pack.id, pack);
  }

  get(id: string): TemplatePackRef {
    const pack = this.packs.get(id);
    if (!pack) {
      throw new Error(`Unknown template pack: ${id}`);
    }
    return pack;
  }

  list(): TemplatePackRef[] {
    return [...this.packs.values()];
  }
}
