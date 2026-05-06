output "github_actions_service_account_email" {
  description = "Service account email to use from GitHub Actions."
  value       = google_service_account.github_actions.email
}

output "api_artifact_repository_name" {
  description = "Artifact Registry Docker repository name for the API image."
  value       = google_artifact_registry_repository.api.repository_id
}

output "api_artifact_image_name" {
  description = "Docker image name to push for the API."
  value       = local.api_artifact_image_name
}

output "api_artifact_registry_repository_url" {
  description = "Artifact Registry Docker repository base URL."
  value       = local.api_artifact_registry_repository_url
}

output "web_artifact_repository_name" {
  description = "Artifact Registry generic repository name for web build assets."
  value       = google_artifact_registry_repository.web.repository_id
}

output "web_artifact_package_name" {
  description = "Artifact Registry generic package name for uploaded web builds."
  value       = local.web_artifact_package_name
}

output "web_artifact_registry_repository_url" {
  description = "Artifact Registry generic repository base URL."
  value       = local.web_artifact_registry_repository_url
}
