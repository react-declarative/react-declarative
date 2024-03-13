# IKanbanViewProps

## Properties

### reloadSubject

```ts
reloadSubject: TSubject<void>
```

### ref

```ts
ref: Ref<HTMLDivElement>
```

### deps

```ts
deps: any[]
```

### withUpdateOrder

```ts
withUpdateOrder: boolean
```

### withGoBack

```ts
withGoBack: boolean
```

### withHeaderTooltip

```ts
withHeaderTooltip: boolean
```

### className

```ts
className: string
```

### rowTtl

```ts
rowTtl: number
```

### style

```ts
style: CSSProperties
```

### sx

```ts
sx: SxProps<any>
```

### payload

```ts
payload: (() => Payload) | Payload
```

### disabled

```ts
disabled: boolean
```

### items

```ts
items: IBoardItem<Data, Payload, ColumnType>[]
```

### columns

```ts
columns: IBoardColumn<Data, Payload, ColumnType>[]
```

### bufferSize

```ts
bufferSize: number
```

### minRowHeight

```ts
minRowHeight: number
```

### cardLabel

```ts
cardLabel: ReactNode | ((id: string, data: Data, payload: Payload) => ReactNode | Promise<ReactNode>)
```

### onChangeColumn

```ts
onChangeColumn: (id: string, column: ColumnType, data: Data, payload: any) => void | Promise<void>
```

### onCardLabelClick

```ts
onCardLabelClick: (id: string, data: Data, payload: any) => void
```

### onDataRequest

```ts
onDataRequest: (initial: boolean) => void
```

### onLoadStart

```ts
onLoadStart: () => void
```

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean) => void
```

### fallback

```ts
fallback: (e: Error) => void
```

### filterFn

```ts
filterFn: (item: IBoardItem<Data, Payload, ColumnType>) => boolean
```

### throwError

```ts
throwError: boolean
```

### AfterCardContent

```ts
AfterCardContent: ComponentType<{ id: string; data: Data; payload: any; }>
```

### BeforeColumnTitle

```ts
BeforeColumnTitle: ComponentType<{ column: ColumnType; payload: any; }>
```

### AfterColumnTitle

```ts
AfterColumnTitle: ComponentType<{ column: ColumnType; payload: any; }>
```
