# IOutletModalProps

Interface for the OutletModalProps class.

## Properties

### sizeRequest

```ts
sizeRequest: (size: ISize) => { height: number; width: number; sx?: SxProps<{}>; }
```

### fullScreen

```ts
fullScreen: boolean
```

### withActionButton

```ts
withActionButton: boolean
```

### withStaticAction

```ts
withStaticAction: boolean
```

### outletIdSubject

```ts
outletIdSubject: TBehaviorSubject<string>
```

### title

```ts
title: string
```

### fetchState

```ts
fetchState: TupleState<string, any, any, any, any, any, any, any, any, any, any> | ObjectState<string, any>
```

### reloadSubject

```ts
reloadSubject: TSubject<void>
```

### onSubmit

```ts
onSubmit: (id: string, data: Data, payload: Payload) => boolean | Promise<boolean>
```

### AfterTitle

```ts
AfterTitle: ComponentType<{ onClose: () => void; data: Data; id: string; }>
```

### BeforeTitle

```ts
BeforeTitle: ComponentType<{ onClose: () => void; data: Data; id: string; }>
```

### routes

```ts
routes: IOutletModal<Data, Payload, Params>[]
```

### data

```ts
data: Data
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

### hidden

```ts
hidden: boolean
```

### submitLabel

```ts
submitLabel: string
```

### mapPayload

```ts
mapPayload: (id: string, data: Record<string, any>[]) => Payload | Promise<Payload>
```

### mapParams

```ts
mapParams: (id: string, data: Record<string, any>[]) => Params | Promise<Params>
```

### mapInitialData

```ts
mapInitialData: (id: string, data: Record<string, any>[]) => Data | Promise<Data>
```

### onMount

```ts
onMount: () => void
```

### onUnmount

```ts
onUnmount: () => void
```

### onClose

```ts
onClose: () => void
```
