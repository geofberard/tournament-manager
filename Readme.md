# Requirements
- `node` [installation](https://nodejs.org/en/download/)
- `java jdk25`
- `maven` [installation](https://maven.apache.org/install.html)

# Production
|Service|Url|
|---|---|
|Web App|https://geofberard.github.io/tournament-manager/|
|Api|https://scuf-tournois-prod.uc.r.appspot.com/api/swagger-ui/index.html|

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
The API now relies on Spring Data JPA with the in-memory H2 database configured in
[`api/src/main/resources/application.properties`](/Users/geoffrey.berard/lesfurets/_perso/tournament-manager/api/src/main/resources/application.properties).
No Google service account is required to run the project locally.


## Start local environment
The server can be start/debug directly from the IDE running the `main` method in the `TournamentApplication` class.
However, it is possible to run it in terminal with the command :
```
$ mvn spring-boot:run
```

# Web App
## Overview
|||
|---|---|
|Language|[ReactJS](https://fr.reactjs.org/)|
|Code Location|`front/`|
|Building Tool|[Webpack](https://webpack.js.org/)|
|Design System|[Material UI](https://mui.com/material-ui/getting-started/overview/)|

## Set Up
To install all dependencies, run :  
```
$ cd front
$ npm install
```

## Start local environment
To run locally the React App and the Java server locally :
```
$ npm run start:local-api
```

To run locally the React App only and to use staging API (running on google cloud platform here [scuf-tournois-prod.uc.r.appspot.com](https://scuf-tournois-prod.uc.r.appspot.com/api/swagger-ui/index.html):
```
$ npm run start:remote-api
```

## Before commit
To ensure the code quality, run prettier before commiting 
```
$ npm run lint:fix
$ npm run prettier
```

## Deployment
The WebApp is hosted on github `gh-pages`, all the code merge in `main`branch is automatically deployed.
