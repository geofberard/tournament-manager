locals {
  required_services = toset([
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

  artifact_registry_repository_url = "${var.region}-docker.pkg.dev/${var.project_id}/${var.project_id}-api"
  api_image_url                    = "${local.artifact_registry_repository_url}/${local.cloud_run_service_name}:latest"

  cloud_sql_jdbc_url = join("", [
    "jdbc:postgresql://google/",
    google_sql_database.database.name,
    "?cloudSqlInstance=",
    google_sql_database_instance.database.connection_name,
    "&socketFactory=com.google.cloud.sql.postgres.SocketFactory",
    "&user=",
    google_sql_user.application.name,
    "&cloudSqlRefreshStrategy=lazy",
  ])
}
