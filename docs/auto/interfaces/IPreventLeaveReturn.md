# IPreventLeaveReturn

Interface for a class that prevents leaving and returning to a page or component.

## Properties

### oneProps

```ts
oneProps: { change: (data: Data, initial?: boolean) => void; invalidity: (name: string, msg: string, payload: any) => void; readonly: boolean; changeSubject: TSubject<Data>; fallback?: (e: Error) => void; }
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

### beginSave

```ts
beginSave: () => Promise<boolean>
```

### afterSave

```ts
afterSave: () => void
```

### dropChanges

```ts
dropChanges: () => void
```

### waitForChanges

```ts
waitForChanges: () => Promise<void>
```
