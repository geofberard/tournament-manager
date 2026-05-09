# TeamsApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createTeam**](TeamsApi.md#createteamoperation) | **POST** /api/teams | Créer une équipe |
| [**deleteTeam**](TeamsApi.md#deleteteam) | **DELETE** /api/teams/{teamId} | Supprimer une équipe |
| [**getTeamById**](TeamsApi.md#getteambyid) | **GET** /api/teams/{teamId} | Lire une équipe |
| [**listTeams**](TeamsApi.md#listteams) | **GET** /api/teams | Lister les équipes |
| [**updateTeam**](TeamsApi.md#updateteamoperation) | **PUT** /api/teams/{teamId} | Modifier une équipe |



## createTeam

> Team createTeam(createTeamRequest)

Créer une équipe

Crée une nouvelle équipe.

### Example

```ts
import {
  Configuration,
  TeamsApi,
} from '';
import type { CreateTeamOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TeamsApi();

  const body = {
    // CreateTeamRequest | Informations de création de l\'équipe
    createTeamRequest: {"name":"Les Furets"},
  } satisfies CreateTeamOperationRequest;

  try {
    const data = await api.createTeam(body);
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
| **createTeamRequest** | [CreateTeamRequest](CreateTeamRequest.md) | Informations de création de l\&#39;équipe | |

### Return type

[**Team**](Team.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Équipe créée |  -  |
| **400** | Requête invalide |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteTeam

> deleteTeam(teamId)

Supprimer une équipe

Supprime une équipe existante.

### Example

```ts
import {
  Configuration,
  TeamsApi,
} from '';
import type { DeleteTeamRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TeamsApi();

  const body = {
    // string | Identifiant unique d\'une équipe
    teamId: team_1,
  } satisfies DeleteTeamRequest;

  try {
    const data = await api.deleteTeam(body);
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

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Équipe supprimée |  -  |
| **404** | Ressource introuvable |  -  |
| **409** | L\&#39;équipe ne peut pas être supprimée car elle est encore référencée par un ou plusieurs matchs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getTeamById

> Team getTeamById(teamId)

Lire une équipe

Retourne une équipe à partir de son identifiant.

### Example

```ts
import {
  Configuration,
  TeamsApi,
} from '';
import type { GetTeamByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TeamsApi();

  const body = {
    // string | Identifiant unique d\'une équipe
    teamId: team_1,
  } satisfies GetTeamByIdRequest;

  try {
    const data = await api.getTeamById(body);
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

[**Team**](Team.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Équipe trouvée |  -  |
| **404** | Ressource introuvable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listTeams

> Array&lt;Team&gt; listTeams()

Lister les équipes

Retourne l\&#39;ensemble des équipes connues du système.

### Example

```ts
import {
  Configuration,
  TeamsApi,
} from '';
import type { ListTeamsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TeamsApi();

  try {
    const data = await api.listTeams();
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

[**Array&lt;Team&gt;**](Team.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Liste des équipes |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateTeam

> Team updateTeam(teamId, updateTeamRequest)

Modifier une équipe

Met à jour le nom d\&#39;une équipe existante.

### Example

```ts
import {
  Configuration,
  TeamsApi,
} from '';
import type { UpdateTeamOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TeamsApi();

  const body = {
    // string | Identifiant unique d\'une équipe
    teamId: team_1,
    // UpdateTeamRequest | Nouveau contenu de l\'équipe
    updateTeamRequest: {"name":"Les Furets Volants"},
  } satisfies UpdateTeamOperationRequest;

  try {
    const data = await api.updateTeam(body);
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
| **updateTeamRequest** | [UpdateTeamRequest](UpdateTeamRequest.md) | Nouveau contenu de l\&#39;équipe | |

### Return type

[**Team**](Team.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Équipe mise à jour |  -  |
| **400** | Requête invalide |  -  |
| **404** | Ressource introuvable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

