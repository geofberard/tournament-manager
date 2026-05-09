project_id = "gberard-tournament-prod"
region     = "europe-west1"

api_image_version    = "0.1.0"
web_artifact_version = "0.1.0"

cloud_run_cpu           = "1"
cloud_run_memory        = "512Mi"
cloud_run_min_instances = 0
cloud_run_max_instances = 2

cors_allowed_origins = [
  "https://geofberard.github.io",
  "https://gberard-tournament-prod-api-169213190968.europe-west1.run.app",
  "https://storage.googleapis.com",
]

database_tier                = "db-f1-micro"
database_edition             = "ENTERPRISE"
database_version             = "POSTGRES_16"
database_disk_size_gb        = 10
database_deletion_protection = true
database_backups_enabled     = false

static_bucket_main_page_suffix = "index.html"
static_bucket_not_found_page   = "404.html"
