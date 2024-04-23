# IFilterDataChangedStateAction

Represents an action indicating that filter data has changed.

## Properties

### type

```ts
type: "filterdata-changed"
```

The type of the action.

### filterData

```ts
filterData: Record<string, unknown>
```

The updated filter data.

### keepPagination

```ts
keepPagination: boolean
```

A flag indicating whether pagination should be kept.
