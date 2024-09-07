# DebouncedState

Subsequent calls to the debounced function `debounced.callback` return the result of the last func invocation.
Note, that if there are no previous invocations it's mean you will get undefined. You should check it in your
code properly.
Subsequent calls to the debounced function `debounced.callback` return the result of the last func invocation.
Note, that if there are no previous invocations it's mean you will get undefined. You should check it in your
code properly.

## Properties

### callback

```ts
callback: (...args: Parameters<T>) => ReturnType<T>
```
