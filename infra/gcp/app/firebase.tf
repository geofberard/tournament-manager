resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project_id

  depends_on = [time_sleep.after_service_activation]
}

resource "google_firebase_hosting_site" "web" {
  provider = google-beta
  project  = var.project_id
  site_id  = local.firebase_hosting_site_id

  depends_on = [google_firebase_project.default]
}
