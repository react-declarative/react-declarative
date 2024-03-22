# IListRowAction

Represents a row action for a list row.

## Properties

### isVisible

```ts
isVisible: (row: RowData, payload: Payload) => boolean | Promise<boolean>
```

Determines the visibility of a row based on the provided row data and payload.

### isDisabled

```ts
isDisabled: (row: RowData, payload: Payload) => boolean | Promise<boolean>
```

Checks if a row is disabled based on the row data and payload.

### enabled

```ts
enabled: boolean
```
