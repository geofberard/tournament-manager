
# ContestantStats

Information .  Cette vue est calculée à partir des matchs et des scores disponibles. 

## Properties

Name | Type
------------ | -------------
`contestant` | [Team](Team.md)
`played` | number
`won` | number
`drawn` | number
`lost` | number
`score` | number
`pointsFor` | number
`pointsAgainst` | number
`pointsDiff` | number

## Example

```typescript
import type { ContestantStats } from ''

// TODO: Update the object below with actual values
const example = {
  "contestant": null,
  "played": null,
  "won": null,
  "drawn": null,
  "lost": null,
  "score": null,
  "pointsFor": null,
  "pointsAgainst": null,
  "pointsDiff": null,
} satisfies ContestantStats

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ContestantStats
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


