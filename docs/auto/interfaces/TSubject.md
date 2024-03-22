# TSubject

Interface representing a subject that can be subscribed to and trigger callbacks when data is updated.

## Properties

### subscribe

```ts
subscribe: (callback: (data: Data) => void) => () => void
```

Subscribe to receive data updates.

### once

```ts
once: (callback: (data: Data) => void) => () => void
```

Executes the provided callback function once, and returns a cleanup function.

### next

```ts
next: (data: Data) => void
```

Executes the next function with the provided data.
