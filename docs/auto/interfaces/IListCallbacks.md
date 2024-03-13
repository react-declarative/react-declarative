# IListCallbacks

Interface contract for callback functions used in IList functionality.

## Properties

### handleDefault

```ts
handleDefault: () => Promise<void>
```

### handleSortModel

```ts
handleSortModel: (sort: ListHandlerSortModel<RowData>) => void
```

### handleFilter

```ts
handleFilter: (data: FilterData, keepPagination?: boolean) => void
```

### handlePageChange

```ts
handlePageChange: (page: number) => void
```

### handleLimitChange

```ts
handleLimitChange: (limit: number) => void
```

### handleRowsChange

```ts
handleRowsChange: (rows: RowData[]) => void
```

### handleFiltersCollapsed

```ts
handleFiltersCollapsed: (filtersCollapsed: boolean) => void
```

### handleChips

```ts
handleChips: (chips: Partial<Record<string | number | symbol, boolean>>) => void
```

### handleReload

```ts
handleReload: (keepPagination?: boolean) => Promise<void>
```

### handleSearch

```ts
handleSearch: (search: string) => void
```

### handleRerender

```ts
handleRerender: () => void
```

### ready

```ts
ready: () => void
```
