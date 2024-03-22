# BodyColumn

```ts
export type BodyColumn<RowData extends IRowData = IAnything> = Omit<IColumn<RowData>, keyof {
    width: never;
}> & {
    width: string;
};
```

Represents a column in the body of a table.
