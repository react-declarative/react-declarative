# ILoaderViewProps

Interface for the props of the LoaderView component.

## Properties

### onLoadStart

```ts
onLoadStart: () => void
```

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean) => void
```

### handler

```ts
handler: () => void | Promise<void>
```

### fallback

```ts
fallback: (e: Error) => void
```

### throwError

```ts
throwError: boolean
```

### size

```ts
size: string | number
```

### variant

```ts
variant: "determinate" | "indeterminate"
```

### value

```ts
value: number
```
