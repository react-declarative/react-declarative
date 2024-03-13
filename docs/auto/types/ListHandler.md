# ListHandler

```ts
export type ListHandler<FilterData extends {} = IAnything, RowData extends IRowData = IAnything, Payload = IAnything> = RowData[] | ((data: FilterData, pagination: ListHandlerPagination, sort: ListHandlerSortModel<RowData>, chips: ListHandlerChips<RowData>, search: string, payload: Payload) => Promise<ListHandlerResult<RowData>> | ListHandlerResult<RowData>);
```

Represents a ListHandler class that handles filtering, pagination, sorting, and searching data.
