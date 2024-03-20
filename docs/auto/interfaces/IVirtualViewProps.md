# IVirtualViewProps

Represents the props for the VirtualView component.

## Properties

### withScrollbar

```ts
withScrollbar: boolean
```

### loading

```ts
loading: boolean
```

### hasMore

```ts
hasMore: boolean
```

### minRowHeight

```ts
minRowHeight: number
```

### bufferSize

```ts
bufferSize: number
```

### children

```ts
children: ReactNode
```

### scrollXSubject

```ts
scrollXSubject: TSubject<number>
```

### scrollYSubject

```ts
scrollYSubject: TSubject<number>
```

### onDataRequest

```ts
onDataRequest: (initial: boolean) => void | Promise<void>
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

### throwError

```ts
throwError: boolean
```
