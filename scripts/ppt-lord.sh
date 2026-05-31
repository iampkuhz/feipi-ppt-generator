#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

case "${1:-}" in
  deps) pnpm install ;;
  build) pnpm build ;;
  test) pnpm test ;;
  doctor) pnpm lord doctor ;;
  validate) shift; pnpm lord validate "$@" ;;
  generate) shift; pnpm lord generate "$@" ;;
  preview) shift; pnpm lord preview "$@" ;;
  quality) shift; pnpm lord quality "$@" ;;
  change) shift; pnpm lord change "$@" ;;
  archive) shift; pnpm lord archive "$@" ;;
  *) echo "用法：scripts/ppt-lord.sh deps|build|test|doctor|validate|generate|preview|quality|change|archive" >&2; exit 2 ;;
esac
