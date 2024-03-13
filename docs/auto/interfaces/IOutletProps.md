# IOutletProps

Represents the properties of an outlet inner component.

## Properties

### onChange

```ts
onChange: (data: Data[keyof Data], initial?: boolean) => void
```

### onInvalid

```ts
onInvalid: (name: string, msg: string) => void
```

### beginSave

```ts
beginSave: () => Promise<boolean>
```

### afterSave

```ts
afterSave: () => Promise<void>
```

### dirty

```ts
dirty: boolean
```

### formState

```ts
formState: { change: (data: Data) => void; data: Data; hasChanged: boolean; hasLoading: boolean; hasInvalid: boolean; payload: Payload; id: string; }
```

### history

```ts
history: History
```

### activeOption

```ts
activeOption: string
```

### readonly

```ts
readonly: boolean
```

### data

```ts
data: Data
```

### hasChanged

```ts
hasChanged: boolean
```

### hasLoading

```ts
hasLoading: boolean
```

### hasInvalid

```ts
hasInvalid: boolean
```

### params

```ts
params: Params
```

### payload

```ts
payload: Payload
```
