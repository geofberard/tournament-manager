#!/usr/bin/env bash

set -euo pipefail

DEFAULT_PROJECT_ID="gberard-tournament-prod"
PROJECT_ID="$DEFAULT_PROJECT_ID"
INSTANCE_NAME=""
COMMAND=""

usage() {
  cat <<'USAGE' >&2
Usage:
  ./infra/gcp/manage-db.sh <start|stop>
  ./infra/gcp/manage-db.sh --project-id <project-id> <start|stop>
  ./infra/gcp/manage-db.sh --project-id <project-id> --instance <instance-name> <start|stop>

Commands:
  start  Start the Cloud SQL instance by setting activation policy to ALWAYS.
  stop   Stop the Cloud SQL instance by setting activation policy to NEVER.

Defaults:
  project-id: gberard-tournament-prod
  instance:   <project-id>-db
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project-id)
      PROJECT_ID="$2"
      shift 2
      ;;
    --instance)
      INSTANCE_NAME="$2"
      shift 2
      ;;
    start|stop)
      COMMAND="$1"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$COMMAND" ]]; then
  usage
  exit 1
fi

if ! command -v gcloud >/dev/null 2>&1; then
  echo "gcloud is required." >&2
  exit 1
fi

if [[ -z "$INSTANCE_NAME" ]]; then
  INSTANCE_NAME="${PROJECT_ID}-db"
fi

if [[ "$COMMAND" == "start" ]]; then
  ACTIVATION_POLICY="ALWAYS"
  ACTION="Starting"
else
  ACTIVATION_POLICY="NEVER"
  ACTION="Stopping"
fi

echo "${ACTION} Cloud SQL instance ${INSTANCE_NAME} in project ${PROJECT_ID}..."

gcloud sql instances patch "$INSTANCE_NAME" \
  --project "$PROJECT_ID" \
  --activation-policy "$ACTIVATION_POLICY" \
  --quiet

CURRENT_POLICY="$(gcloud sql instances describe "$INSTANCE_NAME" \
  --project "$PROJECT_ID" \
  --format='value(settings.activationPolicy)')"

echo "Cloud SQL activation policy is now ${CURRENT_POLICY}."
