# IBreadcrumbs2Props

An interface representing the props for the IBreadcrumbs2 component.

## Properties

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

### onAction

```ts
onAction: (action: string) => void | Promise<void>
```

### actions

```ts
actions: IBreadcrumbs2Action<T>[]
```

### items

```ts
items: IBreadcrumbs2Option<T>[]
```

### payload

```ts
payload: T
```

### BeforeMenuContent

```ts
BeforeMenuContent: ComponentType<any>
```

### AfterMenuContent

```ts
AfterMenuContent: ComponentType<any>
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
