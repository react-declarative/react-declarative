# ListHandlerResult

```ts
export type ListHandlerResult<RowData extends IRowData = IAnything> = RowData[] | {
    rows: RowData[];
    total: number | null;
};
```


