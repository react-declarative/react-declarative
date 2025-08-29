# IListProps

Interface for the List datagrid component props.

## Properties

### isBaseline

```ts
isBaseline: (field: IField<any, any>) => boolean
```

### isBaselineForRoot

```ts
isBaselineForRoot: (field: IField<any, any>) => boolean
```

### apiRef

```ts
apiRef: Ref<IListApi<FilterData, RowData>>
```

### AfterChips

```ts
AfterChips: ComponentType<IChipListSlot<any>>
```

Represents a React component that will be rendered after the chip list.

### BeforeSelectionLabel

```ts
BeforeSelectionLabel: ComponentType<any>
```

Represents a React component type for BeforeSelectionLabel.

### BeforeActionList

```ts
BeforeActionList: ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>
```

Represents a React component type for BeforeActionList.

### AfterActionList

```ts
AfterActionList: ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>
```

Represents a React component for AfterActionList.

### BeforeOperationList

```ts
BeforeOperationList: ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>
```

### AfterOperationList

```ts
AfterOperationList: ComponentType<IPositionActionListSlot<FilterData, RowData, Payload>>
```

Represents the AfterOperationList component.

This component is a React component that renders a list of actions to be displayed after a specific operation.
It is used to render the list of available actions, typically used for filtering or manipulating data.

### customTemplate

```ts
customTemplate: ComponentType<ITile<RowData, Payload>>
```

### pageItemTemplate

```ts
pageItemTemplate: ComponentType<ITile<RowData, Payload>>
```

### tileMode

```ts
tileMode: TileMode
```

Tiling mode for custom template

### customTemplateMinHeight

```ts
customTemplateMinHeight: number
```

Represents the minimum height for a custom template.

### pageItemTemplateMinHeight

```ts
pageItemTemplateMinHeight: number
```

Represents the minimum height for a page template.

### fetchDebounce

```ts
fetchDebounce: number
```

Represents the debounce time in milliseconds for performing fetch requests.

### className

```ts
className: string
```

### denseHeight

```ts
denseHeight: number
```

Represents the height of an element, measured in pixels.

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

### itemSx

```ts
itemSx: SxProps
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

### readTransform

```ts
readTransform: (value: string | string[], name: string, data: FilterData, payload: any) => Value
```

### writeTransform

```ts
writeTransform: (value: string | string[], name: string, data: FilterData, payload: any) => Value
```

### incomingTransform

```ts
incomingTransform: (data: any, payload: any) => FilterData
```

### outgoingTransform

```ts
outgoingTransform: (data: any, payload: any) => FilterData
```

### heightRequest

```ts
heightRequest: (height: number) => number
```

Represents a function that calculates the desired height based on the provided input height.

### widthRequest

```ts
widthRequest: (width: number) => number
```

Represents a function that takes a width value and returns a number.

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
rowColor: ((row: RowData) => string) | ((row: RowData) => Promise<string>)
```

### modalSizeRequest

```ts
modalSizeRequest: (size: ISize) => { height: number; width: number; sx?: SxProps<any>; }
```

Custom sizeRequest for modal filters

### isRowDisabled

```ts
isRowDisabled: (row: RowData, params: { filterData: FilterData; pagination: ListHandlerPagination; sortModel: ListHandlerSortModel<RowData>; chips: Partial<...>; search: string; payload: Payload; }) => boolean
```

Determines if a row is disabled based on various parameters.

### labelDisplayedRows

```ts
labelDisplayedRows: (paginationInfo: { from: number; to: number; count: number; page: number; }) => string
```

Returns a string containing information about the displayed rows label.

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

### withHideIfEmpty

```ts
withHideIfEmpty: boolean
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

### isPageItem

```ts
isPageItem: boolean
```

### isDense

```ts
isDense: boolean
```

### slots

```ts
slots: Partial<ISlotFactoryContext>
```
