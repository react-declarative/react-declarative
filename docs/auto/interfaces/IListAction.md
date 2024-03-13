# IListAction

Represents an action that can be performed on a list of data.

## Properties

### type

```ts
type: ActionType
```

### action

```ts
action: string
```

### label

```ts
label: string
```

### isVisible

```ts
isVisible: (selectedRows: RowData[], payload: Payload) => boolean | Promise<boolean>
```

### isDisabled

```ts
isDisabled: (selectedRows: RowData[], payload: Payload) => boolean | Promise<boolean>
```

### icon

```ts
icon: ComponentType<any>
```

### options

```ts
options: (IListActionOption<RowData, any> | IUpdateOption<RowData> | IResortOption<RowData> | IDropFiltersOption<RowData> | IAddFiltersOption<...>)[]
```
