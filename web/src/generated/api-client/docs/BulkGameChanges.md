
# BulkGameChanges

Modifications partielles à appliquer à chaque match ciblé.  Une propriété absente conserve la valeur actuelle. `clearName` et `clearReferee` permettent d\'effacer explicitement les valeurs optionnelles correspondantes.

## Properties

Name | Type
------------ | -------------
`phaseId` | string
`name` | string
`clearName` | boolean
`group` | string
`time` | Date
`court` | string
`status` | [GameStatus](GameStatus.md)
`refereeId` | string
`clearReferee` | boolean

## Example

```typescript
import type { BulkGameChanges } from ''

// TODO: Update the object below with actual values
const example = {
  "phaseId": null,
  "name": null,
  "clearName": null,
  "group": null,
  "time": null,
  "court": null,
  "status": null,
  "refereeId": null,
  "clearReferee": null,
} satisfies BulkGameChanges

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BulkGameChanges
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


