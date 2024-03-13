# IFilesViewProps

## Properties

### items

```ts
items: string[]
```

### disabled

```ts
disabled: boolean
```

### onUpload

```ts
onUpload: (file: File) => string | Promise<string>
```

### onRemove

```ts
onRemove: (item: string) => void | Promise<void>
```

### onChange

```ts
onChange: (items: string[]) => void | Promise<void>
```

### onClick

```ts
onClick: (item: string) => void | Promise<void>
```

### tr

```ts
tr: (item: string) => string | Promise<string>
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

### accept

```ts
accept: string
```

### multiple

```ts
multiple: boolean
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
