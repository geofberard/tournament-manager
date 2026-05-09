
# GameScore

Score simple d\'un match sur un seul set.  Le score associe chaque identifiant d\'équipe participante au nombre de points qui lui est attribué. 

## Properties

Name | Type
------------ | -------------
`pointsByTeam` | { [key: string]: number; }

## Example

```typescript
import type { GameScore } from ''

// TODO: Update the object below with actual values
const example = {
  "pointsByTeam": null,
} satisfies GameScore

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GameScore
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


