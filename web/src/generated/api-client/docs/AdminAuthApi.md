# AdminAuthApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getAdminSession**](AdminAuthApi.md#getadminsession) | **GET** /api/admin/auth/session | Lire la session admin courante |
| [**loginAdmin**](AdminAuthApi.md#loginadmin) | **POST** /api/admin/auth/login | Ouvrir une session admin |
| [**logoutAdmin**](AdminAuthApi.md#logoutadmin) | **POST** /api/admin/auth/logout | Fermer la session admin |



## getAdminSession

> AdminSession getAdminSession()

Lire la session admin courante

Retourne l\&#39;etat d\&#39;authentification admin de la session HTTP courante.

### Example

```ts
import {
  Configuration,
  AdminAuthApi,
} from '';
import type { GetAdminSessionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminAuthApi();

  try {
    const data = await api.getAdminSession();
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

[**AdminSession**](AdminSession.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Etat courant de la session admin |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## loginAdmin

> AdminSession loginAdmin(adminLoginRequest)

Ouvrir une session admin

Authentifie un utilisateur admin et ouvre une session HTTP cote serveur. 

### Example

```ts
import {
  Configuration,
  AdminAuthApi,
} from '';
import type { LoginAdminRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminAuthApi();

  const body = {
    // AdminLoginRequest | Identifiants de connexion admin
    adminLoginRequest: {"username":"admin","password":"admin123"},
  } satisfies LoginAdminRequest;

  try {
    const data = await api.loginAdmin(body);
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
| **adminLoginRequest** | [AdminLoginRequest](AdminLoginRequest.md) | Identifiants de connexion admin | |

### Return type

[**AdminSession**](AdminSession.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Session admin ouverte |  -  |
| **401** | Identifiants invalides |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## logoutAdmin

> logoutAdmin()

Fermer la session admin

Invalide la session HTTP admin courante.

### Example

```ts
import {
  Configuration,
  AdminAuthApi,
} from '';
import type { LogoutAdminRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminAuthApi();

  try {
    const data = await api.logoutAdmin();
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

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Session admin fermee |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

