locals {
  required_services = toset([
    "artifactregistry.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "serviceusage.googleapis.com",
    "storage.googleapis.com",
    "sqladmin.googleapis.com",
  ])

  cors_allowed_origins_csv = join(",", distinct(var.cors_allowed_origins))

  cloud_run_service_name          = "${var.project_id}-api"
  database_instance_name          = "${var.project_id}-db"
  api_artifact_repository_name    = "${var.project_id}-api"
  web_artifact_repository_name    = "${var.project_id}-web"
  web_artifact_package_name       = "${var.project_id}-web"

  artifact_registry_repository_url = "${var.region}-docker.pkg.dev/${var.project_id}/${local.api_artifact_repository_name}"
  api_image_url                    = "${local.artifact_registry_repository_url}/${local.cloud_run_service_name}:${var.api_image_version}"

  cloud_sql_jdbc_url = join("", [
    "jdbc:postgresql://google/",
    google_sql_database.database.name,
    "?cloudSqlInstance=",
    google_sql_database_instance.database.connection_name,
    "&socketFactory=com.google.cloud.sql.postgres.SocketFactory",
    "&cloudSqlRefreshStrategy=lazy",
  ])
}
