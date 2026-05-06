# GCP Infrastructure

Cette arborescence contient la proposition d'infrastructure GCP du projet.

## Structure

- [`init/bootstrap.sh`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/init/bootstrap.sh) :
  bootstrap one-shot du projet GCP, du bucket de state partage et des
  repositories Artifact Registry
- [`definition`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/definition) :
  infrastructure applicative Terraform pour Cloud SQL, Secret Manager,
  Cloud Run et un bucket public de fichiers statiques

## Vision

- Terraform est execute en local par un developpeur
- le state Terraform est partage dans GCS
- GitHub Actions pousse les artefacts dans Artifact Registry via une cle JSON
  de service account
- l'image Cloud Run suit une convention stable :
  `${region}-docker.pkg.dev/${project_id}/${project_id}-api/${project_id}-api:latest`
- les builds web sont stockes dans un repository generic
  `${region}-generic.pkg.dev/${project_id}/${project_id}-web/${project_id}-web`

## Bootstrap

Le bootstrap est assure par
[`infra/gcp/init/bootstrap.sh`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/init/bootstrap.sh).

Il :

- cree le projet GCP s'il n'existe pas deja
- rattache le compte de facturation lors de cette creation
- active les APIs minimales necessaires au bootstrap du projet et du backend Terraform
- cree le bucket GCS `<project-id>-tfstate` pour le state distant
- active le versioning sur ce bucket
- cree le repository Artifact Registry Docker `<project-id>-api`
- cree le repository Artifact Registry Generic `<project-id>-web`
- cree le service account GitHub Actions pour publier dans Artifact Registry
- attribue les roles IAM necessaires a la CI

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
2. configurer GitHub avec les valeurs retournees par le bootstrap
3. laisser GitHub Actions pousser les artefacts
4. `cd infra/gcp/definition`
5. `terraform init -backend-config=backend.hcl`
6. `terraform apply`

## GitHub Actions

La configuration la plus simple repose sur une cle JSON de service account.

Variables GitHub a definir dans le repository :

- `GCP_PROJECT_ID` : l'id du projet GCP
- `GCP_REGION` : la region Artifact Registry, par exemple `europe-west9`
- `GCP_SA_KEY` : secret GitHub contenant la cle JSON du service account
  `github-actions-ci`

Exemple pour creer la cle :

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
- Le bucket statique est public en lecture et expose une configuration website
  simple basee sur `index.html` et `404.html`.
- Le bucket statique reste cree par Terraform. Il peut toujours servir plus tard
  pour une exposition publique du front, mais il n'est plus cible par la CI.
- Le bucket statique suit une convention de nommage stable :
  `<project-id>-static`.
- D'autres noms techniques sont aussi standardises :
  repository Docker `<project-id>-api`, service Cloud Run `<project-id>-api`,
  repository generic `<project-id>-web`, service account runtime derive de
  `<project-id>-sa` avec troncature si necessaire, service account GitHub
  `github-actions-ci`,
  instance Cloud SQL `<project-id>-db`, base
  `<project_id_avec_underscores>_db`, user `<project_id_avec_underscores>`.
- Secret Manager est conserve pour ne pas injecter les mots de passe en clair
  dans la configuration Cloud Run.
- Secret Manager reste tres peu couteux dans ce cas d'usage : avec 2 secrets
  actifs et un faible volume d'acces, tu restes normalement dans le free tier
  actuel.
