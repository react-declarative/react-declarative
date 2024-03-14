# ILocalHandlerParams

Represents the parameters for a local handler

## Properties

### payload

```ts
payload: Payload
```

### resultMap

```ts
resultMap: (json: Record<string, any>) => Data
```

### onLoadBegin

```ts
onLoadBegin: () => void
```

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean) => void
```

### fallback

```ts
fallback: (e: Error) => void
```
