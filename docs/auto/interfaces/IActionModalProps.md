# IActionModalProps

## Properties

### sizeRequest

```ts
sizeRequest: (size: ISize) => { height: number; width: number; sx?: SxProps<{}>; }
```

### waitForChangesDelay

```ts
waitForChangesDelay: number
```

### withActionButton

```ts
withActionButton: boolean
```

### withStaticAction

```ts
withStaticAction: boolean
```

### fullScreen

```ts
fullScreen: boolean
```

### hidden

```ts
hidden: boolean
```

### readonly

```ts
readonly: boolean
```

### apiRef

```ts
apiRef: Ref<IOneApi<any>>
```

### fields

```ts
fields: Field[]
```

### title

```ts
title: string
```

### dirty

```ts
dirty: boolean
```

### param

```ts
param: Param
```

### features

```ts
features: string[] | Record<string, Value> | (() => string[] | Record<string, Value>)
```

### outlinePaper

```ts
outlinePaper: boolean
```

### transparentPaper

```ts
transparentPaper: boolean
```

### handler

```ts
handler: OneHandler<Data, Payload>
```

### payload

```ts
payload: Payload | (() => Payload)
```

### changeSubject

```ts
changeSubject: TSubject<Data>
```

### reloadSubject

```ts
reloadSubject: TSubject<void>
```

### onSubmit

```ts
onSubmit: (data: Data, payload: Payload, param: Param) => boolean | Promise<boolean>
```

### onChange

```ts
onChange: (data: Data, initial: boolean) => void
```

### onInvalid

```ts
onInvalid: (name: string, msg: string) => void
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

### AfterTitle

```ts
AfterTitle: ComponentType<{ onClose?: () => void; payload: Payload; param: Param; }>
```

### BeforeTitle

```ts
BeforeTitle: ComponentType<{ onClose?: () => void; payload: Payload; param: Param; }>
```

### throwError

```ts
throwError: boolean
```

### open

```ts
open: boolean
```

### submitLabel

```ts
submitLabel: string
```
