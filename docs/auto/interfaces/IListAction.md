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

Determines the visibility of a certain element based on the provided parameters.

### isDisabled

```ts
isDisabled: (selectedRows: RowData[], payload: Payload) => boolean | Promise<boolean>
```

Checks if a row or a payload is disabled

### icon

```ts
icon: ComponentType<any>
```

### options

```ts
options: (IListActionOption<RowData, any> | IUpdateOption<RowData> | IResortOption<RowData> | IDropFiltersOption<RowData> | IAddFiltersOption<...>)[]
```
