# Requirements
- `node` [installation](https://nodejs.org/en/download/)
- `java jdk25`
- `maven` [installation](https://maven.apache.org/install.html)

# Docker
To run the `api` and `web` projects together with Docker:
```bash
docker compose -f infra/local/docker/docker-compose.yml up
```

The services are then available at:
- `web`: [http://localhost:5173](http://localhost:5173)
- `api`: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- `api remote debug`: `localhost:5005`

The Vite dev server uses a minimal Docker-specific setup for live reload, proxies `/api` requests to the `api` container, and the Spring Boot process exposes JDWP on port `5005`.

The shared OpenAPI contract used by both `api` and `web` lives in
[`contract/openapi.yaml`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/contract/openapi.yaml).

# Production
|Service|Url|
|---|---|
|Web App|https://geofberard.github.io/tournament-manager/|
|Api|https://scuf-tournois-prod.uc.r.appspot.com/api/swagger-ui/index.html|

# Infrastructure GCP

La proposition Terraform pour GCP se trouve dans
[`infra/gcp/README.md`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/infra/gcp/README.md).

L'API dispose aussi d'un Dockerfile Cloud Run dans
[`api/Dockerfile`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/api/Dockerfile).

# API Server
## Overview
|||
|---|---|
|Language|[Java](https://www.java.com/fr/)|
|Code Location|`api/`|
|Building Tool|[Maven](https://maven.apache.org)|
|Framework|[Spring Boot](https://spring.io/projects/spring-boot)|

## Set Up
To install all dependencies, run :
```
$ cd api
$ mvn clean install
```
The API now relies on Spring Data JPA and supports two database profiles:
- `h2` (default): in-memory database for local quick start and tests
- `postgres`: external PostgreSQL database configured at startup

The shared configuration lives in
[`api/src/main/resources/application.properties`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/api/src/main/resources/application.properties),
with profile-specific settings in
[`api/src/main/resources/application-h2.properties`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/api/src/main/resources/application-h2.properties)
and
[`api/src/main/resources/application-postgres.properties`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/api/src/main/resources/application-postgres.properties).
No Google service account is required to run the project locally.


## Start local environment
The server can be start/debug directly from the IDE running the `main` method in the `TournamentApplication` class.
However, it is possible to run it in terminal with the command :
```
$ mvn spring-boot:run
```

This starts the API with the default `h2` profile.

To start the API on PostgreSQL instead:
```bash
$ SPRING_PROFILES_ACTIVE=postgres \
  APP_DATASOURCE_URL='jdbc:postgresql://localhost:5432/tournament_manager' \
  APP_DATASOURCE_USERNAME=tournament \
  mvn spring-boot:run
```

The local PostgreSQL setup is configured to accept passwordless connections for the
`tournament` user, so `APP_DATASOURCE_PASSWORD` is optional in local development.
For shared or production environments, keep using a real password or a stronger auth
mechanism.

The application initializes the schema and seed data automatically for both profiles
using
[`api/src/main/resources/schema.sql`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/api/src/main/resources/schema.sql)
and
[`api/src/main/resources/data.sql`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/api/src/main/resources/data.sql).

To start a local PostgreSQL container for development:
```bash
$ SPRING_PROFILES_ACTIVE=postgres docker compose -f infra/local/docker/docker-compose.yml --profile postgres up
```

The `postgres` service exposes a database on `localhost:5432` with:
- database: `tournament_manager`
- username: `tournament`
- password: none in local Docker setup

# Web App
## Overview
|||
|---|---|
|Language|[ReactJS](https://fr.reactjs.org/)|
|Code Location|`web/`|
|Building Tool|[Vite](https://vite.dev/)|
|Design System|[Material UI](https://mui.com/material-ui/getting-started/overview/)|

## Set Up
To install all dependencies, run :  
```
$ cd web
$ npm install
```

## Start local environment
To run locally the React App:
```
$ npm run dev
```

To run the quality checks locally:
```
$ npm test
$ npm run build
$ npm run lint
```

## Deployment
The WebApp is built from `web/` and deployed by the GitHub Actions frontend workflow.
