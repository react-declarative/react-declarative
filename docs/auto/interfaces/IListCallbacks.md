# IListCallbacks

Interface contract for callback functions used in IList functionality.

## Properties

### handleDefault

```ts
handleDefault: () => Promise<void>
```

Handles the list state reset.

### handleSortModel

```ts
handleSortModel: (sort: ListHandlerSortModel<RowData>) => void
```

Handles the sort model for the given sort.

### handleFilter

```ts
handleFilter: (data: FilterData, keepPagination?: boolean) => void
```

Handles the filter action.

### handlePageChange

```ts
handlePageChange: (page: number) => void
```

Handle page change function.

### handleLimitChange

```ts
handleLimitChange: (limit: number) => void
```

Handles a change in the limit value.

### handleRowsChange

```ts
handleRowsChange: (rows: RowData[]) => void
```

Callback function to handle changes in rows.

### handleFiltersCollapsed

```ts
handleFiltersCollapsed: (filtersCollapsed: boolean) => void
```

Handles the event when the filters are collapsed or expanded.

### handleChips

```ts
handleChips: (chips: Partial<Record<string | number | symbol, boolean>>) => void
```

Handles the chips list.

### handleReload

```ts
handleReload: (keepPagination?: boolean) => Promise<void>
```

Reloads the data and updates the UI.

### handleSearch

```ts
handleSearch: (search: string) => void
```

Handles the search action.

### handleRerender

```ts
handleRerender: () => void
```

Function to handle re-rendering.

### computeKeepPageOnReload

```ts
computeKeepPageOnReload: () => boolean
```

### ready

```ts
ready: () => void
```
