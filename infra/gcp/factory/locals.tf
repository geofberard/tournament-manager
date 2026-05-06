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
  web_artifact_repository_name = "${var.project_id}-web"
  web_artifact_package_name    = "${var.project_id}-web"

  github_actions_service_account_id = "github-actions-ci"
  github_actions_service_account    = "${local.github_actions_service_account_id}@${var.project_id}.iam.gserviceaccount.com"

  api_artifact_registry_repository_url = "${var.region}-docker.pkg.dev/${var.project_id}/${local.api_artifact_repository_name}"
  web_artifact_registry_repository_url = "${var.region}-generic.pkg.dev/${var.project_id}/${local.web_artifact_repository_name}"
}
