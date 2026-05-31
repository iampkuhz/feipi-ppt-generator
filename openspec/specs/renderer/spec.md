# Renderer

## Purpose

Convert validated deck specs into PPTX output and warnings.

## Requirements

- Renderers implement `renderDeck` and `renderSlide`.
- Renderer backends resolve aliases and assets internally.
- Missing support must produce warnings instead of silent failure.

## Non-goals

- Full visual parity in the first version.

## Examples

`PptxRenderer` writes a smoke-rendered PPTX.

## Validation

Run renderer smoke tests.
