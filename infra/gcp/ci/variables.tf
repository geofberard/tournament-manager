variable "project_id" {
  description = "GCP project id."
  type        = string
}

variable "region" {
  description = "Artifact Registry region."
  type        = string
  default     = "europe-west9"
}
