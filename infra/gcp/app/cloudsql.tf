resource "google_sql_database_instance" "database" {
  name             = local.database_instance_name
  database_version = var.database_version
  region           = var.region

  deletion_protection = var.database_deletion_protection

  settings {
    edition           = var.database_edition
    tier              = var.database_tier
    availability_type = "ZONAL"
    disk_size         = var.database_disk_size_gb
    disk_autoresize   = true

    backup_configuration {
      enabled = var.database_backups_enabled
    }

    ip_configuration {
      ipv4_enabled = true
    }
  }

  depends_on = [time_sleep.after_service_activation]
}

resource "google_sql_database" "database" {
  name     = local.cloud_sql_database_name
  instance = google_sql_database_instance.database.name
}

resource "google_sql_user" "application" {
  name     = local.cloud_sql_username
  instance = google_sql_database_instance.database.name
  password = random_password.database.result
}
