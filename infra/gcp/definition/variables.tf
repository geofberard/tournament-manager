variable "project_id" {
  description = "GCP project id."
  type        = string
}

variable "region" {
  description = "Deployment region."
  type        = string
  default     = "europe-west9"
}

variable "cloud_run_cpu" {
  description = "Cloud Run CPU limit."
  type        = string
  default     = "1"
}

variable "cloud_run_memory" {
  description = "Cloud Run memory limit."
  type        = string
  default     = "512Mi"
}

variable "cloud_run_min_instances" {
  description = "Cloud Run minimum instances."
  type        = number
  default     = 0
}

variable "cloud_run_max_instances" {
  description = "Cloud Run maximum instances."
  type        = number
  default     = 2
}

variable "cors_allowed_origins" {
  description = "Origins allowed by API CORS, without any path."
  type        = list(string)
  default = [
    "http://localhost:*",
    "http://127.0.0.1:*",
    "https://geofberard.github.io",
  ]
}

variable "database_tier" {
  description = "Cloud SQL machine tier."
  type        = string
  default     = "db-f1-micro"
}

variable "database_version" {
  description = "Cloud SQL PostgreSQL version."
  type        = string
  default     = "POSTGRES_16"
}

variable "database_disk_size_gb" {
  description = "Cloud SQL disk size in GB."
  type        = number
  default     = 10
}

variable "database_deletion_protection" {
  description = "Enable deletion protection on the Cloud SQL instance."
  type        = bool
  default     = true
}

variable "database_backups_enabled" {
  description = "Enable Cloud SQL automated backups."
  type        = bool
  default     = false
}

variable "static_bucket_main_page_suffix" {
  description = "Main page served by the public static bucket."
  type        = string
  default     = "index.html"
}

variable "static_bucket_not_found_page" {
  description = "404 page served by the public static bucket."
  type        = string
  default     = "404.html"
}
