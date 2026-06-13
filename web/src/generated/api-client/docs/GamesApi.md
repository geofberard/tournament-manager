# GamesApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**bulkUpdateGames**](GamesApi.md#bulkupdategamesoperation) | **POST** /api/games/bulk-update | Modifier plusieurs matchs |
| [**createGame**](GamesApi.md#creategameoperation) | **POST** /api/games | Créer un match |
| [**deleteGame**](GamesApi.md#deletegame) | **DELETE** /api/games/{gameId} | Supprimer un match |
| [**getGameById**](GamesApi.md#getgamebyid) | **GET** /api/games/{gameId} | Lire un match |
| [**listGames**](GamesApi.md#listgames) | **GET** /api/games | Lister les matchs |
| [**updateGame**](GamesApi.md#updategameoperation) | **PUT** /api/games/{gameId} | Modifier un match |



## bulkUpdateGames

> Array&lt;Game&gt; bulkUpdateGames(bulkUpdateGamesRequest)

Modifier plusieurs matchs

Applique les mêmes modifications partielles à plusieurs matchs.  Seuls les champs présents dans &#x60;changes&#x60; sont modifiés. Le score n\&#39;est pas modifiable par cette opération et reste géré via &#x60;/games/{gameId}/score&#x60;.  L\&#39;opération est atomique : si un match ou une ressource référencée est introuvable, aucun match n\&#39;est modifié.

### Example

```ts
import {
  Configuration,
  GamesApi,
} from '';
import type { BulkUpdateGamesOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new GamesApi();

  const body = {
    // BulkUpdateGamesRequest | Matchs ciblés et modifications à leur appliquer
    bulkUpdateGamesRequest: {"gameIds":["game_1","game_2"],"changes":{"time":"2026-03-15T19:00:00Z","court":"Court B"}},
  } satisfies BulkUpdateGamesOperationRequest;

  try {
    const data = await api.bulkUpdateGames(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **bulkUpdateGamesRequest** | [BulkUpdateGamesRequest](BulkUpdateGamesRequest.md) | Matchs ciblés et modifications à leur appliquer | |

### Return type

[**Array&lt;Game&gt;**](Game.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Matchs mis à jour |  -  |
| **400** | Requête invalide |  -  |
| **404** | Ressource introuvable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createGame

> Game createGame(createGameRequest)

Créer un match

Crée un nouveau match.  Le match référence un ensemble d\&#39;équipes participantes, représenté côté contrat par un tableau sans doublon (&#x60;uniqueItems: true&#x60;).  Dans cette première version : - un match contient au moins 2 équipes - les équipes doivent déjà exister - le score n\&#39;est pas fourni ici ; il est géré via &#x60;/games/{gameId}/score&#x60;

### Example

```ts
import {
  Configuration,
  GamesApi,
} from '';
import type { CreateGameOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new GamesApi();

  const body = {
    // CreateGameRequest | Informations de création du match
    createGameRequest: {"time":"2026-03-15T18:30:00Z","court":"Court A","contestantIds":["team_1","team_2"]},
  } satisfies CreateGameOperationRequest;

  try {
    const data = await api.createGame(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **createGameRequest** | [CreateGameRequest](CreateGameRequest.md) | Informations de création du match | |

### Return type

[**Game**](Game.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Match créé |  -  |
| **400** | Requête invalide |  -  |
| **404** | Une ou plusieurs équipes référencées sont introuvables |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteGame

> deleteGame(gameId)

Supprimer un match

Supprime un match existant.

### Example

```ts
import {
  Configuration,
  GamesApi,
} from '';
import type { DeleteGameRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new GamesApi();

  const body = {
    // string | Identifiant unique d\'un match
    gameId: game_1,
  } satisfies DeleteGameRequest;

  try {
    const data = await api.deleteGame(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **gameId** | `string` | Identifiant unique d\&#39;un match | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Match supprimé |  -  |
| **404** | Ressource introuvable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getGameById

> Game getGameById(gameId)

Lire un match

Retourne le détail d\&#39;un match.

### Example

```ts
import {
  Configuration,
  GamesApi,
} from '';
import type { GetGameByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new GamesApi();

  const body = {
    // string | Identifiant unique d\'un match
    gameId: game_1,
  } satisfies GetGameByIdRequest;

  try {
    const data = await api.getGameById(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **gameId** | `string` | Identifiant unique d\&#39;un match | [Defaults to `undefined`] |

### Return type

[**Game**](Game.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Match trouvé |  -  |
| **404** | Ressource introuvable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listGames

> Array&lt;Game&gt; listGames()

Lister les matchs

Retourne l\&#39;ensemble des matchs connus du système.

### Example

```ts
import {
  Configuration,
  GamesApi,
} from '';
import type { ListGamesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new GamesApi();

  try {
    const data = await api.listGames();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;Game&gt;**](Game.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Liste des matchs |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateGame

> Game updateGame(gameId, updateGameRequest)

Modifier un match

Met à jour les métadonnées d\&#39;un match existant.

### Example

```ts
import {
  Configuration,
  GamesApi,
} from '';
import type { UpdateGameOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new GamesApi();

  const body = {
    // string | Identifiant unique d\'un match
    gameId: game_1,
    // UpdateGameRequest | Nouveau contenu du match
    updateGameRequest: {"time":"2026-03-15T19:00:00Z","court":"Court B","status":"scheduled","contestantIds":["team_1","team_2"]},
  } satisfies UpdateGameOperationRequest;

  try {
    const data = await api.updateGame(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **gameId** | `string` | Identifiant unique d\&#39;un match | [Defaults to `undefined`] |
| **updateGameRequest** | [UpdateGameRequest](UpdateGameRequest.md) | Nouveau contenu du match | |

### Return type

[**Game**](Game.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Match mis à jour |  -  |
| **400** | Requête invalide |  -  |
| **404** | Ressource introuvable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

