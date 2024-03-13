# FilterDataT

```ts
type FilterDataT<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> = Exclude<IQuery<FilterData, RowData>["filterData"], undefined>;
```


