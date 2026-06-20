# GCP Infrastructure

Cette arborescence se decoupe en trois couches : `init`, `factory` et `app`.

## Structure

- `init/bootstrap.sh` : bootstrap minimal du projet GCP et du bucket de state Terraform partage
- `factory` : root Terraform dedie a la CI, aux repositories Artifact Registry et au service account GitHub Actions
- `app` : root Terraform dedie a l'infrastructure applicative Tournament Manager

## Vision

- `init` prepare juste ce qu'il faut pour pouvoir lancer Terraform proprement
- `factory` prepare ce qu'il faut pour que la CI publie l'image Docker de l'API et deploie le build statique du web
- `app` deploie l'infrastructure applicative et consomme l'image API publiee par la CI
- les roots Terraform partagent le meme bucket GCS de state avec des prefixes differents

## Bootstrap

Le bootstrap est assure par `infra/gcp/init/bootstrap.sh`.

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

## Root Factory

Le root Terraform factory est `infra/gcp/factory`.

Il cree :

- le repository Artifact Registry Docker `<project-id>-api`
- le service account `github-actions-ci`
- les droits Artifact Registry, Firebase Hosting, Terraform state et deploiement
  applicatif pour ce service account

Le backend GCS de ce root pointe vers `factory/backend.hcl` avec le prefix
`terraform/gcp-factory`.

## Root App

Le root Terraform applicatif est `infra/gcp/app`.

Il cree :

- Secret Manager pour les secrets applicatifs
- Cloud SQL PostgreSQL
- Cloud Run pour l'API, en pointant sur un tag d'image fourni en variable
- le service account runtime Cloud Run avec les droits Cloud SQL et Secret Manager
- le projet Firebase et le site Firebase Hosting qui servira le web statique

Le build web est deployee par GitHub Actions avec Firebase Hosting. Terraform ne
publie plus les fichiers statiques.

Le backend GCS de ce root pointe vers `app/backend.hcl` avec le prefix
`terraform/gcp-app`.

## Ordre recommande

1. lancer le bootstrap
2. `gcloud auth application-default login`
3. `cd infra/gcp/factory`
4. ajuster `backend.hcl` et `terraform.tfvars`
5. `terraform init -backend-config=backend.hcl`
6. `terraform apply`
7. creer une cle pour le service account CI et la mettre dans le secret GitHub `GCP_SA_KEY`
8. laisser GitHub Actions pousser l'image API
9. `cd ../app`
10. ajuster `backend.hcl` et `terraform.tfvars`, notamment `target_version`
11. `terraform init -backend-config=backend.hcl`
12. `terraform apply`
13. le workflow release applique Terraform puis deploie le front

## GitHub Actions

La configuration GitHub la plus simple repose sur une cle JSON de service account.

Variables GitHub a definir dans le repository :

- `GCP_PROJECT_ID` : l'id du projet GCP
- `GCP_REGION` : la region Artifact Registry, par exemple `europe-west1`
- `GCP_SA_KEY` : secret GitHub contenant la cle JSON du service account CI

Exemple pour creer la cle apres le `terraform apply` du root `factory` :

```bash
gcloud iam service-accounts keys create github-actions-ci-key.json \
  --project my-tournament-prod \
  --iam-account github-actions-ci@my-tournament-prod.iam.gserviceaccount.com
```

Ensuite, ajoute le contenu de `github-actions-ci-key.json` dans le secret GitHub
`GCP_SA_KEY`.

Une fois ces variables renseignees :

- le workflow API construit l'image Docker et la pousse dans :

```text
${region}-docker.pkg.dev/${project_id}/${project_id}-api/${project_id}-api:${tag}
```

- le workflow release demarre sur un tag `v*.*.*`, lance `terraform apply` dans
  `infra/gcp/app` avec `target_version=${tag}`, puis deploie le front sur
  Firebase Hosting.

- le workflow web reste un workflow de verification du front. Le deploiement
  Firebase Hosting de production est sequence apres Terraform dans
  `.github/workflows/release.yaml`.

## Version API deployee par Terraform

Le root `app` attend une version explicite en entree :

```hcl
target_version = "0.1.0"
```

`target_version` est utilise pour construire l'image Cloud Run :

```text
${region}-docker.pkg.dev/${project_id}/${project_id}-api/${project_id}-api:<tag>
```

Le front n'a plus de version consommee par Terraform. Son deploiement est une
release Firebase Hosting effectuee par le workflow release.

## Firebase Hosting

Le front utilise des chemins relatifs vers l'API. Le client web appelle donc
directement `/api/...`.

Le fichier `infra/gcp/firebase.json` contient la configuration Hosting :

```json
{
  "hosting": {
    "site": "tournois-scuf-2026",
    "public": "web/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "tournois-scuf-2026-api",
          "region": "europe-west1"
        }
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

Le workflow de release telecharge le build dans `infra/gcp/web/dist`, puis
execute la CLI Firebase depuis `infra/gcp` avec `--config=firebase.json`.

Le site par defaut est `https://<project-id>.web.app`, avec aussi
`https://<project-id>.firebaseapp.com`.

## Base Cloud SQL

Pour reduire les couts hors usage, la base Cloud SQL peut etre arretee et
demarree manuellement :

```bash
./infra/gcp/manage-db.sh stop
./infra/gcp/manage-db.sh start
```

Il est possible de cibler un autre projet ou une autre instance :

```bash
./infra/gcp/manage-db.sh --project-id my-tournament-prod --instance my-db stop
```

## CORS

Les origins CORS sont centralisees dans `cors_allowed_origins`.
Chaque valeur doit etre un origin, pas une URL complete avec un chemin.
En local, l'application Spring Boot utilise par defaut
`http://localhost:*,http://127.0.0.1:*`.
Les origins de production doivent etre fournis par l'infra.

Exemple :

```hcl
cors_allowed_origins = [
  "https://<project-id>.web.app",
  "https://<project-id>.firebaseapp.com",
]
```

## Notes

- Les mots de passe generes par Terraform sont stockes dans le state Terraform.
- Le backend GCS doit donc rester prive.
- La base Cloud SQL est la partie qui coutera le plus.
- Pour conserver un petit tier partage comme `db-f1-micro`, il faut utiliser
  l'edition `ENTERPRISE`. Avec PostgreSQL 16+, Google Cloud peut sinon basculer
  par defaut sur `ENTERPRISE_PLUS`, qui refuse `db-f1-micro`.
- Les noms techniques restent standardises : repository Docker `<project-id>-api`,
  site Firebase Hosting `<project-id>`, service Cloud Run `<project-id>-api`,
  service account CI `github-actions-ci`, service account runtime derive de
  `<project-id>-sa`, instance Cloud SQL `<project-id>-db`, base
  `<project_id_avec_underscores>_db`, user `<project_id_avec_underscores>_admin`.
