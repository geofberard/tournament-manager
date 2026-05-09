
# AdminSession

Etat de la session admin courante.

## Properties

Name | Type
------------ | -------------
`authenticated` | boolean
`username` | string

## Example

```typescript
import type { AdminSession } from ''

// TODO: Update the object below with actual values
const example = {
  "authenticated": null,
  "username": null,
} satisfies AdminSession

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminSession
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


