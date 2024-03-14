# IStaticHandlerParams

Interface defining the properties of the IStaticHandlerParams class.

## Properties

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
