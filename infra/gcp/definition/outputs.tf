output "artifact_registry_repository_url" {
  description = "Artifact Registry Docker repository base URL."
  value       = local.artifact_registry_repository_url
}

output "static_bucket_name" {
  description = "Public GCS bucket hosting static files."
  value       = google_storage_bucket.static.name
}

output "static_bucket_url" {
  description = "Direct GCS URL of the public static bucket."
  value       = "gs://${google_storage_bucket.static.name}"
}

output "static_bucket_website_url" {
  description = "Public website URL of the static bucket."
  value       = "http://${google_storage_bucket.static.name}.storage.googleapis.com"
}

output "suggested_api_image" {
  description = "Suggested image path for the API container."
  value       = local.api_image_url
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
