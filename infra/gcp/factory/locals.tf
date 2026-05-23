locals {
  required_services = toset([
    "artifactregistry.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "serviceusage.googleapis.com",
  ])

  api_artifact_repository_name = "${var.project_id}-api"
  api_artifact_image_name      = "${var.project_id}-api"

  github_actions_service_account_id = "github-actions-ci"

  api_artifact_registry_repository_url = "${var.region}-docker.pkg.dev/${var.project_id}/${local.api_artifact_repository_name}"
  api_image_url                        = "${local.api_artifact_registry_repository_url}/${local.api_artifact_image_name}"
}
