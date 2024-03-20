# IIfProps

Represents the props for the IIf component.

## Properties

### Else

```ts
Else: ReactNode
```

### Loading

```ts
Loading: ReactNode
```

### condition

```ts
condition: boolean | ((payload: T) => boolean | Promise<boolean>)
```

### children

```ts
children: ReactNode
```

### fallback

```ts
fallback: (e: Error) => void
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
