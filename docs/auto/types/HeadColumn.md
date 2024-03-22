# HeadColumn

```ts
export type HeadColumn<RowData extends IRowData = IAnything> = Omit<IColumn<RowData>, keyof {
    width: never;
}> & {
    width: string;
};
```

Represents a column in a table's header.
