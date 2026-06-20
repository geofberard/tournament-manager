resource "random_password" "database" {
  length  = 24
  special = false
}

resource "random_password" "admin" {
  length  = 24
  special = false
}

resource "google_secret_manager_secret" "database_password" {
  secret_id = "${local.cloud_run_service_name}-db-password"

  replication {
    auto {}
  }

  depends_on = [time_sleep.after_service_activation]
}

resource "google_secret_manager_secret_version" "database_password" {
  secret      = google_secret_manager_secret.database_password.id
  secret_data = random_password.database.result
}

resource "google_secret_manager_secret" "admin_password" {
  secret_id = "${local.cloud_run_service_name}-admin-password"

  replication {
    auto {}
  }

  depends_on = [time_sleep.after_service_activation]
}

resource "google_secret_manager_secret_version" "admin_password" {
  secret      = google_secret_manager_secret.admin_password.id
  secret_data = random_password.admin.result
}
