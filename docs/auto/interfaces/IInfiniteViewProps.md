# IInfiniteViewProps

Represents the props for the InfiniteView component.

## Properties

### withScrollbar

```ts
withScrollbar: boolean
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

The system prop that allows defining system overrides as well as additional CSS styles.

### children

```ts
children: ReactNode
```

### hasMore

```ts
hasMore: boolean
```

### loading

```ts
loading: boolean
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
