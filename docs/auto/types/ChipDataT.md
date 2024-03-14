# ChipDataT

```ts
type ChipDataT<FilterData extends {} = IAnything, RowData extends IRowData = IAnything> = Exclude<IQuery<FilterData, RowData>["chipData"], undefined>;
```

Represents a type for chip data in a query result.
