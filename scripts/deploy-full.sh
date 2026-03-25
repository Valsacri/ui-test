#!/usr/bin/env bash
# Full deploy for frontend multi-env (pull -> build -> run).
#
# Run on the Droplet from the Sporgates-frontend repo root (e.g. /home/deploy/sporgates-frontend):
#   chmod +x scripts/deploy-full.sh
#   ./scripts/deploy-full.sh
#
# Requires an env file at:
#   infra/frontend-multi-env/.env.frontend-multi
#
# Notes:
# - NEXT_PUBLIC_* values are baked at build time; this script rebuilds images each run.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

ENV_FILE="infra/frontend-multi-env/.env.frontend-multi"
COMPOSE_FILE="infra/frontend-multi-env/docker-compose.yml"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: missing $ENV_FILE (copy from infra/frontend-multi-env/env/.env.frontend-multi.example)" >&2
  exit 1
fi

echo ">>> git pull --ff-only"
git fetch origin
git pull --ff-only

echo ">>> docker compose up -d --build (prod/qa/dev frontends)"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --build

echo ">>> docker compose ps"
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps

echo ">>> done"

