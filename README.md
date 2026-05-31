# ppt-lord

`ppt-lord` is a generic, schema-driven PowerPoint generation framework. It turns deck briefs and slide specs into registered component trees, resolves them through a style foundation, renders PPTX files, and leaves room for preview and QA checks.

## Architecture overview

The core package owns schema validation, the component registry, the renderer interface, template pack loading, and QA harness entry points. Template packs are plugins that provide aliases and assets; they are not the identity of the core repository.

## Layer model

1. Layer0 Style Foundation: typography, color, spacing, radius, surface, stroke, shadow, icon, and data aliases.
2. Layer1 Drawing Primitives: smallest PPT drawing objects.
3. Layer2 Semantic Atoms: titles, badges, labels, cards, metric blocks, lists.
4. Layer3 Composite Blocks: stable reusable blocks.
5. Layer4 Slide Patterns: whole-slide structures.
6. Layer5 Deck Recipes: end-to-end deck narratives.

## Template pack concept

A template pack contains source files, extracted assets, a foundation JSON, an icon registry, candidate slide patterns, candidate components, and QA baselines. Raw extracted values must be reviewed before becoming aliases.

## Quick start

```bash
pnpm install
pnpm test
pnpm validate:examples
pnpm generate:example
```

## CLI commands

```bash
ppt-lord validate <deck-spec>
ppt-lord generate <deck-spec> --out <path>
ppt-lord inspect-template <template-pptx> --template-id <id> --out <path>
ppt-lord render-preview <pptx> --out <dir>
ppt-lord qa <deck-spec-or-pptx> --out <report>
```

## How to add a template pack

Run `ppt-lord inspect-template <template-pptx> --template-id <id> --out assets/templates/<id>/extracted`, review raw extraction output, then promote approved values into the pack foundation and icon registry.

## How to add a component

Create an OpenSpec-style change first. A component update must add a props schema, registry entry, example spec, unit test, visual fixture placeholder, and usage boundary.

## How to run QA

Use `ppt-lord validate` for schema and token checks. Use `ppt-lord qa` for the first-version QA report stub. Preview rendering, visual regression, and overflow checks are defined but intentionally minimal in this first version.

## How to propose a change

Create `openspec/changes/<change-id>/proposal.md`, `design.md`, `tasks.md`, and spec deltas before modifying behavior. After implementation and validation, merge accepted requirements into `openspec/specs/`.

## Current limitations

The renderer only supports a smoke path for titles and simple bullet lists. Template inspection, preview rendering, visual diff, and overflow checks are stubs with stable interfaces.
