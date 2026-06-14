
# BulkCreateGamesRequest

Paramètres de création du calendrier d\'une poule sur un terrain.

## Properties

Name | Type
------------ | -------------
`phaseId` | string
`group` | string
`startTime` | Date
`gameDurationMinutes` | number
`breakDurationMinutes` | number
`court` | string
`teamIds` | Set&lt;string&gt;
`assignReferees` | boolean

## Example

```typescript
import type { BulkCreateGamesRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "phaseId": null,
  "group": null,
  "startTime": null,
  "gameDurationMinutes": null,
  "breakDurationMinutes": null,
  "court": null,
  "teamIds": null,
  "assignReferees": null,
} satisfies BulkCreateGamesRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BulkCreateGamesRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


