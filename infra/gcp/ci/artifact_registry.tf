resource "google_artifact_registry_repository" "api" {
  location      = var.region
  repository_id = local.api_artifact_repository_name
  description   = "Docker repository for the tournament API"
  format        = "DOCKER"

  depends_on = [for service in google_project_service.services : service]
}

resource "google_artifact_registry_repository" "web" {
  location      = var.region
  repository_id = local.web_artifact_repository_name
  description   = "Generic repository for the tournament web build"
  format        = "GENERIC"

  depends_on = [for service in google_project_service.services : service]
}
