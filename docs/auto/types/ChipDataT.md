# ChipDataT

```ts
type ChipDataT<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> = Exclude<IQuery<FilterData, RowData>["chipData"], undefined>;
```


