# IAsyncProps

Represents the properties for an asynchronous component.

## Properties

### loading

```ts
loading: boolean
```

### reloadSubject

```ts
reloadSubject: TSubject<void>
```

### children

```ts
children: (p: T) => Result | Promise<Result>
```

### fallback

```ts
fallback: (e: Error) => void
```

### Loader

```ts
Loader: ComponentType<any>
```

### Error

```ts
Error: ComponentType<any>
```

### onLoadStart

```ts
onLoadStart: () => void
```

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean) => void
```

### payload

```ts
payload: T
```

### deps

```ts
deps: any[]
```

### throwError

```ts
throwError: boolean
```
