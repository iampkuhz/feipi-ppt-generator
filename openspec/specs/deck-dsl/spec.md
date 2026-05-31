# Deck DSL

## Purpose

Describe decks as validated data instead of direct drawing commands.

## Requirements

- `DeckSpec` contains id, optional title, template id, foundation id, size, slides, and metadata.
- `SlideSpec` contains id, type, optional title, layout, components, and notes.
- `ComponentSpec` contains type, optional version, and props.

## Non-goals

- Free-form PPT coordinate authoring by agents.

## Examples

See `examples/decks/basic.deck.yaml`.

## Validation

Use `ppt-lord validate`.
