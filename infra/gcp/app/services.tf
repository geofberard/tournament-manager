resource "google_project_service" "services" {
  for_each = local.required_services

  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}

# Newly enabled Google APIs can take a short time to become usable.
resource "time_sleep" "after_service_activation" {
  create_duration = "60s"

  triggers = {
    services = join(",", sort(tolist(local.required_services)))
  }

  depends_on = [google_project_service.services]
}
