
# UpdatePhaseRequest

Payload utilisé pour modifier une phase existante.

## Properties

Name | Type
------------ | -------------
`name` | string
`details` | string
`order` | number
`type` | [PhaseType](PhaseType.md)

## Example

```typescript
import type { UpdatePhaseRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "details": null,
  "order": null,
  "type": null,
} satisfies UpdatePhaseRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdatePhaseRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


