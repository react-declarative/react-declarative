# IListApi

Represents an API for manipulating and retrieving data from a list.

## Properties

### reload

```ts
reload: (keepPagination?: boolean) => Promise<void>
```

### rerender

```ts
rerender: () => void
```

### setLimit

```ts
setLimit: (limit: number) => void
```

### setPage

```ts
setPage: (page: number) => void
```

### setRows

```ts
setRows: (rows: RowData[]) => void
```

### setFilterData

```ts
setFilterData: (filterData: FilterData) => void
```

### getState

```ts
getState: () => IListState<FilterData, RowData>
```
