# PhasesApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createPhase**](PhasesApi.md#createphaseoperation) | **POST** /api/phases | Créer une phase |
| [**deletePhase**](PhasesApi.md#deletephase) | **DELETE** /api/phases/{phaseId} | Supprimer une phase |
| [**getPhaseById**](PhasesApi.md#getphasebyid) | **GET** /api/phases/{phaseId} | Lire une phase |
| [**getPhaseTeamGroup**](PhasesApi.md#getphaseteamgroup) | **GET** /api/phases/{phaseId}/teams/{teamId}/group | Lire le groupe d\&#39;une équipe dans une phase |
| [**listPhaseGroupRankings**](PhasesApi.md#listphasegrouprankings) | **GET** /api/phases/{phaseId}/groups/{groupId}/statistics | Lire le classement d\&#39;un groupe |
| [**listPhaseGroups**](PhasesApi.md#listphasegroups) | **GET** /api/phases/{phaseId}/groups | Lister les groupes d\&#39;une phase |
| [**listPhases**](PhasesApi.md#listphases) | **GET** /api/phases | Lister les phases |
| [**updatePhase**](PhasesApi.md#updatephaseoperation) | **PUT** /api/phases/{phaseId} | Modifier une phase |



## createPhase

> Phase createPhase(createPhaseRequest)

Créer une phase

Crée une nouvelle phase du tournoi.

### Example

```ts
import {
  Configuration,
  PhasesApi,
} from '';
import type { CreatePhaseOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PhasesApi();

  const body = {
    // CreatePhaseRequest | Informations de création de la phase
    createPhaseRequest: ...,
  } satisfies CreatePhaseOperationRequest;

  try {
    const data = await api.createPhase(body);
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
| **createPhaseRequest** | [CreatePhaseRequest](CreatePhaseRequest.md) | Informations de création de la phase | |

### Return type

[**Phase**](Phase.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Phase créée |  -  |
| **400** | Requête invalide |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deletePhase

> deletePhase(phaseId)

Supprimer une phase

Supprime une phase existante.

### Example

```ts
import {
  Configuration,
  PhasesApi,
} from '';
import type { DeletePhaseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PhasesApi();

  const body = {
    // string | Identifiant unique d\'une phase
    phaseId: phase_1,
  } satisfies DeletePhaseRequest;

  try {
    const data = await api.deletePhase(body);
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
| **phaseId** | `string` | Identifiant unique d\&#39;une phase | [Defaults to `undefined`] |

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
| **204** | Phase supprimée |  -  |
| **404** | Ressource introuvable |  -  |
| **409** | La phase ne peut pas être supprimée car elle est encore référencée par un ou plusieurs matchs.  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPhaseById

> Phase getPhaseById(phaseId)

Lire une phase

Retourne une phase à partir de son identifiant.

### Example

```ts
import {
  Configuration,
  PhasesApi,
} from '';
import type { GetPhaseByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PhasesApi();

  const body = {
    // string | Identifiant unique d\'une phase
    phaseId: phase_1,
  } satisfies GetPhaseByIdRequest;

  try {
    const data = await api.getPhaseById(body);
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
| **phaseId** | `string` | Identifiant unique d\&#39;une phase | [Defaults to `undefined`] |

### Return type

[**Phase**](Phase.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Phase trouvée |  -  |
| **404** | Ressource introuvable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getPhaseTeamGroup

> Group getPhaseTeamGroup(phaseId, teamId)

Lire le groupe d\&#39;une équipe dans une phase

Retourne le groupe auquel appartient l\&#39;equipe donnee dans la phase demandee.

### Example

```ts
import {
  Configuration,
  PhasesApi,
} from '';
import type { GetPhaseTeamGroupRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PhasesApi();

  const body = {
    // string | Identifiant unique d\'une phase
    phaseId: phase_1,
    // string | Identifiant unique d\'une équipe
    teamId: team_1,
  } satisfies GetPhaseTeamGroupRequest;

  try {
    const data = await api.getPhaseTeamGroup(body);
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
| **phaseId** | `string` | Identifiant unique d\&#39;une phase | [Defaults to `undefined`] |
| **teamId** | `string` | Identifiant unique d\&#39;une équipe | [Defaults to `undefined`] |

### Return type

[**Group**](Group.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Groupe de l\&#39;équipe dans la phase |  -  |
| **404** | Ressource introuvable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listPhaseGroupRankings

> Array&lt;ContestantStats&gt; listPhaseGroupRankings(phaseId, groupId)

Lire le classement d\&#39;un groupe

Retourne le classement calculé en ne prenant en compte que les matchs appartenant au groupe demande au sein de la phase donnee. 

### Example

```ts
import {
  Configuration,
  PhasesApi,
} from '';
import type { ListPhaseGroupRankingsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PhasesApi();

  const body = {
    // string | Identifiant unique d\'une phase
    phaseId: phase_1,
    // string | Identifiant unique d\'un groupe
    groupId: Poule A,
  } satisfies ListPhaseGroupRankingsRequest;

  try {
    const data = await api.listPhaseGroupRankings(body);
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
| **phaseId** | `string` | Identifiant unique d\&#39;une phase | [Defaults to `undefined`] |
| **groupId** | `string` | Identifiant unique d\&#39;un groupe | [Defaults to `undefined`] |

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
| **200** | Classement du groupe |  -  |
| **404** | Ressource introuvable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listPhaseGroups

> Array&lt;Group&gt; listPhaseGroups(phaseId)

Lister les groupes d\&#39;une phase

Retourne les groupes presents dans la phase demandee.

### Example

```ts
import {
  Configuration,
  PhasesApi,
} from '';
import type { ListPhaseGroupsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PhasesApi();

  const body = {
    // string | Identifiant unique d\'une phase
    phaseId: phase_1,
  } satisfies ListPhaseGroupsRequest;

  try {
    const data = await api.listPhaseGroups(body);
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
| **phaseId** | `string` | Identifiant unique d\&#39;une phase | [Defaults to `undefined`] |

### Return type

[**Array&lt;Group&gt;**](Group.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Liste des groupes de la phase |  -  |
| **404** | Ressource introuvable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listPhases

> Array&lt;Phase&gt; listPhases()

Lister les phases

Retourne les phases du tournoi dans l\&#39;ordre.

### Example

```ts
import {
  Configuration,
  PhasesApi,
} from '';
import type { ListPhasesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PhasesApi();

  try {
    const data = await api.listPhases();
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

[**Array&lt;Phase&gt;**](Phase.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Liste des phases |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updatePhase

> Phase updatePhase(phaseId, updatePhaseRequest)

Modifier une phase

Met à jour une phase existante.

### Example

```ts
import {
  Configuration,
  PhasesApi,
} from '';
import type { UpdatePhaseOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PhasesApi();

  const body = {
    // string | Identifiant unique d\'une phase
    phaseId: phase_1,
    // UpdatePhaseRequest | Nouveau contenu de la phase
    updatePhaseRequest: ...,
  } satisfies UpdatePhaseOperationRequest;

  try {
    const data = await api.updatePhase(body);
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
| **phaseId** | `string` | Identifiant unique d\&#39;une phase | [Defaults to `undefined`] |
| **updatePhaseRequest** | [UpdatePhaseRequest](UpdatePhaseRequest.md) | Nouveau contenu de la phase | |

### Return type

[**Phase**](Phase.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Phase mise à jour |  -  |
| **400** | Requête invalide |  -  |
| **404** | Ressource introuvable |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

