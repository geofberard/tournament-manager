locals {
  required_services = toset([
    "artifactregistry.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "firebase.googleapis.com",
    "firebasehosting.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "serviceusage.googleapis.com",
    "sqladmin.googleapis.com",
  ])

  cors_allowed_origins_csv = join(",", distinct(var.cors_allowed_origins))

  cloud_run_service_name       = "${var.project_id}-api"
  firebase_hosting_site_id     = coalesce(var.firebase_hosting_site_id, var.project_id)
  database_instance_name       = "${var.project_id}-db"
  api_artifact_repository_name = "${var.project_id}-api"
  api_artifact_image_name      = "${var.project_id}-api"

  artifact_registry_repository_url = "${var.region}-docker.pkg.dev/${var.project_id}/${local.api_artifact_repository_name}"
  api_image_url                    = "${local.artifact_registry_repository_url}/${local.api_artifact_image_name}:${var.target_version}"

  cloud_sql_database_name = "${replace(var.project_id, "-", "_")}_db"
  cloud_sql_username      = "${replace(var.project_id, "-", "_")}_admin"

  cloud_sql_jdbc_url = join("", [
    "jdbc:postgresql://google/",
    google_sql_database.database.name,
    "?cloudSqlInstance=",
    google_sql_database_instance.database.connection_name,
    "&socketFactory=com.google.cloud.sql.postgres.SocketFactory",
    "&cloudSqlRefreshStrategy=lazy",
  ])
}
