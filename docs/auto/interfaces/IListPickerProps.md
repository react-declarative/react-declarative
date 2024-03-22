# IListPickerProps

Represents the props for the IListPicker component.

## Properties

### onChange

```ts
onChange: (data: RowId[]) => void
```

### handler

```ts
handler: ListHandler<RowData, any, any>
```

### selectionMode

```ts
selectionMode: SelectionMode.Single | SelectionMode.Multiple
```

### columns

```ts
columns: Omit<IColumn<RowData, any, any>, "width" | "headerName">[]
```

### selectedRows

```ts
selectedRows: RowId[]
```

### payload

```ts
payload: any
```

### features

```ts
features: string[] | Record<string, Value> | (() => string[] | Record<string, Value>)
```

### minHeight

```ts
minHeight: number
```

### minWidth

```ts
minWidth: number
```

### title

```ts
title: string
```

### open

```ts
open: boolean
```

### rowActions

```ts
rowActions: IListRowAction<any, any>[]
```
