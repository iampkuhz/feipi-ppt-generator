import { defaultFoundation, type DefaultFoundation } from '../foundation/default.foundation.js';

export class FoundationRegistry {
  private readonly foundations = new Map<string, DefaultFoundation>();

  constructor() {
    this.register(defaultFoundation.id, defaultFoundation);
  }

  register(id: string, foundation: DefaultFoundation): void {
    if (this.foundations.has(id)) {
      throw new Error(`Foundation already registered: ${id}`);
    }
    this.foundations.set(id, foundation);
  }

  get(id: string): DefaultFoundation {
    const foundation = this.foundations.get(id);
    if (!foundation) {
      throw new Error(`Unknown foundation: ${id}`);
    }
    return foundation;
  }

  list(): string[] {
    return [...this.foundations.keys()];
  }
}

export const defaultFoundationRegistry = new FoundationRegistry();
