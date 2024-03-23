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

Begins the save process.

### afterSave

```ts
afterSave: () => Promise<void>
```

Executes the afterSave logic.

### dirty

```ts
dirty: boolean
```

Indicates whether a certain state is dirty.

### formState

```ts
formState: { change: (data: Data) => void; data: Data; hasChanged: boolean; hasLoading: boolean; hasInvalid: boolean; payload: Payload; id: string; }
```

### history

```ts
history: History
```

Represents the history of an outlet.

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

Represents the data of the outlet.

### hasChanged

```ts
hasChanged: boolean
```

Indicates whether a change has occurred.

### hasLoading

```ts
hasLoading: boolean
```

### hasInvalid

```ts
hasInvalid: boolean
```

Indicates whether the value is invalid.

### params

```ts
params: Params
```

### payload

```ts
payload: Payload
```

Represents a payload object.
