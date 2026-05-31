#!/usr/bin/env bash
set -euo pipefail

repo_root_from_hook() {
  cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd
}
