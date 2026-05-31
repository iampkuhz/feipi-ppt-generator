#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

pnpm tsx scripts/harness/validate_repo_structure.ts
pnpm tsx scripts/harness/validate_openspec_layout.ts
pnpm tsx scripts/harness/validate_harness_structure.ts
pnpm tsx scripts/harness/validate_language_policy.ts
