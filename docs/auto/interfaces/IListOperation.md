# IListOperation

Represents an operation that can be performed on a list of row data.

## Properties

### isAvailable

```ts
isAvailable: boolean | ((rowIds: RowData[], isAll: boolean, payload: Payload) => boolean | Promise<boolean>)
```

Determines if the 'isAvailable' variable is a function or a boolean.
