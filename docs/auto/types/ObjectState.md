# ObjectState

```ts
type ObjectState<P extends any = object, A = any> = ((payload: P) => Promise<A>) | ((payload: P) => A);
```

Represents the state of an object with optional payload and result.
