
# CreateGameRequest

Payload utilisé pour créer un match.

## Properties

Name | Type
------------ | -------------
`phaseId` | string
`name` | string
`group` | string
`time` | Date
`court` | string
`contestantIds` | Set&lt;string&gt;
`refereeId` | string

## Example

```typescript
import type { CreateGameRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "phaseId": null,
  "name": null,
  "group": null,
  "time": null,
  "court": null,
  "contestantIds": null,
  "refereeId": null,
} satisfies CreateGameRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateGameRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


