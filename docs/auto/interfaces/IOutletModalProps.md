# IOutletModalProps

Interface for the OutletModalProps class.

## Properties

### sizeRequest

```ts
sizeRequest: (size: ISize) => { height: number; width: number; sx?: SxProps<any>; }
```

### fullScreen

```ts
fullScreen: boolean
```

### withActionButton

```ts
withActionButton: boolean
```

Specifies whether the component should include an action button.

### withStaticAction

```ts
withStaticAction: boolean
```

Indicates whether the action being performed is static or not.

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

Handles the onSubmit event.

### AfterTitle

```ts
AfterTitle: ComponentType<{ onClose: () => void; data: Data; id: string; }>
```

Represents the AfterTitle component.

### BeforeTitle

```ts
BeforeTitle: ComponentType<{ onClose: () => void; data: Data; id: string; }>
```

BeforeTitle is a React component that renders a title with a close button.

### routes

```ts
routes: IOutletModal<Data, Payload, Params>[]
```

Represents an array of outlet modals routes.

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

### submitIcon

```ts
submitIcon: ComponentType<any>
```

### mapPayload

```ts
mapPayload: (id: string, data: Record<string, any>[]) => Payload | Promise<Payload>
```

Maps the payload with the given ID and data.

### mapParams

```ts
mapParams: (id: string, data: Record<string, any>[]) => Params | Promise<Params>
```

Maps the given data into parameters based on the provided id.

### mapInitialData

```ts
mapInitialData: (id: string, data: Record<string, any>[]) => Data | Promise<Data>
```

Represents a function to initialize data based on given ID and data.

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
