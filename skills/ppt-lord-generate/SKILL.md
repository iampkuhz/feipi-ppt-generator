# ppt-lord-generate

## Purpose

Turn a brief, data, and assets into a deck spec, validate it, and call the CLI to generate PPTX.

## Workflow

1. Create or update a deck spec using registered slide patterns and components.
2. Use only Layer0 aliases in component props.
3. Run `pnpm validate:examples` or `tsx src/cli/index.ts validate <deck-spec>`.
4. Run `tsx src/cli/index.ts generate <deck-spec> --out <path>`.

## Forbidden

- Do not write free PPT coordinates in business specs.
- Do not use raw colors, font sizes, margins, or radius values.
- Do not reference a specific template identity in core paths.
