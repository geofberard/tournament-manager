project_id = "gberard-tournament-prod"
region     = "europe-west1"

api_image_version    = "replace-me"
web_artifact_version = "replace-me"

cloud_run_cpu           = "1"
cloud_run_memory        = "512Mi"
cloud_run_min_instances = 0
cloud_run_max_instances = 2

cors_allowed_origins = [
  "http://localhost:*",
  "http://127.0.0.1:*",
  "https://geofberard.github.io",
]

database_tier                = "db-f1-micro"
database_edition             = "ENTERPRISE"
database_version             = "POSTGRES_16"
database_disk_size_gb        = 10
database_deletion_protection = true
database_backups_enabled     = false

static_bucket_main_page_suffix = "index.html"
static_bucket_not_found_page   = "404.html"
