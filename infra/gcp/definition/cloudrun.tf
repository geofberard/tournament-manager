resource "google_cloud_run_v2_service" "api" {
  name                = local.cloud_run_service_name
  location            = var.region
  ingress             = "INGRESS_TRAFFIC_ALL"
  deletion_protection = false

  template {
    service_account = google_service_account.cloud_run.email

    scaling {
      min_instance_count = var.cloud_run_min_instances
      max_instance_count = var.cloud_run_max_instances
    }

    containers {
      image = local.api_image_url

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = var.cloud_run_cpu
          memory = var.cloud_run_memory
        }
      }

      env {
        name  = "SPRING_PROFILES_ACTIVE"
        value = "postgres"
      }

      env {
        name  = "APP_CORS_ALLOWED_ORIGINS"
        value = local.cors_allowed_origins_csv
      }

      env {
        name  = "APP_ADMIN_USERNAME"
        value = "admin"
      }

      env {
        name  = "APP_DATASOURCE_USERNAME"
        value = google_sql_user.application.name
      }

      env {
        name  = "APP_DATASOURCE_URL"
        value = local.cloud_sql_jdbc_url
      }

      env {
        name = "APP_DATASOURCE_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.database_password.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "APP_ADMIN_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.admin_password.secret_id
            version = "latest"
          }
        }
      }
    }
  }

  depends_on = [
    google_project_iam_member.cloud_run_cloudsql_client,
    google_secret_manager_secret_iam_member.cloud_run_database_password,
    google_secret_manager_secret_iam_member.cloud_run_admin_password,
  ]
}

resource "google_cloud_run_v2_service_iam_member" "public_invoker" {
  name     = google_cloud_run_v2_service.api.name
  location = google_cloud_run_v2_service.api.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
