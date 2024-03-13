# ObjectState

```ts
type ObjectState<P extends any = object, A = any> = ((payload: P) => Promise<A>) | ((payload: P) => A);
```


