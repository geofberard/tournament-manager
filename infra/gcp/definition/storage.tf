resource "google_storage_bucket" "static" {
  name                        = "${var.project_id}-static"
  location                    = var.region
  uniform_bucket_level_access = true

  website {
    main_page_suffix = var.static_bucket_main_page_suffix
    not_found_page   = var.static_bucket_not_found_page
  }

  depends_on = [for service in google_project_service.services : service]
}

resource "google_storage_bucket_iam_member" "static_public_reader" {
  bucket = google_storage_bucket.static.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}
