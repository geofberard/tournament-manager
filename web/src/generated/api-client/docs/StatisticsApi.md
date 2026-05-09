# StatisticsApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getRankingByTeamId**](StatisticsApi.md#getrankingbyteamid) | **GET** /api/statistics/{teamId} | Lire le classement d\&#39;une équipe |
| [**listRankings**](StatisticsApi.md#listrankings) | **GET** /api/statistics | Lire le classement |



## getRankingByTeamId

> ContestantStats getRankingByTeamId(teamId)

Lire le classement d\&#39;une équipe

Retourne l\&#39;entrée de classement correspondant à une équipe donnée.

### Example

```ts
import {
  Configuration,
  StatisticsApi,
} from '';
import type { GetRankingByTeamIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new StatisticsApi();

  const body = {
    // string | Identifiant unique d\'une équipe
    teamId: team_1,
  } satisfies GetRankingByTeamIdRequest;

  try {
    const data = await api.getRankingByTeamId(body);
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
| **teamId** | `string` | Identifiant unique d\&#39;une équipe | [Defaults to `undefined`] |

### Return type

[**ContestantStats**](ContestantStats.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Entrée de classement |  -  |
| **404** | Ressource introuvable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listRankings

> Array&lt;ContestantStats&gt; listRankings()

Lire le classement

Retourne le classement complet de toutes les équipes connues. 

### Example

```ts
import {
  Configuration,
  StatisticsApi,
} from '';
import type { ListRankingsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new StatisticsApi();

  try {
    const data = await api.listRankings();
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

[**Array&lt;ContestantStats&gt;**](ContestantStats.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Classement calculé |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

