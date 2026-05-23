output "artifact_registry_repository_url" {
  description = "Artifact Registry Docker repository base URL."
  value       = local.artifact_registry_repository_url
}

output "firebase_hosting_site_id" {
  description = "Firebase Hosting site id."
  value       = google_firebase_hosting_site.web.site_id
}

output "firebase_hosting_default_url" {
  description = "Default Firebase Hosting URL."
  value       = google_firebase_hosting_site.web.default_url
}

output "suggested_api_image" {
  description = "Image path deployed on Cloud Run."
  value       = local.api_image_url
}

output "deployed_api_image_version" {
  description = "Artifact Registry image tag deployed on Cloud Run."
  value       = var.target_version
}

output "deployed_target_version" {
  description = "Artifact Registry Docker image tag deployed for the API."
  value       = var.target_version
}

output "cloud_run_service_url" {
  description = "Public Cloud Run URL."
  value       = google_cloud_run_v2_service.api.uri
}

output "cloud_sql_connection_name" {
  description = "Cloud SQL connection name."
  value       = google_sql_database_instance.database.connection_name
}

output "cloud_sql_instance_name" {
  description = "Cloud SQL instance name."
  value       = google_sql_database_instance.database.name
}

output "database_name" {
  description = "Cloud SQL database name."
  value       = google_sql_database.database.name
}

output "database_username" {
  description = "Cloud SQL application user."
  value       = google_sql_user.application.name
}

output "admin_username" {
  description = "Application admin username."
  value       = "admin"
}

output "database_secret_name" {
  description = "Secret Manager secret storing the database password."
  value       = google_secret_manager_secret.database_password.secret_id
}

output "admin_password_secret_name" {
  description = "Secret Manager secret storing the API admin password."
  value       = google_secret_manager_secret.admin_password.secret_id
}
