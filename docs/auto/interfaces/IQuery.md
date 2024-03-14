# IQuery

Represents a query object used for filtering, sorting, and pagination.

## Properties

### filterData

```ts
filterData: Partial<FilterData>
```

### sortModel

```ts
sortModel: ListHandlerSortModel<RowData>
```

### chipData

```ts
chipData: Partial<Record<keyof RowData, boolean>>
```

### limit

```ts
limit: number
```

### page

```ts
page: number
```

### search

```ts
search: string
```
