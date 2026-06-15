# Tournament Manager Web

Application React + TypeScript + Vite pour l'interface de Tournament Manager.

## Scripts

- `npm run dev` lance le serveur Vite.
- `npm run generate:api-client` régénère le client TypeScript depuis `../contract/openapi.yaml`.
- `npm run check` exécute le lint, le build et les tests.

Le client généré dans `src/generated/` n'est pas versionné. La CI le régénère
avant le build web.
