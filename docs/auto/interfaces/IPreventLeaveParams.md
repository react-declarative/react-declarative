# IPreventLeaveParams

Interface for the parameters of the IPreventLeaveParams class.

## Properties

### history

```ts
history: MemoryHistory | BrowserHistory | HashHistory
```

### waitForChangesDelay

```ts
waitForChangesDelay: number
```

### readonly

```ts
readonly: boolean
```

### data

```ts
data: Data
```

### updateSubject

```ts
updateSubject: TSubject<[ID, Data]>
```

### changeSubject

```ts
changeSubject: TSubject<Data>
```

### shouldAutoSave

```ts
shouldAutoSave: () => boolean
```

### checkUpdate

```ts
checkUpdate: (id: ID, data: Data) => boolean
```

### checkDirty

```ts
checkDirty: (prevData: Data, currentData: Data) => boolean
```

### onChange

```ts
onChange: (Data: Data, initial: boolean) => void
```

### onBlock

```ts
onBlock: () => void | (() => void)
```

### onUpdate

```ts
onUpdate: (id: ID, data: Data) => void
```

### onSave

```ts
onSave: (data: Data) => boolean | Promise<boolean>
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
