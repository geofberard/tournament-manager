project_id = "gberard-tournament-prod"
region     = "europe-west1"

target_version = "0.1.0"

cloud_run_cpu           = "1"
cloud_run_memory        = "512Mi"
cloud_run_min_instances = 0
cloud_run_max_instances = 2

cors_allowed_origins = [
  "https://geofberard.github.io",
  "https://gberard-tournament-prod.web.app",
  "https://gberard-tournament-prod.firebaseapp.com",
]

firebase_hosting_site_id = "gberard-tournament-prod"

database_tier                = "db-f1-micro"
database_edition             = "ENTERPRISE"
database_version             = "POSTGRES_16"
database_disk_size_gb        = 10
database_deletion_protection = true
database_backups_enabled     = false
