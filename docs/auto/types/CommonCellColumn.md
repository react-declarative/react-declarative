# CommonCellColumn

```ts
export type CommonCellColumn<RowData extends IRowData = IAnything> = Omit<IColumn<RowData>, keyof {
    width: never;
}> & {
    width: string;
};
```

Represents a common cell column.
