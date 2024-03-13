# IRecordViewProps

Interface for the props of the RecordView component.

## Properties

### background

```ts
background: string
```

### data

```ts
data: Data
```

### search

```ts
search: string
```

### keyWidth

```ts
keyWidth: GridSize
```

### valueWidth

```ts
valueWidth: GridSize
```

### totalWidth

```ts
totalWidth: number
```

### withExpandAll

```ts
withExpandAll: boolean
```

### withExpandRoot

```ts
withExpandRoot: boolean
```

### expandList

```ts
expandList: string[]
```

### withExpandLevel

```ts
withExpandLevel: number
```

### formatValue

```ts
formatValue: (key: string, value: string | number | boolean, path: string) => ReactNode
```

### formatKey

```ts
formatKey: (key: string, path: string) => ReactNode
```

### onSearchChanged

```ts
onSearchChanged: (search: string) => void
```

### BeforeSearch

```ts
BeforeSearch: ComponentType<any>
```

### AfterSearch

```ts
AfterSearch: ComponentType<any>
```

### payload

```ts
payload: Payload
```
