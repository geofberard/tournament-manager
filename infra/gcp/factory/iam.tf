resource "google_service_account" "github_actions" {
  account_id   = local.github_actions_service_account_id
  display_name = "GitHub Actions CI"
}

resource "google_project_iam_member" "github_actions_artifact_registry_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}
