# IRowsChangedStateAction

Represents an action indicating that rows have changed.

## Properties

### type

```ts
type: "rows-changed"
```

The type of the action.

### rows

```ts
rows: IRowData[]
```

The updated rows data.

### total

```ts
total: number
```

The total number of rows, or null if unknown.
