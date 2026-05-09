# ScoresApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteGameScore**](ScoresApi.md#deletegamescore) | **DELETE** /api/games/{gameId}/score | Supprimer le score d\&#39;un match |
| [**getGameScore**](ScoresApi.md#getgamescore) | **GET** /api/games/{gameId}/score | Lire le score d\&#39;un match |
| [**upsertGameScore**](ScoresApi.md#upsertgamescoreoperation) | **PUT** /api/games/{gameId}/score | Créer ou remplacer le score d\&#39;un match |



## deleteGameScore

> deleteGameScore(gameId)

Supprimer le score d\&#39;un match

Supprime le score d\&#39;un match existant.

### Example

```ts
import {
  Configuration,
  ScoresApi,
} from '';
import type { DeleteGameScoreRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ScoresApi();

  const body = {
    // string | Identifiant unique d\'un match
    gameId: game_1,
  } satisfies DeleteGameScoreRequest;

  try {
    const data = await api.deleteGameScore(body);
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
| **204** | Score supprimé |  -  |
| **404** | Ressource introuvable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getGameScore

> GameScore getGameScore(gameId)

Lire le score d\&#39;un match

Retourne le score d\&#39;un match s\&#39;il existe.

### Example

```ts
import {
  Configuration,
  ScoresApi,
} from '';
import type { GetGameScoreRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ScoresApi();

  const body = {
    // string | Identifiant unique d\'un match
    gameId: game_1,
  } satisfies GetGameScoreRequest;

  try {
    const data = await api.getGameScore(body);
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

[**GameScore**](GameScore.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Score du match |  -  |
| **404** | Ressource introuvable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## upsertGameScore

> GameScore upsertGameScore(gameId, upsertGameScoreRequest)

Créer ou remplacer le score d\&#39;un match

Définit le score du match en remplaçant intégralement la valeur existante si besoin. 

### Example

```ts
import {
  Configuration,
  ScoresApi,
} from '';
import type { UpsertGameScoreOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ScoresApi();

  const body = {
    // string | Identifiant unique d\'un match
    gameId: game_1,
    // UpsertGameScoreRequest | Nouveau score du match
    upsertGameScoreRequest: ...,
  } satisfies UpsertGameScoreOperationRequest;

  try {
    const data = await api.upsertGameScore(body);
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
| **upsertGameScoreRequest** | [UpsertGameScoreRequest](UpsertGameScoreRequest.md) | Nouveau score du match | |

### Return type

[**GameScore**](GameScore.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Score enregistré |  -  |
| **400** | Requête invalide |  -  |
| **404** | Ressource introuvable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

