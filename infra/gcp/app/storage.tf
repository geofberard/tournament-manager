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

resource "terraform_data" "deploy_web_artifact" {
  triggers_replace = {
    bucket_name           = google_storage_bucket.static.name
    project_id            = var.project_id
    region                = var.region
    repository            = local.web_artifact_repository_name
    package_name          = local.web_artifact_package_name
    web_artifact_version  = var.web_artifact_version
  }

  provisioner "local-exec" {
    interpreter = ["/bin/bash", "-c"]
    command = <<-EOT
      set -euo pipefail

      workdir="$(mktemp -d)"
      trap 'rm -rf "$workdir"' EXIT

      gcloud artifacts generic download \
        --project="${self.triggers_replace.project_id}" \
        --location="${self.triggers_replace.region}" \
        --repository="${self.triggers_replace.repository}" \
        --package="${self.triggers_replace.package_name}" \
        --version="${self.triggers_replace.web_artifact_version}" \
        --destination="$workdir"

      gcloud storage rsync \
        --recursive \
        --delete-unmatched-destination-objects \
        "$workdir" \
        "gs://${self.triggers_replace.bucket_name}"
    EOT
  }

  depends_on = [
    google_storage_bucket.static,
    google_storage_bucket_iam_member.static_public_reader,
  ]
}
