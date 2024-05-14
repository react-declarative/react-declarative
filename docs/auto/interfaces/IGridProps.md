# IGridProps

Represents the properties of the IGrid component.

## Properties

### outlinePaper

```ts
outlinePaper: boolean
```

### transparentPaper

```ts
transparentPaper: boolean
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
style: React.CSSProperties
```

### sx

```ts
sx: SxProps<any>
```

### header

```ts
header: React.ReactNode
```

### data

```ts
data: T[]
```

### columns

```ts
columns: IColumn<T>[]
```

### scrollXSubject

```ts
scrollXSubject: TSubject<number>
```

### scrollYSubject

```ts
scrollYSubject: TSubject<number>
```

### onTableRowClick

```ts
onTableRowClick: (evt: React.MouseEvent, row: T) => void
```

### onRowClick

```ts
onRowClick: (row: T) => void
```

### rowActions

```ts
rowActions: IGridAction<T>[]
```

### payload

```ts
payload: P | (() => P)
```

### onRowAction

```ts
onRowAction: (action: string, row: T) => void
```

### recomputeSubject

```ts
recomputeSubject: TSubject<void>
```

### loading

```ts
loading: boolean
```

### hasMore

```ts
hasMore: boolean
```

### rowMark

```ts
rowMark: ((row: any) => string) | ((row: any) => Promise<string>)
```

### rowColor

```ts
rowColor: ((row: any) => string) | ((row: any) => Promise<string>)
```

### onSkip

```ts
onSkip: (initial: boolean) => void
```

### onButtonSkip

```ts
onButtonSkip: () => void
```

### rowKey

```ts
rowKey: keyof T
```

### sort

```ts
sort: TSort<T>
```

### errorMessage

```ts
errorMessage: string
```

### selectionMode

```ts
selectionMode: SelectionMode
```

### onClickHeaderColumn

```ts
onClickHeaderColumn: (value: keyof T) => void
```

### onSelectedRows

```ts
onSelectedRows: (rowIds: string[], initialChange: boolean) => void
```

### selectedRows

```ts
selectedRows: string[]
```

### minRowHeight

```ts
minRowHeight: number
```

### bufferSize

```ts
bufferSize: number
```
