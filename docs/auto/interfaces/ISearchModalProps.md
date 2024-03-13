# ISearchModalProps

## Properties

### fullScreen

```ts
fullScreen: boolean
```

### sizeRequest

```ts
sizeRequest: (size: ISize) => { height: number; width: number; sx?: SxProps<{}>; }
```

### title

```ts
title: string
```

### AfterTitle

```ts
AfterTitle: ComponentType<{ onClose?: () => void; payload: Payload; }>
```

### BeforeTitle

```ts
BeforeTitle: ComponentType<{ onClose?: () => void; payload: Payload; }>
```

### data

```ts
data: RowId[]
```

### selectionMode

```ts
selectionMode: SelectionMode
```

### onSubmit

```ts
onSubmit: (data: RowId[], payload: Payload) => boolean | Promise<boolean>
```

### onChange

```ts
onChange: (data: RowId[], initial: boolean) => void
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

### open

```ts
open: boolean
```

### hidden

```ts
hidden: boolean
```

### submitLabel

```ts
submitLabel: string
```
