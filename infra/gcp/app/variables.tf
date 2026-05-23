variable "project_id" {
  description = "GCP project id."
  type        = string
}

variable "region" {
  description = "Deployment region."
  type        = string
  default     = "europe-west1"
}

variable "target_version" {
  description = "Artifact Registry Docker image tag to deploy for the API."
  type        = string

  validation {
    condition     = trimspace(var.target_version) != ""
    error_message = "target_version must not be empty."
  }
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

  validation {
    condition     = length(var.cors_allowed_origins) > 0
    error_message = "cors_allowed_origins must contain at least one origin."
  }
}

variable "firebase_hosting_site_id" {
  description = "Firebase Hosting site id. Defaults to the project id, which gives https://<project-id>.web.app."
  type        = string
  default     = null
}

variable "database_tier" {
  description = "Cloud SQL machine tier."
  type        = string
  default     = "db-f1-micro"
}

variable "database_edition" {
  description = "Cloud SQL edition."
  type        = string
  default     = "ENTERPRISE"

  validation {
    condition     = contains(["ENTERPRISE", "ENTERPRISE_PLUS"], var.database_edition)
    error_message = "database_edition must be ENTERPRISE or ENTERPRISE_PLUS."
  }
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
