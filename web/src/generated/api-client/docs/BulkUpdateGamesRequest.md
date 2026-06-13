
# BulkUpdateGamesRequest

Payload utilisé pour appliquer les mêmes modifications à plusieurs matchs.

## Properties

Name | Type
------------ | -------------
`gameIds` | Set&lt;string&gt;
`changes` | [BulkGameChanges](BulkGameChanges.md)

## Example

```typescript
import type { BulkUpdateGamesRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "gameIds": null,
  "changes": null,
} satisfies BulkUpdateGamesRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BulkUpdateGamesRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


