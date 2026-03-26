#!/usr/bin/env bash
# Full deploy: pull latest git changes, then build image and recreate frontend container(s).
# Wrapper around deploy.sh with --pull-git always enabled.
#
# Usage (on the Droplet, from repo root):
#   chmod +x scripts/deploy-full.sh scripts/deploy.sh
#   ./scripts/deploy-full.sh prod
#   ./scripts/deploy-full.sh qa
#   ./scripts/deploy-full.sh dev
#
# Optional (passed through to deploy.sh):
#   --no-build   skip docker build (still runs git pull)
#
# To deploy all 3 tiers:
#   ./scripts/deploy-full.sh all
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${1:-}" == "all" ]]; then
  shift || true
  "$SCRIPT_DIR/deploy.sh" prod --pull-git "$@"
  "$SCRIPT_DIR/deploy.sh" qa --pull-git "$@" || true
  "$SCRIPT_DIR/deploy.sh" dev --pull-git "$@" || true
  exit 0
fi

exec "$SCRIPT_DIR/deploy.sh" "$@" --pull-git
