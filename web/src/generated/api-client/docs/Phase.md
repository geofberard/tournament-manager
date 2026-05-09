
# Phase

Phase du tournoi a laquelle appartient le match.

## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`details` | string
`order` | number
`type` | [PhaseType](PhaseType.md)

## Example

```typescript
import type { Phase } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "details": null,
  "order": null,
  "type": null,
} satisfies Phase

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Phase
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


