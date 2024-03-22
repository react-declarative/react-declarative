# TSort

```ts
export type TSort<T> = {
    sortDirection: "ASC" | "DESC";
    value: IColumn<T>["field"];
};
```

Represents a TSort object used for sorting data in a specific direction based on a column value.
