# Component Registry

Every component must be registered with type, version, layer, status, props schema, examples, description, and limitations when useful.

The registry supports:

- `register(entry)`
- `get(type)`
- `list()`
- `validate(componentSpec)`

Agents and runtime code must not bypass the registry to write free PPT shapes.
