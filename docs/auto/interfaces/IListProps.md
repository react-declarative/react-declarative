# IListProps

Interface for the List datagrid component props.

## Properties

### apiRef

```ts
apiRef: Ref<IListApi<FilterData, RowData>>
```

### BeforeActionList

```ts
BeforeActionList: ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>
```

### AfterActionList

```ts
AfterActionList: ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>
```

### BeforeOperationList

```ts
BeforeOperationList: ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>
```

### AfterOperationList

```ts
AfterOperationList: ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>
```

### customTemplate

```ts
customTemplate: ComponentType<ITile<RowData, Payload>>
```

### customTemplateMinHeight

```ts
customTemplateMinHeight: number
```

### fetchDebounce

```ts
fetchDebounce: number
```

### className

```ts
className: string
```

### denseHeight

```ts
denseHeight: number
```

### style

```ts
style: CSSProperties
```

### title

```ts
title: string
```

### withRawSearch

```ts
withRawSearch: boolean
```

### filterLabel

```ts
filterLabel: string
```

### actions

```ts
actions: IListAction<RowData, Payload>[]
```

### operations

```ts
operations: IListOperation<RowData, Payload>[]
```

### limit

```ts
limit: number
```

### page

```ts
page: number
```

### sizeByElement

```ts
sizeByElement: boolean
```

### selectedRows

```ts
selectedRows: RowId[]
```

### features

```ts
features: string[] | Record<string, Value> | (() => string[] | Record<string, Value>)
```

### heightRequest

```ts
heightRequest: (height: number) => number
```

### widthRequest

```ts
widthRequest: (width: number) => number
```

### onRows

```ts
onRows: (rows: RowData[]) => void
```

### onSelectedRows

```ts
onSelectedRows: (rowIds: RowId[], initialChange: boolean) => void
```

### onFilterChange

```ts
onFilterChange: (data: FilterData) => void
```

### onChipsChange

```ts
onChipsChange: (data: Partial<Record<keyof RowData, boolean>>) => void
```

### onSearchChange

```ts
onSearchChange: (search: string) => void
```

### onSortModelChange

```ts
onSortModelChange: (sort: ListHandlerSortModel<RowData>) => void
```

### onOperation

```ts
onOperation: (action: string, selectedRows: RowData[], isAll: boolean, reload: (keepPagination?: boolean) => Promise<void>) => void
```

### onRowAction

```ts
onRowAction: (action: string, row: RowData, reload: (keepPagination?: boolean) => Promise<void>) => void
```

### onRowClick

```ts
onRowClick: (row: RowData, reload: (keepPagination?: boolean) => Promise<void>) => void
```

### onPageChange

```ts
onPageChange: (page: number) => void
```

### onColumnAction

```ts
onColumnAction: (field: string, action: string, selectedRows: RowData[], reload: (keepPagination?: boolean) => Promise<void>) => void
```

### onLimitChange

```ts
onLimitChange: (limit: number) => void
```

### onLoadStart

```ts
onLoadStart: (source: string) => void
```

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean, source: string) => void
```

### onAction

```ts
onAction: (action: string, selectedRows: RowData[], reload: (keepPagination?: boolean) => Promise<void>) => void
```

### columns

```ts
columns: IColumn<FilterData, RowData, Payload>[]
```

### filters

```ts
filters: Field[]
```

### handler

```ts
handler: ListHandler<FilterData, RowData, any>
```

### payload

```ts
payload: Payload | (() => Payload)
```

### rowMark

```ts
rowMark: ((row: RowData) => string) | ((row: RowData) => Promise<string>)
```

### rowColor

```ts
rowColor: (row: RowData) => string
```

### isRowDisabled

```ts
isRowDisabled: (row: RowData, params: { filterData: FilterData; pagination: ListHandlerPagination; sortModel: ListHandlerSortModel<RowData>; chips: Partial<...>; search: string; payload: Payload; }) => boolean
```

### labelDisplayedRows

```ts
labelDisplayedRows: (paginationInfo: { from: number; to: number; count: number; page: number; }) => string
```

### fallback

```ts
fallback: (e: Error) => void
```

### reloadSubject

```ts
reloadSubject: TSubject<void>
```

### rerenderSubject

```ts
rerenderSubject: TSubject<void>
```

### setLimitSubject

```ts
setLimitSubject: TSubject<number>
```

### setPageSubject

```ts
setPageSubject: TSubject<number>
```

### setRowsSubject

```ts
setRowsSubject: TSubject<RowData[]>
```

### setFilterDataSubject

```ts
setFilterDataSubject: TSubject<FilterData>
```

### rowActions

```ts
rowActions: IListRowAction<any, any>[]
```

### noDisplayedRows

```ts
noDisplayedRows: boolean
```

### withCustomFilters

```ts
withCustomFilters: boolean
```

### withOutlinePaper

```ts
withOutlinePaper: boolean
```

### withTransparentPaper

```ts
withTransparentPaper: boolean
```

### withSingleChip

```ts
withSingleChip: boolean
```

### withAllListOperations

```ts
withAllListOperations: boolean
```

### withSelectOnRowClick

```ts
withSelectOnRowClick: boolean
```

### withToggledFilters

```ts
withToggledFilters: boolean
```

### withSingleSort

```ts
withSingleSort: boolean
```

### withSearch

```ts
withSearch: boolean
```

### withLoader

```ts
withLoader: boolean
```

### withMobile

```ts
withMobile: boolean
```

### withArrowPagination

```ts
withArrowPagination: boolean
```

### withRangePagination

```ts
withRangePagination: boolean
```

### withInitialLoader

```ts
withInitialLoader: boolean
```

### selectionLabel

```ts
selectionLabel: (size: number) => string | Promise<string>
```

### rowsPerPage

```ts
rowsPerPage: (number | { value: number; label: string; })[]
```

### selectionMode

```ts
selectionMode: SelectionMode
```

### chips

```ts
chips: IListChip<RowData>[]
```

### chipData

```ts
chipData: Partial<Record<keyof RowData, boolean>>
```

### search

```ts
search: string
```

### filterData

```ts
filterData: Partial<FilterData>
```

### sortModel

```ts
sortModel: ListHandlerSortModel<RowData>
```

### isChooser

```ts
isChooser: boolean
```

### isInfinite

```ts
isInfinite: boolean
```

### isCustom

```ts
isCustom: boolean
```

### isDense

```ts
isDense: boolean
```

### slots

```ts
slots: Partial<ISlotFactoryContext>
```
