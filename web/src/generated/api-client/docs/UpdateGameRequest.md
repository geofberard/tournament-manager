
# UpdateGameRequest

Payload utilisé pour modifier un match existant.  Cette opération ne permet pas de modifier le score. 

## Properties

Name | Type
------------ | -------------
`phaseId` | string
`name` | string
`group` | string
`time` | Date
`court` | string
`status` | [GameStatus](GameStatus.md)
`contestantIds` | Set&lt;string&gt;
`refereeId` | string

## Example

```typescript
import type { UpdateGameRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "phaseId": null,
  "name": null,
  "group": null,
  "time": null,
  "court": null,
  "status": null,
  "contestantIds": null,
  "refereeId": null,
} satisfies UpdateGameRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateGameRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


