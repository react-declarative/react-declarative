# EventEmitter

## Constructor

```ts
constructor();
```

## Properties

### getListeners

```ts
getListeners: (key: EventKey) => Function[]
```

### subscribe

```ts
subscribe: (eventName: EventKey, callback: Function) => void
```

### unsubscribe

```ts
unsubscribe: (eventName: EventKey, callback: Function) => void
```

### unsubscribeAll

```ts
unsubscribeAll: () => void
```

### once

```ts
once: (eventName: EventKey, callback: Function) => () => void
```

### emit

```ts
emit: (eventName: EventKey, ...args: any[]) => Promise<void>
```
