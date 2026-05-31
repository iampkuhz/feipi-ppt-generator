# Skill Interface

## Purpose

Document how AI skills and subagents use the repository.

## Requirements

- Skills call repository CLI and schemas.
- Skills do not own core rendering logic.
- Agents must not write raw visual values or bypass the registry.

## Non-goals

- Implementing business-specific deck generation inside skill documents.

## Examples

`skills/ppt-lord-generate/SKILL.md` turns a brief into a deck spec and calls the CLI.

## Validation

Review skills for forbidden actions and identity leaks.
