# IOutletViewProps

Props for OutletView component

## Properties

### fullScreen

```ts
fullScreen: boolean
```

### waitForChangesDelay

```ts
waitForChangesDelay: number
```

### history

```ts
history: History
```

### readonly

```ts
readonly: boolean
```

### animation

```ts
animation: "none" | "scale" | "slideDown" | "fadeIn"
```

### payload

```ts
payload: Payload | (() => Payload)
```

### params

```ts
params: Params
```

### routes

```ts
routes: IOutlet<Data, Payload, Params, OtherProps>[]
```

### initialData

```ts
initialData: Data | (() => Data)
```

### changed

```ts
changed: boolean | ((data: Data, payload: Payload) => boolean)
```

### onChange

```ts
onChange: (data: Data, initial: boolean, payload: Payload, source: string) => void
```

### onSubmit

```ts
onSubmit: (data: Data, payload: Payload, config: { afterSave: () => Promise<void>; }) => boolean | Promise<boolean>
```

### onLeave

```ts
onLeave: () => void
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
fallback: (error: Error) => void
```

### changeSubject

```ts
changeSubject: TSubject<[keyof Data, Data]>
```

### otherProps

```ts
otherProps: OtherProps
```
