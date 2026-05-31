import type { ComponentSpec } from '../schema/component.schema.js';
import { defaultComponentRegistry } from './component-registry.js';

export function validateComponentSpec(component: ComponentSpec): void {
  defaultComponentRegistry.validate(component);
}
