
# UpsertGameScoreRequest

Payload utilisé pour créer ou remplacer le score d\'un match.

## Properties

Name | Type
------------ | -------------
`pointsByTeam` | { [key: string]: number; }

## Example

```typescript
import type { UpsertGameScoreRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "pointsByTeam": null,
} satisfies UpsertGameScoreRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpsertGameScoreRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


