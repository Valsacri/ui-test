#!/usr/bin/env bash
# Deploy one frontend tier on the Droplet (docker compose).
#
# Usage (from repo root, e.g. /home/deploy/sporgates/sporgates-frontend):
#   chmod +x scripts/deploy.sh
#   ./scripts/deploy.sh prod
#   ./scripts/deploy.sh qa
#   ./scripts/deploy.sh dev
#
# Options (after environment name):
#   --no-build   recreate without image rebuild (faster)
#   --pull-git   git fetch + pull before deploy (uses current branch if GIT_BRANCH unset)
#
# For pull + build + deploy in one step, use: ./scripts/deploy-full.sh <prod|qa|dev>
#
# Requires an env file at:
#   infra/frontend-multi-env/.env.frontend-multi
#
# Notes:
# - NEXT_PUBLIC_* values are baked at build time; use --build when you change API URLs.
#

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

ENVIRONMENT=""
DO_BUILD=1
DO_GIT_PULL=0
GIT_REMOTE="${GIT_REMOTE:-origin}"
GIT_BRANCH="${GIT_BRANCH:-}"

ENV_FILE="infra/frontend-multi-env/.env.frontend-multi"
COMPOSE_FILE="infra/frontend-multi-env/docker-compose.yml"
COMPOSE=(docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE")

usage() {
  sed -n '1,30p' "$0" | tail -n +2
  exit 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    prod|qa|dev) ENVIRONMENT="$1"; shift ;;
    --no-build) DO_BUILD=0; shift ;;
    --pull-git) DO_GIT_PULL=1; shift ;;
    -h|--help) usage ;;
    *) echo "Unknown option: $1" >&2; usage ;;
  esac
done

if [[ -z "$ENVIRONMENT" ]]; then
  echo "Usage: $0 <prod|qa|dev> [--no-build] [--pull-git]" >&2
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: missing $ENV_FILE (copy from infra/frontend-multi-env/env/.env.frontend-multi.example)" >&2
  exit 1
fi

if [[ "$DO_GIT_PULL" -eq 1 ]]; then
  if [[ ! -d .git ]]; then
    echo "ERROR: --pull-git requested but .git not found" >&2
    exit 1
  fi
  branch="${GIT_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"
  echo ">>> git fetch $GIT_REMOTE && git pull --ff-only $GIT_REMOTE $branch"
  git fetch "$GIT_REMOTE"
  git pull --ff-only "$GIT_REMOTE" "$branch"
fi

BUILD_ARGS=()
if [[ "$DO_BUILD" -eq 1 ]]; then
  BUILD_ARGS+=(--build)
else
  BUILD_ARGS+=(--no-build)
fi

case "$ENVIRONMENT" in
  prod) SERVICE="frontend-prod"; port=3100 ;;
  qa)   SERVICE="frontend-qa";   port=3101 ;;
  dev)  SERVICE="frontend-dev";  port=3102 ;;
esac

echo ">>> Deploying ${ENVIRONMENT^^} ($SERVICE -> :$port)"
"${COMPOSE[@]}" up -d "${BUILD_ARGS[@]}" --force-recreate "$SERVICE"

echo ">>> Status"
"${COMPOSE[@]}" ps

echo ">>> Health (localhost)"
curl -sS -o /dev/null -w "HTTP %{http_code}\n" --max-time 15 "http://127.0.0.1:${port}/" || true

echo ">>> Done ($ENVIRONMENT)"

