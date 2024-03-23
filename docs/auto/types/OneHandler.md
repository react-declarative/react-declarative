# OneHandler

```ts
export type OneHandler<Data = IAnything, Payload = IAnything> = Data | ((payload: Payload) => DataOrNull<Data>) | ((payload: Payload) => Promise<DataOrNull<Data>>) | null;
```

Represents a OneHandler class that can handle data or perform asynchronous tasks with payload.
