
# Game

Représentation d\'un match enrichie avec les équipes participantes, tandis que les opérations d\'écriture utilisent des identifiants. 

## Properties

Name | Type
------------ | -------------
`id` | string
`phase` | [Phase](Phase.md)
`name` | string
`group` | string
`time` | Date
`court` | string
`status` | [GameStatus](GameStatus.md)
`contestants` | [Set&lt;Team&gt;](Team.md)
`referee` | [Team](Team.md)
`score` | [GameScore](GameScore.md)

## Example

```typescript
import type { Game } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "phase": null,
  "name": null,
  "group": null,
  "time": null,
  "court": null,
  "status": null,
  "contestants": null,
  "referee": null,
  "score": null,
} satisfies Game

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Game
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


