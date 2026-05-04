#!/usr/bin/env bash

set -euo pipefail

PROJECT_ID=""
PROJECT_NAME=""
REGION=""
BILLING_ACCOUNT=""
FOLDER_ID=""
ORGANIZATION_ID=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project-id)
      PROJECT_ID="$2"
      shift 2
      ;;
    --project-name)
      PROJECT_NAME="$2"
      shift 2
      ;;
    --region)
      REGION="$2"
      shift 2
      ;;
    --billing-account)
      BILLING_ACCOUNT="$2"
      shift 2
      ;;
    --folder-id)
      FOLDER_ID="$2"
      shift 2
      ;;
    --organization-id)
      ORGANIZATION_ID="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

ARTIFACT_REGISTRY_REPOSITORY_ID="${PROJECT_ID}-api"
STATE_BUCKET="${PROJECT_ID}-tfstate"

if [[ -z "$PROJECT_ID" || -z "$REGION" ]]; then
  cat <<'USAGE' >&2
Usage:
  ./bootstrap.sh --project-id <project-id> --region <region> \
    [--project-name <project-name>] [--billing-account <billing-account-id>] \
    [--folder-id <folder-id> | --organization-id <organization-id>]
USAGE
  exit 1
fi

if ! command -v gcloud >/dev/null 2>&1; then
  echo "gcloud is required." >&2
  exit 1
fi

project_exists() {
  gcloud projects describe "$PROJECT_ID" >/dev/null 2>&1
}

create_project() {
  if [[ -z "$PROJECT_NAME" ]]; then
    echo "--project-name is required when the project does not already exist." >&2
    exit 1
  fi

  if [[ -n "$FOLDER_ID" && -n "$ORGANIZATION_ID" ]]; then
    echo "Use either --folder-id or --organization-id, not both." >&2
    exit 1
  fi

  local create_args=(
    "$PROJECT_ID"
    "--name=$PROJECT_NAME"
  )

  if [[ -n "$FOLDER_ID" ]]; then
    create_args+=("--folder=$FOLDER_ID")
  fi

  if [[ -n "$ORGANIZATION_ID" ]]; then
    create_args+=("--organization=$ORGANIZATION_ID")
  fi

  gcloud projects create "${create_args[@]}"
}

link_billing_account() {
  if [[ -z "$BILLING_ACCOUNT" ]]; then
    echo "--billing-account is required when the project does not already exist." >&2
    exit 1
  fi

  gcloud beta billing projects link "$PROJECT_ID" \
    --billing-account "$BILLING_ACCOUNT"
}

if project_exists; then
  echo "Project $PROJECT_ID already exists."
else
  echo "Creating project $PROJECT_ID..."
  create_project
  echo "Linking billing account to $PROJECT_ID..."
  link_billing_account
fi

gcloud config set project "$PROJECT_ID" >/dev/null

gcloud services enable \
  artifactregistry.googleapis.com \
  serviceusage.googleapis.com \
  cloudresourcemanager.googleapis.com \
  cloudbilling.googleapis.com \
  --project "$PROJECT_ID"

if ! gcloud storage buckets describe "gs://${STATE_BUCKET}" --project "$PROJECT_ID" >/dev/null 2>&1; then
  gcloud storage buckets create "gs://${STATE_BUCKET}" \
    --project "$PROJECT_ID" \
    --location "$REGION" \
    --uniform-bucket-level-access
fi

gcloud storage buckets update "gs://${STATE_BUCKET}" \
  --project "$PROJECT_ID" \
  --versioning

if ! gcloud artifacts repositories describe "$ARTIFACT_REGISTRY_REPOSITORY_ID" \
  --project "$PROJECT_ID" \
  --location "$REGION" >/dev/null 2>&1; then
  gcloud artifacts repositories create "$ARTIFACT_REGISTRY_REPOSITORY_ID" \
    --project "$PROJECT_ID" \
    --location "$REGION" \
    --repository-format docker \
    --description "Docker repository for the tournament API"
fi

cat <<EOF
Bootstrap complete.

Project:      $PROJECT_ID
Project name: ${PROJECT_NAME:-"(existing project)"}
Region:       $REGION
State bucket: gs://$STATE_BUCKET
Artifact Registry: ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPOSITORY_ID}

Next steps:
  1. gcloud auth application-default login
  2. build and push the API image to ${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REGISTRY_REPOSITORY_ID}
  3. cd infra/gcp/definition
  4. update backend.hcl and terraform.tfvars if needed
  5. terraform init -backend-config=backend.hcl
  6. terraform apply
EOF
