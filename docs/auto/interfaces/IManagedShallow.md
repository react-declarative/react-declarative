# IManagedShallow

Компонент высшего порядка makeField
перехватывает управление над свойствами
поля

## Properties

### dirty

```ts
dirty: boolean
```

Отменяет ожидание фокуса для валидации

### testId

```ts
testId: string
```

Идентификатор для тестирования шаблона

### isDisabled

```ts
isDisabled: (v: Data, payload: Payload) => boolean
```

### isVisible

```ts
isVisible: (v: Data, payload: Payload) => boolean
```

Determines the visibility of a field.

### isReadonly

```ts
isReadonly: (v: Data, payload: Payload) => boolean
```

Retrieves the value of the 'isReadonly' property from the given variable.

### isInvalid

```ts
isInvalid: (v: Data, payload: Payload) => string
```

### isIncorrect

```ts
isIncorrect: (v: Data, payload: Payload) => string
```

Checks if the field is incorrect.

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

Check if 'shouldUpdateItemList' property is present in the given variable.

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

Type definition for the `compute` property of an object.

### click

```ts
click: (name: string, e: MouseEvent<HTMLElement, MouseEvent>, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

Represents the "click" property of a specific field in a data object.

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

Retrieves the defaultValue property from the given field.

### hidden

```ts
hidden: boolean | ((payload: Payload) => boolean)
```

### features

```ts
features: string[]
```

Extracts the 'features' property from the given variable.
