# IListApi

Represents an API for manipulating and retrieving data from a list.

## Properties

### reload

```ts
reload: (keepPagination?: boolean) => Promise<void>
```

Reloads the data.

### rerender

```ts
rerender: () => void
```

Function to trigger a re-render of the component or element.

### setLimit

```ts
setLimit: (limit: number) => void
```

Sets the limit value for a given variable.

### setPage

```ts
setPage: (page: number) => void
```

Sets the current page number of the application.

### setRows

```ts
setRows: (rows: RowData[]) => void
```

Sets the rows for the data table.

### setFilterData

```ts
setFilterData: (filterData: FilterData) => void
```

Sets the filter data for filtering data.

### getState

```ts
getState: () => IListState<FilterData, RowData>
```

Retrieves the state of the list.
