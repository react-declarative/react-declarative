# IPreventLeaveReturn

Interface for a class that prevents leaving and returning to a page or component.

## Properties

### oneProps

```ts
oneProps: { apiRef: any; handler: () => Data; change: (data: Data, initial?: boolean) => void; invalidity: (name: string, msg: string, payload: any) => void; readonly: boolean; changeSubject: TSubject<...>; fallback?: (e: Error) => void; }
```

### apiRef

```ts
apiRef: MutableRefObject<IOneApi<Data>>
```

### invalid

```ts
invalid: boolean
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
waitForChanges: () => Promise<Data>
```
