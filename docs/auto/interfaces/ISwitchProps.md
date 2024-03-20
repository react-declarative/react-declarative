# ISwitchProps

Represents the properties for the Switch component.

## Properties

### className

```ts
className: string
```

### style

```ts
style: CSSProperties
```

### items

```ts
items: ISwitchItem[]
```

### fallback

```ts
fallback: (e: Error) => void
```

### history

```ts
history: MemoryHistory | BrowserHistory | HashHistory
```

### Forbidden

```ts
Forbidden: ComponentType<any>
```

### NotFound

```ts
NotFound: ComponentType<any>
```

### Loader

```ts
Loader: ComponentType<any>
```

### Error

```ts
Error: ComponentType<any>
```

### animation

```ts
animation: "none" | "scale" | "slideDown" | "fadeIn"
```

### onLoadStart

```ts
onLoadStart: () => void
```

### onLoadEnd

```ts
onLoadEnd: (isOk?: boolean) => void
```

### onInit

```ts
onInit: () => void
```

### onDispose

```ts
onDispose: () => void
```

### throwError

```ts
throwError: boolean
```

### children

```ts
children: (result: ISwitchResult) => ReactNode
```
