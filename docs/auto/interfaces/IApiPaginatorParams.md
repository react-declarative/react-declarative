# IApiPaginatorParams

Represents the parameters required for pagination in an API request.

## Properties

### origin

```ts
origin: string
```

### fetch

```ts
fetch: ((input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) & ((input: RequestInfo | URL, init?: RequestInit) => Promise<...>)
```

### requestMap

```ts
requestMap: (url: URL) => URL
```

### removeEmptyFilters

```ts
removeEmptyFilters: (data: FilterData) => Partial<FilterData>
```

### filterHandler

```ts
filterHandler: (url: URL, filterData: FilterData) => URL
```

### chipsHandler

```ts
chipsHandler: (url: URL, chips: Partial<Record<keyof RowData, boolean>>) => URL
```

### sortHandler

```ts
sortHandler: (url: URL, sort: ListHandlerSortModel<RowData>) => URL
```

### searchHandler

```ts
searchHandler: (url: URL, search: string) => URL
```

### paginationHandler

```ts
paginationHandler: (url: URL, pagination: ListHandlerPagination) => URL
```

### onLoadBegin

```ts
onLoadBegin: () => void
```

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean) => void
```

### withAbortSignal

```ts
withAbortSignal: boolean
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

### withSearch

```ts
withSearch: boolean
```

### withSort

```ts
withSort: boolean
```

### fetchParams

```ts
fetchParams: () => RequestInit
```

### fallback

```ts
fallback: (e: Error) => void
```

### abortSignal

```ts
abortSignal: AbortSignal
```

### responseMap

```ts
responseMap: <T extends IRowData>(json: RowData[]) => ListHandlerResult<T> | Promise<ListHandlerResult<T>>
```
