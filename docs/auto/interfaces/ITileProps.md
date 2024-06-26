# ITileProps

Represents the properties required for the `ITile` component.

## Properties

### withHeader

```ts
withHeader: boolean
```

### headerLabel

```ts
headerLabel: string
```

### mode

```ts
mode: TileMode
```

### noDataLabel

```ts
noDataLabel: string
```

### className

```ts
className: string
```

### style

```ts
style: CSSProperties
```

### sx

```ts
sx: SxProps<any>
```

### itemSx

```ts
itemSx: SxProps<any>
```

### loading

```ts
loading: boolean
```

### hasMore

```ts
hasMore: boolean
```

### scrollYSubject

```ts
scrollYSubject: TSubject<number>
```

### scrollXSubject

```ts
scrollXSubject: TSubject<number>
```

### errorMessage

```ts
errorMessage: string
```

### bufferSize

```ts
bufferSize: number
```

### minRowHeight

```ts
minRowHeight: number
```

### children

```ts
children: ComponentType<ITile<Data, Payload>>
```

### rowKey

```ts
rowKey: string | number | symbol
```

### payload

```ts
payload: Payload | (() => Payload)
```

### data

```ts
data: Data[]
```

### onSkip

```ts
onSkip: (initial: boolean) => void
```

### onButtonSkip

```ts
onButtonSkip: () => void
```

### onItemClick

```ts
onItemClick: (item: { data: Data; payload: Payload; isSelected: boolean; toggleSelection: () => void; }) => void
```

### selectionMode

```ts
selectionMode: SelectionMode
```

### recomputeSubject

```ts
recomputeSubject: TSubject<void>
```

### rowMark

```ts
rowMark: ((row: Data) => string) | ((row: Data) => Promise<string>)
```

### rowColor

```ts
rowColor: ((row: Data) => string) | ((row: Data) => Promise<string>)
```

### onSelectedRows

```ts
onSelectedRows: (rowIds: string[], initialChange: boolean) => void
```

### selectedRows

```ts
selectedRows: string[]
```
