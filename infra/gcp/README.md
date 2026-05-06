# GCP Infrastructure

Cette arborescence est maintenant decoupee en trois couches : `init`, `ci` et
`definition`.

## Structure

- [`init/bootstrap.sh`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/init/bootstrap.sh) :
  bootstrap minimal du projet GCP et du bucket de state Terraform partage
- [`ci`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/ci) :
  root Terraform dedie a la chaine CI, aux repositories Artifact Registry et au
  service account GitHub Actions
- [`definition`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/definition) :
  root Terraform dedie a l'infrastructure applicative

## Vision

- `init` prepare juste ce qu'il faut pour pouvoir lancer Terraform proprement
- `ci` prepare ce qu'il faut pour que GitHub Actions publie les artefacts
- `definition` deploie l'infrastructure qui consomme les artefacts publies par la CI
- les deux roots Terraform partagent le meme bucket GCS de state avec des
  prefixes differents

## Bootstrap

Le bootstrap est assure par
[`infra/gcp/init/bootstrap.sh`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/init/bootstrap.sh).

Il :

- cree le projet GCP s'il n'existe pas deja
- rattache le compte de facturation lors de cette creation
- active les APIs minimales necessaires au bootstrap et au backend Terraform
- cree le bucket GCS `<project-id>-tfstate` pour le state distant
- active le versioning sur ce bucket

Pre-requis :

- `gcloud` est installe et authentifie sur ta machine
- tu as les droits suffisants sur le projet

Si le projet n'existe pas encore, il faut aussi :

- un `billing account id`
- les droits pour creer un projet
- les droits pour rattacher la facturation
- eventuellement un `folder_id` ou `organization_id`

Exemple :

```bash
./infra/gcp/init/bootstrap.sh \
  --project-id my-tournament-prod \
  --project-name "Tournament Manager Prod" \
  --billing-account 000000-000000-000000 \
  --region europe-west1
```

Si le projet existe deja, `--project-name` et `--billing-account` sont optionnels.

## Root CI

Le root Terraform CI est
[`infra/gcp/ci`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/ci).

Il cree :

- le repository Artifact Registry Docker `<project-id>-api`
- le repository Artifact Registry Generic `<project-id>-web`
- le service account `github-actions-ci`
- les droits `roles/artifactregistry.writer` pour ce service account

Le backend GCS de ce root pointe vers :

- [`ci/backend.hcl`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/ci/backend.hcl)
  avec le prefix `terraform/gcp-ci`

## Root Definition

Le root Terraform applicatif est
[`infra/gcp/definition`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/definition).

Il cree :

- Secret Manager pour les secrets applicatifs
- Cloud SQL PostgreSQL
- Cloud Run pour l'API
- un bucket GCS public pour servir des fichiers statiques `html`, `css`, `js`,
  images, etc.

Le backend GCS de ce root pointe vers :

- [`definition/backend.hcl`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/definition/backend.hcl)
  avec le prefix `terraform/gcp-app`

## Ordre recommande

1. lancer le bootstrap
2. `gcloud auth application-default login`
3. `cd infra/gcp/ci`
4. ajuster `backend.hcl` et `terraform.tfvars` si besoin
5. `terraform init -backend-config=backend.hcl`
6. `terraform apply`
7. creer une cle pour le service account CI et la mettre dans le secret GitHub `GCP_SA_KEY`
8. laisser GitHub Actions pousser les artefacts
9. `cd ../definition`
10. ajuster `backend.hcl` et `terraform.tfvars` si besoin
11. `terraform init -backend-config=backend.hcl`
12. `terraform apply`

## GitHub Actions

La configuration GitHub la plus simple repose sur une cle JSON de service account.

Variables GitHub a definir dans le repository :

- `GCP_PROJECT_ID` : l'id du projet GCP
- `GCP_REGION` : la region Artifact Registry, par exemple `europe-west9`
- `GCP_SA_KEY` : secret GitHub contenant la cle JSON du service account CI

Exemple pour creer la cle apres le `terraform apply` du root `ci` :

```bash
gcloud iam service-accounts keys create github-actions-ci-key.json \
  --project my-tournament-prod \
  --iam-account github-actions-ci@my-tournament-prod.iam.gserviceaccount.com
```

Ensuite, ajoute le contenu de `github-actions-ci-key.json` dans le secret GitHub
`GCP_SA_KEY`.

Une fois ces variables renseignees :

- le workflow API construit l'image Docker et la pousse dans
  `${region}-docker.pkg.dev/${project_id}/${project_id}-api`
- le workflow web pousse le contenu de `web/dist` dans le repository generic
  `${project_id}-web`, package `${project_id}-web`, version `${github.sha}`

Artifact Registry generic accepte les uploads par dossier, donc aucun zip n'est
necessaire dans ce flux.

## CORS

Les origins CORS sont centralisees dans `cors_allowed_origins`.
Chaque valeur doit etre un origin, pas une URL complete avec un chemin.

Exemple :

```hcl
cors_allowed_origins = [
  "http://localhost:*",
  "http://127.0.0.1:*",
  "https://geofberard.github.io",
]
```

## Notes

- Les mots de passe generes par Terraform sont stockes dans le state Terraform.
- Le backend GCS doit donc rester prive.
- La base Cloud SQL est la partie qui coutera le plus.
- Le bucket statique reste dans `definition` parce qu'il fait partie de l'infra
  consommee en production.
- Les noms techniques restent standardises :
  repository Docker `<project-id>-api`, repository generic `<project-id>-web`,
  service Cloud Run `<project-id>-api`, service account CI `github-actions-ci`,
  service account runtime derive de `<project-id>-sa`, instance Cloud SQL
  `<project-id>-db`, base `<project_id_avec_underscores>_db`, user
  `<project_id_avec_underscores>`.
