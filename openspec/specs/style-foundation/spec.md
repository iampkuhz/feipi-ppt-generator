# Style Foundation

## Purpose

Define legal visual aliases and constraints for all generated slide specs.

## Requirements

- Typography, colors, spacing, radius, surfaces, strokes, shadows, icons, and data defaults must be addressable by alias.
- Component props must not use raw visual values.
- New aliases require an OpenSpec-style change.

## Non-goals

- Drawing PPT shapes.
- Defining chart layouts.
- Defining slide patterns.

## Examples

Use `color: inkPrimary` and `size: title`.

## Validation

Run schema validation and token lint.
