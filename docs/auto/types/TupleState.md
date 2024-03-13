# TupleState

```ts
type TupleState<P extends any = object, A = any, B = any, C = any, D = any, E = any, F = any, G = any, H = any, I = any, J = any> = ((payload: P) => readonly [
    Promise<A>?,
    Promise<B>?,
    Promise<C>?,
    Promise<D>?,
    Promise<E>?,
    Promise<F>?,
    Promise<G>?,
    Promise<H>?,
    Promise<I>?,
    Promise<J>?
]) | ((payload: P) => readonly [
    A?,
    B?,
    C?,
    D?,
    E?,
    F?,
    G?,
    H?,
    I?,
    J?
]) | ((payload: P) => [
    Promise<A>?,
    Promise<B>?,
    Promise<C>?,
    Promise<D>?,
    Promise<E>?,
    Promise<F>?,
    Promise<G>?,
    Promise<H>?,
    Promise<I>?,
    Promise<J>?
]) | ((payload: P) => [
    A?,
    B?,
    C?,
    D?,
    E?,
    F?,
    G?,
    H?,
    I?,
    J?
]);
```


