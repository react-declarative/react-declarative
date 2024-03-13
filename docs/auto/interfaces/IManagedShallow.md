# IManagedShallow

Компонент высшего порядка makeField
перехватывает управление над свойствами
поля

## Properties

### isDisabled

```ts
isDisabled: (v: Data, payload: Payload) => boolean
```

### isVisible

```ts
isVisible: (v: Data, payload: Payload) => boolean
```

### isReadonly

```ts
isReadonly: (v: Data, payload: Payload) => boolean
```

### isInvalid

```ts
isInvalid: (v: Data, payload: Payload) => string
```

### isIncorrect

```ts
isIncorrect: (v: Data, payload: Payload) => string
```

### invalidity

```ts
invalidity: (name: string, e: string, payload: Payload) => void
```

### shouldRecompute

```ts
shouldRecompute: (prevData: Data, nextData: Data, payload: Payload) => boolean
```

### shouldUpdateItemList

```ts
shouldUpdateItemList: (prevData: Data, currentData: Data, payload: Payload) => boolean
```

### shouldUpdateTr

```ts
shouldUpdateTr: (prevArgs: [string, Data], currentArgs: [string, Data], payload: Payload) => boolean
```

### debug

```ts
debug: (params: IDebug<Data, Payload>) => void
```

### compute

```ts
compute: (v: Data, payload: Payload) => Value | Promise<Value>
```

### click

```ts
click: (name: string, e: MouseEvent<HTMLElement, MouseEvent>, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

### focus

```ts
focus: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

### blur

```ts
blur: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

### menuItems

```ts
menuItems: IFieldMenu<any, any>[]
```

### menu

```ts
menu: (name: string, action: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

### map

```ts
map: (data: Data, payload: Payload) => Data
```

### defaultValue

```ts
defaultValue: Value | ((payload: Payload) => Value)
```

### hidden

```ts
hidden: boolean | ((payload: Payload) => boolean)
```

### features

```ts
features: string[]
```
