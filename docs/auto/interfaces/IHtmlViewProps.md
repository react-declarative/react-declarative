# IHtmlViewProps

Props for the HtmlView component.

## Properties

### children

```ts
children: ReactNode
```

### config

```ts
config: Partial<IConfig>
```

### handler

```ts
handler: (p: T) => string | Promise<string>
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
