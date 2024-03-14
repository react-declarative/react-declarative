# IArrayPaginatorParams

Interface representing the parameters for array pagination.

## Properties

### filterHandler

```ts
filterHandler: (rows: RowData[], filterData: FilterData) => RowData[]
```

### chipsHandler

```ts
chipsHandler: (rows: RowData[], chips: Partial<Record<keyof RowData, boolean>>) => RowData[]
```

### sortHandler

```ts
sortHandler: (rows: RowData[], sort: ListHandlerSortModel<RowData>) => RowData[]
```

### paginationHandler

```ts
paginationHandler: (rows: RowData[], pagination: ListHandlerPagination) => RowData[]
```

### responseMap

```ts
responseMap: (json: RowData[]) => Record<string, any>[] | Promise<Record<string, any>[]>
```

### searchHandler

```ts
searchHandler: (rows: RowData[], search: string) => RowData[]
```

### compareFn

```ts
compareFn: (a: RowData, b: RowData, field: keyof RowData) => number
```

### removeEmptyFilters

```ts
removeEmptyFilters: (data: FilterData) => Partial<FilterData>
```

### withPagination

```ts
withPagination: boolean
```

### withFilters

```ts
withFilters: boolean
```

### withChips

```ts
withChips: boolean
```

### withSort

```ts
withSort: boolean
```

### withTotal

```ts
withTotal: boolean
```

### withSearch

```ts
withSearch: boolean
```

### searchEntries

```ts
searchEntries: string[]
```

### searchFilterChars

```ts
searchFilterChars: string[]
```

### fallback

```ts
fallback: (e: Error) => void
```

### onData

```ts
onData: (rows: RowData[], state: IState<FilterData, RowData>) => void
```

### onLoadStart

```ts
onLoadStart: () => void
```

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean) => void
```
