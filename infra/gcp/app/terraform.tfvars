project_id = "tournois-scuf-2026"
region     = "europe-west1"

target_version = "0.1.0"

cloud_run_cpu           = "1"
cloud_run_memory        = "1Gi"
cloud_run_min_instances = 1
cloud_run_max_instances = 3

cors_allowed_origins = [
  "https://geofberard.github.io",
  "https://tournois-scuf-2026.web.app",
  "https://tournois-scuf-2026.firebaseapp.com",
]

firebase_hosting_site_id = "tournois-scuf-2026"

database_tier                = "db-custom-1-3840"
database_edition             = "ENTERPRISE"
database_version             = "POSTGRES_16"
database_disk_size_gb        = 10
database_deletion_protection = true
database_backups_enabled     = true
