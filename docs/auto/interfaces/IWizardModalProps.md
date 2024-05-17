# IWizardModalProps

Interface for props of the WizardModal component.

## Properties

### sizeRequest

```ts
sizeRequest: (size: ISize) => { height: number; width: number; sx?: SxProps<any>; }
```

### openSubject

```ts
openSubject: TBehaviorSubject<boolean>
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

### title

```ts
title: string
```

### fetchState

```ts
fetchState: TupleState<object, any, any, any, any, any, any, any, any, any, any> | ObjectState<object, any>
```

### reloadSubject

```ts
reloadSubject: TSubject<void>
```

### onSubmit

```ts
onSubmit: (data: Data, payload: Payload) => boolean | Promise<boolean>
```

### AfterTitle

```ts
AfterTitle: ComponentType<{ onClose: () => void; data: Data; }>
```

### BeforeTitle

```ts
BeforeTitle: ComponentType<{ onClose: () => void; data: Data; }>
```

### routes

```ts
routes: IWizardModal<Data, Payload>[]
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
mapPayload: (data: Record<string, any>[]) => Payload | Promise<Payload>
```

### mapInitialData

```ts
mapInitialData: (data: Record<string, any>[]) => Data | Promise<Data>
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
