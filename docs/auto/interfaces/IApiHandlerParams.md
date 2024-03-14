# IApiHandlerParams

Represents the parameters for an API handler.

## Properties

### origin

```ts
origin: string
```

### requestMap

```ts
requestMap: (url: URL) => URL
```

### responseMap

```ts
responseMap: (json: Data) => Record<string, any> | Promise<Record<string, any>>
```

### onLoadBegin

```ts
onLoadBegin: () => void
```

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean) => void
```

### withAbortSignal

```ts
withAbortSignal: boolean
```

### fetchParams

```ts
fetchParams: () => RequestInit
```

### fallback

```ts
fallback: (e: Error) => void
```

### abortSignal

```ts
abortSignal: AbortSignal
```

### fetch

```ts
fetch: ((input: RequestInfo, init?: RequestInit) => Promise<Response>) & ((input: RequestInfo, init?: RequestInit) => Promise<...>)
```
