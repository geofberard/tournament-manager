# GCP Infrastructure

Cette arborescence contient la proposition d'infrastructure GCP du projet.

## Structure

- [`init/bootstrap.sh`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/init/bootstrap.sh) :
  bootstrap one-shot du projet GCP, du bucket de state partage et du repository
  Docker
- [`definition`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/definition) :
  infrastructure applicative Terraform pour Cloud SQL, Secret Manager,
  Cloud Run et un bucket public de fichiers statiques

## Vision

- Terraform est execute en local par un developpeur
- le state Terraform est partage dans GCS
- GitHub Actions peut construire l'image Docker, mais ne deploie pas l'API
- l'image Cloud Run suit une convention stable :
  `${region}-docker.pkg.dev/${project_id}/${project_id}-api/${project_id}-api:latest`

## Bootstrap

Le bootstrap est assure par
[`infra/gcp/init/bootstrap.sh`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/init/bootstrap.sh).

Il :

- cree le projet GCP s'il n'existe pas deja
- rattache le compte de facturation lors de cette creation
- active les APIs minimales necessaires au bootstrap du projet et du backend Terraform
- cree le bucket GCS `<project-id>-tfstate` pour le state distant
- active le versioning sur ce bucket
- cree le repository Artifact Registry `<project-id>-api`

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

## Definition

Le root Terraform principal est
[`infra/gcp/definition`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/definition).

Il cree :

- Secret Manager pour les secrets applicatifs
- Cloud SQL PostgreSQL
- Cloud Run pour l'API
- un bucket GCS public pour servir des fichiers statiques `html`, `css`, `js`,
  images, etc.

Avant de lancer Terraform en local :

```bash
gcloud auth application-default login
```

Les fichiers
[`backend.hcl`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/definition/backend.hcl)
et
[`terraform.tfvars`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/definition/terraform.tfvars)
sont versionnes et partages entre les developpeurs.

## Ordre recommande

1. lancer le bootstrap
2. construire et pousser l'image Docker dans Artifact Registry
3. `cd infra/gcp/definition`
4. `terraform init -backend-config=backend.hcl`
5. `terraform apply`

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
- Le bucket statique est public en lecture et expose une configuration website
  simple basee sur `index.html` et `404.html`.
- Le bucket statique suit une convention de nommage stable :
  `<project-id>-static`.
- D'autres noms techniques sont aussi standardises :
  repository Docker `<project-id>-api`, service Cloud Run `<project-id>-api`,
  service account derive de `<project-id>-sa` avec troncature si necessaire,
  instance Cloud SQL `<project-id>-db`, base
  `<project_id_avec_underscores>_db`, user `<project_id_avec_underscores>`.
- Secret Manager est conserve pour ne pas injecter les mots de passe en clair
  dans la configuration Cloud Run.
- Secret Manager reste tres peu couteux dans ce cas d'usage : avec 2 secrets
  actifs et un faible volume d'acces, tu restes normalement dans le free tier
  actuel.
